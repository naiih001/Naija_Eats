// import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FilterIcon, TrendDownIcon } from "../../constants/icons";
import { WeekPlan } from "../../constants/weekPlan";
import { planService } from "../../services/plan.api";

const WeeklyPlan = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getMealPlan = async () => {
      const data = await planService.getCurrentMealPlan();
      console.log("Current meal plan data in WeeklyPlan:", data);
    };
    getMealPlan();
  }, []);

  return (
    <div className="bg-bg-background min-h-screen pb-50 lg:pb-30">
      {/* Weekly Budget Summary Card */}
      <div className="p-4">
        <div className="bg-text-link rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Weekly Budget Summary
            </span>
            <div className="text-4xl font-display font-bold mt-1">₦8,900</div>
            <div className="flex items-center gap-1 mt-2 text-[10px] opacity-80">
              <TrendDownIcon className={"text-lg"} />
              <span>12% lower than last week</span>
            </div>
          </div>
          <Button
            variant="primary"
            className="absolute right-6 bottom-6 py-2 px-6 rounded-xl text-sm"
          >
            Adjust
          </Button>
        </div>
      </div>

      {/* Title Header */}
      <div className="px-5 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-display font-extrabold text-text-primary lg:mb-6">
          Full Weekly Plan
        </h2>
        <FilterIcon className="text-text-primary w-6 h-6 opacity-80 cursor-pointer" />
      </div>

      {/* Plan List */}
      <div className="px-4 space-y-6 lg:flex lg:flex-wrap lg:justify-center gap-6 w-full">
        {WeekPlan.map((dayPlan, idx) => (
          <div key={idx} className="space-y-3 lg:min-w-xs">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-6 rounded-full ${dayPlan.color}`}></div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                {dayPlan.day}
              </h3>
            </div>

            <div className="bg-white border border-text-muted/20 rounded-2xl overflow-hidden shadow-sm ">
              {dayPlan.meals.map((meal, mIdx) => (
                <div
                  key={mIdx}
                  onClick={() =>
                    navigate(
                      `/meal/${meal.name.toLowerCase().replace(/ /g, "-")}`,
                    )
                  }
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-black/5 transition-colors ${
                    mIdx !== dayPlan.meals.length - 1
                      ? "border-b border-text-muted/10"
                      : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-text-muted/10 rounded-xl flex items-center justify-center">
                    {meal.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-text-muted/70 tracking-wider">
                      {meal.type}
                    </span>
                    <div className="text-sm font-bold text-text-primary">
                      {meal.name}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-orange-900">
                    {meal.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 py-4 px-2 bg-bg-background/80 backdrop-blur-md space-y-3 z-50 flex flex-col lg:flex-row gap-4">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate("/market")}
        >
          Accept Plan
        </Button>
        <Button variant="outline" className="w-full ">
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlan;
