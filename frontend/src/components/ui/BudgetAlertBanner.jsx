// import { useState } from "react";
import { useState } from "react";
import { WarningIcon } from "../../constants/icons";

const BudgetAlertBanner = ({
  shoppingListTotal = 0,
  budgetLimit = 0,
  isVisible = false,
}) => {
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // Compute whether to show based on props
  const shouldShow =
    isVisible &&
    shoppingListTotal > budgetLimit &&
    !dismissedAlert &&
    budgetLimit > 0;
  const overAmount = shoppingListTotal - budgetLimit;
  const utilization =
    budgetLimit > 0 ? Math.round((shoppingListTotal / budgetLimit) * 100) : 0;

  if (!shouldShow) return null;

  return (
    <div className="animate-in slide-in-from-top duration-300 bg-red-50 border-b border-red-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <WarningIcon className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold text-red-700">Budget Alert</p>
            <p className="text-xs text-red-600">
              Your shopping list is{" "}
              <span className="font-semibold">
                ₦{overAmount.toLocaleString()}
              </span>{" "}
              over your ₦{budgetLimit.toLocaleString()} budget ({utilization}%)
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissedAlert(true)}
          className="text-red-600 hover:text-red-700 font-bold text-lg shrink-0"
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default BudgetAlertBanner;
