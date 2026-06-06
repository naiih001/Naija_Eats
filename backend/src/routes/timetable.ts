import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";
import { generateTimetable, formatPlan } from "../services/timetable.service";

const router = Router();

// GET /timetable/generate
// Retrieves the active timetable for the authenticated user
router.get("/generate", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const activePlan = await prisma.meal_plans.findFirst({
      where: { user_id: user.id, status: "active" },
      include: { items: { include: { meal: true } } },
    });

    if (!activePlan || activePlan.items.length === 0) {
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
    const plan = await generateTimetable(user.id);
    return _res.success(201, res, "Timetable generated successfully", plan);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, err instanceof Error ? err.message : "Failed to generate timetable");
  }
});

// PUT /timetable/items/:itemId
// Swaps a single meal in the active timetable
router.put("/items/:itemId", async (req: Request, res: Response) => {
  const user = req.user!;
  const itemId = req.params.itemId as string;
  const { mealId } = req.body;

  if (!mealId || typeof mealId !== "string") {
    return _res.error(400, res, "A new mealId is required in the request body");
  }

  try {
    const activePlan = await prisma.meal_plans.findFirst({
      where: { user_id: user.id, status: "active" },
      include: { items: true },
    });

    if (!activePlan) {
      return _res.error(404, res, "No active timetable found. Please generate one first.");
    }

    const targetItem = activePlan.items.find((item) => item.id === itemId);
    if (!targetItem) {
      return _res.error(404, res, "Timetable item not found. Make sure the item ID is correct.");
    }

    const newMeal = await prisma.meals.findUnique({ where: { id: mealId } });
    if (!newMeal) {
      return _res.error(404, res, "Meal not found. Please provide a valid meal ID.");
    }

    const budget = await prisma.budgets.findUnique({ where: { user_id: user.id } });
    const budgetVal = parseInt(budget?.value || "0", 10);
    if (budgetVal > 0) {
      const currentTotal = activePlan.items.reduce(
        (sum, item) => sum + (item.price_at_time ? Number(item.price_at_time) : 0),
        0,
      );
      const newPrice = newMeal.price_min ? Number(newMeal.price_min) : 0;
      const oldPrice = targetItem.price_at_time ? Number(targetItem.price_at_time) : 0;
      const newTotal = currentTotal - oldPrice + newPrice;
      if (newTotal > budgetVal) {
        return _res.error(
          400,
          res,
          `Swapping in "${newMeal.name}" would exceed your budget of ₦${budgetVal.toLocaleString()}. Choose a cheaper meal instead.`,
        );
      }
    }

    const updatedPlan = await prisma.$transaction(async (tx) => {
      await tx.meal_plan_items.update({
        where: { id: itemId },
        data: {
          meal_id: mealId,
          price_at_time: newMeal.price_min ? Number(newMeal.price_min) : 0,
        },
      });

      await tx.shopping_list_items.deleteMany({
        where: { meal_plan_id: activePlan.id },
      });

      const allItems = await tx.meal_plan_items.findMany({
        where: { plan_id: activePlan.id },
        select: { meal_id: true },
      });

      const mealIds = [...new Set(allItems.map((i) => i.meal_id))];
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
              meal_plan_id: activePlan.id,
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
        where: { id: activePlan.id },
        include: { items: { include: { meal: true } } },
      });

      return formatPlan(planWithMeals!);
    });

    return _res.success(200, res, `"${newMeal.name}" swapped in successfully`, updatedPlan);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to swap meal. Please try again.");
  }
});

export default router;
