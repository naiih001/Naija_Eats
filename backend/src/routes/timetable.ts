import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";
import { PrismaClient } from "@prisma/client";

const router = Router();

type PrismaTx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

interface FilterOptions {
  cuisine?: string;
  maxPrepTime?: number;
  categories?: string[];
  vegetarianOnly?: boolean;
  restrictionTags?: string[];
  includeDessert?: boolean;
  perMealMax?: number;
}

async function getFilteredMeals(tx: PrismaTx, filters: FilterOptions) {
  const conditions: any[] = [];

  if (filters.cuisine) {
    conditions.push({ cuisine: filters.cuisine });
  }

  if (filters.maxPrepTime) {
    conditions.push({ prep_time_mins: { lte: filters.maxPrepTime } });
  }

  if (filters.categories) {
    conditions.push({ category: { in: filters.categories } });
  }

  if (filters.vegetarianOnly) {
    conditions.push({
      OR: [
        { dietary_tags: { contains: "vegetarian" } },
        { dietary_tags: "" },
      ],
    });
  }

  if (filters.restrictionTags && filters.restrictionTags.length > 0) {
    for (const tag of filters.restrictionTags) {
      conditions.push({
        OR: [
          { dietary_tags: { contains: tag } },
          { dietary_tags: "" },
        ],
      });
    }
  }

  if (filters.includeDessert === false) {
    conditions.push({ category: { not: "Dessert" } });
  }

  const where = conditions.length > 0 ? { AND: conditions } : {};
  let meals = await tx.meals.findMany({ where });

  if (filters.perMealMax && filters.perMealMax < Infinity) {
    meals = meals.filter((m) => {
      const price = m.price_min ? Number(m.price_min) : 0;
      return price <= filters.perMealMax!;
    });
  }

  return meals;
}

function formatPlan(plan: any) {
  return {
    ...plan,
    items: plan.items.map((item: any) => ({
      ...item,
      meal: {
        ...item.meal,
        price_min: item.meal.price_min ? Number(item.meal.price_min) : null,
        price_max: item.meal.price_max ? Number(item.meal.price_max) : null,
      },
    })),
  };
}

// GET /timetable/generate
// Retrieves the active timetable for the authenticated user
router.get("/generate", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const activePlan = await prisma.meal_plans.findFirst({
      where: { user_id: user.id, status: "active" },
      include: { items: { include: { meal: true } } },
    });

    if (!activePlan) {
      return _res.error(404, res, "No active timetable found");
    }

    return _res.success(200, res, "Timetable retrieved successfully", formatPlan(activePlan));
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to retrieve timetable");
  }
});

// POST /timetable/generate
// Generates a new timetable respecting user preferences
router.post("/generate", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    // 1. Delete existing active plan
    await prisma.meal_plans.deleteMany({
      where: { user_id: user.id, status: "active" },
    });

    // 2. Fetch user preferences
    const [budget, household, preferences, dietaryRestrictions] = await Promise.all([
      prisma.budgets.findUnique({ where: { user_id: user.id } }),
      prisma.household_profiles.findUnique({ where: { user_id: user.id } }),
      prisma.user_preferences.findMany({ where: { user_id: user.id } }),
      prisma.dietary_tags.findMany({ where: { user_id: user.id } }),
    ]);

    const dailyMeals = Math.min(Math.max(parseInt(household?.daily_meals || "3", 10), 1), 3);
    const includeDessert = household?.is_dessert ?? false;
    const budgetVal = parseInt(budget?.value || "0", 10);
    const perMealMax = budgetVal > 0 ? Math.floor(budgetVal / (dailyMeals * 7)) : Infinity;
    const prefCategories = preferences.map((p) => p.preference);
    const restrictionTags = dietaryRestrictions.map((d) => d.tag.toLowerCase());

    // 3. Build initial filter options from user preferences
    const filterOpts: FilterOptions = {
      cuisine: prefCategories.includes("Traditional Nigerian Meals") ? "Nigerian" : undefined,
      maxPrepTime: prefCategories.includes("Quick Meals") ? 20 : undefined,
      categories: prefCategories.includes("Light Snacks") ? ["Snack", "Side"] : undefined,
      vegetarianOnly: prefCategories.includes("Vegetarian Options"),
      restrictionTags: restrictionTags.length > 0 ? restrictionTags : undefined,
      includeDessert,
      perMealMax,
    };

    // 4. Try to get meals with full filtering, fallback progressively
    let pool = await getFilteredMeals(prisma, filterOpts);

    if (pool.length < 7) {
      pool = await getFilteredMeals(prisma, {
        restrictionTags: restrictionTags.length > 0 ? restrictionTags : undefined,
        includeDessert,
        perMealMax,
      });
    }

    if (pool.length < 7) {
      pool = await getFilteredMeals(prisma, { includeDessert, perMealMax });
    }

    if (pool.length < 7) {
      pool = await getFilteredMeals(prisma, {});
    }

    if (pool.length === 0) {
      throw new Error("No meals available to generate timetable");
    }

    // 5. Determine slots based on daily_meals
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const slots = dailyMeals >= 3
      ? ["Breakfast", "Lunch", "Dinner"]
      : dailyMeals === 2
        ? ["Breakfast", "Dinner"]
        : ["Dinner"];

    // 6. Categorize meals for slot-appropriate assignment
    const breakfastMeals = pool.filter((m) => m.category === "Breakfast");
    const lunchDinnerMeals = pool.filter((m) =>
      ["Main", "Side", "Swallow"].includes(m.category),
    );
    const allOtherMeals = pool;

    // 7. Run atomic writes in a short transaction
    const newPlan = await prisma.$transaction(async (tx) => {
      const createdPlan = await tx.meal_plans.create({
        data: { user_id: user.id, status: "active" },
      });

      const itemsData: Array<{
        plan_id: string;
        meal_id: string;
        day_of_week: string;
        meal_slot: string;
      }> = [];

      for (const day of days) {
        for (const slot of slots) {
          let candidates: typeof pool;

          if (slot === "Breakfast") {
            candidates = breakfastMeals.length > 0 ? breakfastMeals : allOtherMeals;
          } else {
            candidates = lunchDinnerMeals.length > 0 ? lunchDinnerMeals : allOtherMeals;
          }

          const meal = candidates[Math.floor(Math.random() * candidates.length)];
          itemsData.push({
            plan_id: createdPlan.id,
            meal_id: meal.id,
            day_of_week: day,
            meal_slot: slot,
          });
        }
      }

      await tx.meal_plan_items.createMany({ data: itemsData });

      const planWithMeals = await tx.meal_plans.findUnique({
        where: { id: createdPlan.id },
        include: { items: { include: { meal: true } } },
      });

      return formatPlan(planWithMeals!);
    });

    return _res.success(201, res, "Timetable generated successfully", newPlan);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, err instanceof Error ? err.message : "Failed to generate timetable");
  }
});

export default router;
