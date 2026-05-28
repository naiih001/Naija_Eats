import { useState } from "react";
import Button from "./Button";

export const WeeklySummaryCard = () => {
  const bufferedAmount = JSON.parse(localStorage.getItem("buffered_budget"));
  const amount = bufferedAmount?.amount;
  const [budget, setBudget] = useState(amount);
  const [adjustValue, setAdjustValue] = useState(false);
  const handleAdjustBudget = () => {
    console.log("adjustValue before:", adjustValue);
    if (adjustValue) {
      const bufferedAmount = JSON.parse(
        localStorage.getItem("buffered_budget"),
      );
      const updated = { ...bufferedAmount, amount: budget };
      localStorage.setItem("buffered_budget", JSON.stringify(updated));
    }
    setAdjustValue((prev) => !prev);
  };
  return (
    <>
      {/* Weekly Budget Summary Card */}
      <div className="p-4 relative z-100">
        <div className="bg-text-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-lg justify-between flex items-center gap-6">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Weekly Budget Summary
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-4xl font-display font-bold">₦</span>
              {adjustValue ? (
                <input
                  value={budget}
                  type="text"
                  onChange={(e) => setBudget(e.target.value)}
                  className="text-4xl font-display font-bold bg-transparent outline-none border-b border-white/50 w-40"
                />
              ) : (
                <span className="text-4xl font-display font-bold">
                  {Number(budget).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            className="py-2 px-6 rounded-xl text-sm cursor-pointer hover:bg-orange-600 transition-colors"
            onClick={handleAdjustBudget}
          >
            {adjustValue ? "Save" : "Adjust"}
          </Button>
        </div>
      </div>
    </>
  );
};
