import { useContext } from "react";
import { BudgetAlertContext } from "./BudgetAlertContextProvider";

export const useBudgetAlert = () => {
  const context = useContext(BudgetAlertContext);
  if (!context) {
    throw new Error(
      "useBudgetAlert must be used within BudgetAlertProvider"
    );
  }
  return context;
};
