import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";

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

    if (!activePlan) {
      return _res.error(404, res, "No active timetable found");
    }

    return _res.success(200, res, "Timetable retrieved successfully", activePlan);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, "Failed to retrieve timetable");
  }
});

// POST /timetable/generate
// Generates a new random timetable, deleting any existing active one
router.post("/generate", async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const newPlan = await prisma.$transaction(async (tx) => {
      // 1. Delete existing active plan and items (Cascade handles items)
      await tx.meal_plans.deleteMany({
        where: { user_id: user.id, status: "active" },
      });

      // 2. Fetch meals (Simple approach: get all)
      const allMeals = await tx.meals.findMany();
      if (allMeals.length === 0) {
        throw new Error("No meals available to generate timetable");
      }

      // 3. Create new plan
      const plan = await tx.meal_plans.create({
        data: { user_id: user.id, status: "active" },
      });

      // 4. Generate random items (7 days, 3 slots each)
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const slots = ["Breakfast", "Lunch", "Dinner"];
      const itemsData = [];

      for (const day of days) {
        for (const slot of slots) {
          const randomMeal = allMeals[Math.floor(Math.random() * allMeals.length)];
          itemsData.push({
            plan_id: plan.id,
            meal_id: randomMeal.id,
            day_of_week: day,
            meal_slot: slot,
          });
        }
      }

      await tx.meal_plan_items.createMany({ data: itemsData });

      return await tx.meal_plans.findUnique({
        where: { id: plan.id },
        include: { items: { include: { meal: true } } },
      });
    });

    return _res.success(201, res, "Timetable generated successfully", newPlan);
  } catch (err) {
    console.error(err);
    return _res.error(500, res, err instanceof Error ? err.message : "Failed to generate timetable");
  }
});

export default router;
