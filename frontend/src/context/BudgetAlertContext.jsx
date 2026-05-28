import { useState } from "react";
import { BudgetAlertContext } from "./BudgetAlertContextProvider";

const initializeBudgetLimit = () => {
  const budgetData = localStorage.getItem("onboarding_budget");
  if (budgetData) {
    try {
      const parsed = JSON.parse(budgetData);
      return parsed.amount || 0;
    } catch (err) {
      console.error("Failed to parse budget data:", err);
      return 0;
    }
  }
  return 0;
};

export function BudgetAlertProvider({ children }) {
  const [shoppingListTotal, setShoppingListTotal] = useState(0);
  const [budgetLimit] = useState(initializeBudgetLimit);

  // Derived: alert is active only when total strictly exceeds the budget limit
  const showBudgetAlert =
    budgetLimit > 0 && shoppingListTotal > budgetLimit;

  const value = {
    shoppingListTotal,
    setShoppingListTotal,
    budgetLimit,
    showBudgetAlert,
  };

  return (
    <BudgetAlertContext.Provider value={value}>
      {children}
    </BudgetAlertContext.Provider>
  );
}
