import { prisma } from "../config/prisma";
import { PrismaClient } from "@prisma/client";
import { safeParseInstructions } from "../utils/helper";

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

export function formatPlan(plan: any) {
  return {
    ...plan,
    items: plan.items.map((item: any) => ({
      ...item,
      price_at_time: item.price_at_time ? Number(item.price_at_time) : null,
      meal: {
        ...item.meal,
        instructions: item.meal.instructions ? safeParseInstructions(item.meal.instructions) : null,
        price_min: item.meal.price_min ? Number(item.meal.price_min) : null,
        price_max: item.meal.price_max ? Number(item.meal.price_max) : null,
      },
    })),
  };
}

export async function generateTimetable(userId: string) {
  await prisma.meal_plans.deleteMany({
    where: { user_id: userId, status: "active" },
  });

  const [budget, household, preferences, dietaryRestrictions] = await Promise.all([
    prisma.budgets.findUnique({ where: { user_id: userId } }),
    prisma.household_profiles.findUnique({ where: { user_id: userId } }),
    prisma.user_preferences.findMany({ where: { user_id: userId } }),
    prisma.dietary_tags.findMany({ where: { user_id: userId } }),
  ]);

  const dailyMeals = Math.min(Math.max(parseInt(household?.daily_meals || "3", 10), 1), 3);
  const includeDessert = household?.is_dessert ?? false;
  const budgetVal = parseInt(budget?.value || "0", 10);
  const perMealMax = budgetVal > 0 ? Math.floor(budgetVal / (dailyMeals * 7)) : Infinity;
  const prefCategories = preferences.map((p) => p.preference);
  const restrictionTags = dietaryRestrictions.map((d) => d.tag.toLowerCase());

  const filterOpts: FilterOptions = {
    cuisine: prefCategories.includes("Traditional Nigerian Meals") ? "Nigerian" : undefined,
    maxPrepTime: prefCategories.includes("Quick Meals") ? 20 : undefined,
    categories: prefCategories.includes("Light Snacks") ? ["Snack", "Side"] : undefined,
    vegetarianOnly: prefCategories.includes("Vegetarian Options"),
    restrictionTags: restrictionTags.length > 0 ? restrictionTags : undefined,
    includeDessert,
    perMealMax,
  };

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

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const slots = dailyMeals >= 3
    ? ["Breakfast", "Lunch", "Dinner"]
    : dailyMeals === 2
      ? ["Breakfast", "Dinner"]
      : ["Dinner"];

  const breakfastMeals = pool.filter((m) => m.category === "Breakfast");
  const lunchDinnerMeals = pool.filter((m) =>
    ["Main", "Side", "Swallow"].includes(m.category),
  );
  const allOtherMeals = pool;

  const selectedItems: Array<{
    meal_id: string;
    day_of_week: string;
    meal_slot: string;
    price_at_time: number;
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
      selectedItems.push({
        meal_id: meal.id,
        day_of_week: day,
        meal_slot: slot,
        price_at_time: meal.price_min ? Number(meal.price_min) : 0,
      });
    }
  }

  const totalCost = selectedItems.reduce((sum, item) => sum + item.price_at_time, 0);
  if (budgetVal > 0 && totalCost > budgetVal) {
    throw new Error("Generated timetable exceeds your budget");
  }

  const newPlan = await prisma.$transaction(async (tx) => {
    const createdPlan = await tx.meal_plans.create({
      data: { user_id: userId, status: "active" },
    });

    const itemsData = selectedItems.map((item) => ({
      plan_id: createdPlan.id,
      meal_id: item.meal_id,
      day_of_week: item.day_of_week,
      meal_slot: item.meal_slot,
      price_at_time: item.price_at_time,
    }));

    await tx.meal_plan_items.createMany({ data: itemsData });

    const mealIds = [...new Set(selectedItems.map((i) => i.meal_id))];
    const mealsWithIngredients = await tx.meals.findMany({
      where: { id: { in: mealIds } },
      select: { ingredients: true },
    });

    const seen = new Set<string>();
    const shoppingItems: Array<{
      meal_plan_id: string;
      name: string;
      category: string | null;
      quantity: string | null;
    }> = [];

    for (const meal of mealsWithIngredients) {
      const ingredients: Array<{ name: string; category?: string; quantity?: string }> =
        (meal.ingredients as any) ?? [];
      for (const ing of ingredients) {
        if (!seen.has(ing.name)) {
          seen.add(ing.name);
          shoppingItems.push({
            meal_plan_id: createdPlan.id,
            name: ing.name,
            category: ing.category ?? null,
            quantity: ing.quantity ?? null,
          });
        }
      }
    }

    if (shoppingItems.length > 0) {
      await tx.shopping_list_items.createMany({ data: shoppingItems });
    }

    const planWithMeals = await tx.meal_plans.findUnique({
      where: { id: createdPlan.id },
      include: { items: { include: { meal: true } } },
    });

    return formatPlan(planWithMeals!);
  });

  return newPlan;
}
