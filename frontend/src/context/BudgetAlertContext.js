import { createContext, useContext } from "react";

export const BudgetAlertContext = createContext();

export const useBudgetAlert = () => {
  const context = useContext(BudgetAlertContext);
  if (!context) {
    throw new Error(
      "useBudgetAlert must be used within BudgetAlertProvider"
    );
  }
  return context;
};
