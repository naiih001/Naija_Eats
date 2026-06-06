import { prisma } from "../config/prisma";

export const calculateBudgetTier = (amount: number, frequency: string): string => {
  if (frequency === "Weekly") {
    if (amount < 7000) return "Low";
    if (amount < 10000) return "Standard";
    return "Premium";
  } else {
    // Monthly or other
    if (amount < 30000) return "Low";
    if (amount < 70000) return "Standard";
    return "Premium";
  }
};

export const getBudgetStatus = async (userId: string) => {
  const budget = await prisma.budgets.findUnique({
    where: { user_id: userId },
  });

  if (!budget) return null;

  const budgetLimit = parseInt(budget.value || "0", 10);

  const activePlan = await prisma.meal_plans.findFirst({
    where: { user_id: userId, status: "active" },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });

  let currentSpending = 0;
  if (activePlan && activePlan.items) {
    currentSpending = activePlan.items.reduce((sum, item) => {
      const price = item.price_at_time
        ? Number(item.price_at_time)
        : item.meal.price_min
          ? Number(item.meal.price_min)
          : 0;
      return sum + price;
    }, 0);
  }

  const exceeded = currentSpending > budgetLimit;
  const remaining = Math.max(0, budgetLimit - currentSpending);
  const overage = Math.max(0, currentSpending - budgetLimit);
  const utilization = budgetLimit > 0 ? Math.round((currentSpending / budgetLimit) * 100) : 0;

  return {
    limit: budgetLimit,
    currentSpending,
    remaining,
    overage,
    exceeded,
    utilization,
    tier: budget.tier,
    frequency: budget.frequency,
    buffer: budget.fluctuation_buffer,
    planId: activePlan?.id || null,
  };
};
