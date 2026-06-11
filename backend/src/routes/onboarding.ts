import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res, safeParseInstructions } from "../utils/helper";
import { calculateBudgetTier, getBudgetStatus } from "../utils/budget";
import { generateTimetable } from "../services/timetable.service";

const router = Router();

// GET /api/budget/status
// Calculates and returns the user's budget status based on active meal plan
router.get("/budget/status", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const status = await getBudgetStatus(user.id);
    if (!status) {
      return _res.error(404, res, "Budget not found");
    }
    return _res.success(200, res, "Budget status retrieved successfully", status);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to retrieve budget status");
  }
});

// GET /api/users/preferences/budget
// Retrieves the user's raw budget settings
router.get("/users/preferences/budget", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const budget = await prisma.budgets.findUnique({
      where: { user_id: user.id },
    });

    if (!budget) {
      return _res.error(404, res, "Budget preferences not found");
    }

    // Include current status for convenience
    const status = await getBudgetStatus(user.id);

    return _res.success(200, res, "Budget preferences retrieved successfully", {
      budget,
      status
    });
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to retrieve budget preferences");
  }
});

// POST /api/users/preferences/budget
router.post(
  "/users/preferences/budget",
  async (req: Request, res: Response) => {
    const user = req.user!;
    let { budgetTier, budgetValue, frequency, fluctuationBuffer } = req.body;

    // Move Logic: Calculate tier on backend to ensure consistency and offload from frontend
    const amountNum = parseInt(budgetValue, 10) || 0;
    const calculatedTier = calculateBudgetTier(amountNum, frequency || "Weekly");

    // Default to calculated tier if not explicitly provided or if we want to enforce consistency
    if (!budgetTier) budgetTier = calculatedTier;

    try {
      const budget = await prisma.budgets.upsert({
        where: { user_id: user.id },
        update: {
          tier: budgetTier,
          value: budgetValue,
          frequency,
          fluctuation_buffer: fluctuationBuffer,
        },
        create: {
          user_id: user.id,
          tier: budgetTier,
          value: budgetValue,
          frequency,
          fluctuation_buffer: fluctuationBuffer,
        },
      });

      return _res.success(200, res, "Budget preferences saved successfully", {
        budget,
        calculatedTier
      });
    } catch (err) {
      console.error(err);
      return _res.error(500, res, "Failed to save budget preferences");
    }
  },
);

// POST /api/users/preferences/frequency
router.post(
  "/users/preferences/frequency",
  async (req: Request, res: Response) => {
    const user = req.user!;
    const { householdSize, dailyMeals, includeDesserts, cookingFrequencies } =
      req.body;

    try {
      await prisma.household_profiles.upsert({
        where: { user_id: user.id },
        update: {
          household_size: householdSize,
          daily_meals: dailyMeals,
          is_dessert: includeDesserts,
          cooking_frequency: cookingFrequencies,
        },
        create: {
          user_id: user.id,
          household_size: householdSize,
          daily_meals: dailyMeals,
          is_dessert: includeDesserts,
          cooking_frequency: cookingFrequencies,
        },
      });

      return _res.success(
        200,
        res,
        "Cooking frequency preferences saved successfully",
      );
    } catch (err) {
      console.error(err);
      return _res.error(
        500,
        res,
        "Failed to save cooking frequency preferences",
      );
    }
  },
);

// POST /api/users/preferences/food
router.post("/users/preferences/food", async (req: Request, res: Response) => {
  const user = req.user!;
  const { selectedPreferences, allergies, dietaryTags } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // Upsert preferences
      await tx.user_preferences.deleteMany({ where: { user_id: user.id } });
      if (selectedPreferences && Array.isArray(selectedPreferences) && selectedPreferences.length > 0) {
        await tx.user_preferences.createMany({
          data: selectedPreferences.map((p: any) => ({
            user_id: user.id,
            preference: p,
          })),
        });
      }

      // Upsert allergies
      await tx.user_allergies.deleteMany({ where: { user_id: user.id } });
      if (allergies) {
        await tx.user_allergies.create({
          data: { user_id: user.id, allergy: Array.isArray(allergies) ? allergies.join(", ") : allergies },
        });
      }

      // Upsert dietary tags
      await tx.dietary_tags.deleteMany({ where: { user_id: user.id } });
      if (dietaryTags && Array.isArray(dietaryTags) && dietaryTags.length > 0) {
        await tx.dietary_tags.createMany({
          data: dietaryTags.map((t: string) => ({ user_id: user.id, tag: t })),
        });
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { onboarded: true },
    });

    return _res.success(200, res, "Food preferences saved successfully");
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to save food preferences");
  }
});

// POST /api/meal-plans/generate
router.post("/meal-plans/generate", async (req: Request, res: Response) => {
  const user = req.user!;
  try {
    const plan = await generateTimetable(user.id);
    return _res.success(201, res, "Meal plan generated successfully", {
      planId: plan.id,
    });
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to generate meal plan");
  }
});

// GET /api/meal-plans/current
router.get("/meal-plans/current", async (req: Request, res: Response) => {
  const user = req.user!;
  try {
    const plan = await prisma.meal_plans.findFirst({
      where: { user_id: user.id, status: "active" },
      include: {
        items: {
          include: {
            meal: true
          }
        }
      }
    });

    if (!plan) return _res.error(404, res, "No active meal plan found");

    const parsedPlan = {
      ...plan,
      items: plan.items.map((item) => ({
        ...item,
        meal: item.meal
          ? { ...item.meal, instructions: safeParseInstructions((item.meal as any).instructions) }
          : item.meal,
      })),
    };

    // Move Logic: Use real budget status data instead of hardcoded values
    const budgetStatus = await getBudgetStatus(user.id);

    return _res.success(200, res, "Meal plan retrieved successfully", {
      plan: parsedPlan,
      budgetStats: budgetStatus ? {
        weeklyBudget: `₦${budgetStatus.limit.toLocaleString()}`,
        currentSpending: `₦${budgetStatus.currentSpending.toLocaleString()}`,
        totalMeals: plan.items.length,
        prepTimeAvg: "35 Mins", // Future: Calculate this from meal data
        exceeded: budgetStatus.exceeded,
        utilization: budgetStatus.utilization
      } : null
    });
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to retrieve meal plan");
  }
});

// GET /api/meal-plans/current/details
router.get(
  "/meal-plans/current/details",
  async (req: Request, res: Response) => {
    const user = req.user!;
    try {
      const plan = await prisma.meal_plans.findFirst({
        where: { user_id: user.id, status: "active" },
        include: {
          items: {
            include: {
              meal: true
            }
          }
        }
      });

      if (!plan) return _res.error(404, res, "No active meal plan found");

      const parsedItems = plan.items.map((item) => ({
        ...item,
        meal: item.meal
          ? { ...item.meal, instructions: safeParseInstructions((item.meal as any).instructions) }
          : item.meal,
      }));

      return _res.success(
        200,
        res,
        "Meal plan details retrieved successfully",
        { items: parsedItems },
      );
    } catch (err) {
      return _res.error(500, res, "Failed to retrieve meal plan details");
    }
  },
);

// GET /api/meal-plans/

export default router;
