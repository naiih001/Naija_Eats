// import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { FilterIcon } from "../constants/icons";
import transformTimetable from "../constants/weekPlan";
import { planService } from "../services/plan.api";
import { WeeklySummaryCard } from "../components/ui/WeeklySummaryCard";
// import { preferencesService } from "../services/preferences.api";

const WeeklyPlan = () => {
  const navigate = useNavigate();
  const [weekPlan, setWeekPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMealPlan = async () => {
      try {
        const cached = localStorage.getItem("weekly_meal_plan");
        if (cached) {
          const parsed = JSON.parse(cached);
          setWeekPlan(transformTimetable(parsed));
          setLoading(false);
          console.log("Loaded meal plan from cache:", parsed);
        } else {
          const data = await planService.getTimetable();
          localStorage.setItem("weekly_meal_plan", JSON.stringify(data));
          setWeekPlan(transformTimetable(data));
          setLoading(false);
          console.log("Fetched meal plan from backend:", data);
        }
      } catch (err) {
        console.error("Failed to load meal plan:", err);
        setLoading(false);
      }
    };
    getMealPlan();
  }, []);

  const handleRegenerate = () => {
    const getNewTimetable = async () => {
      setLoading(true);
      try {
        const data = await planService.getTimetable();
        localStorage.setItem("weekly_meal_plan", JSON.stringify(data));
        setWeekPlan(transformTimetable(data));
        console.log("Regenerated timetable data:", data);
      } catch (err) {
        console.error("Failed to regenerate meal plan:", err);
      } finally {
        setLoading(false);
      }
    };
    getNewTimetable();
  };

  return (
    <>
      <div className="bg-bg-background min-h-screen pb-50 pt-4 px-4 lg:pb-30">
        <WeeklySummaryCard />
        {/* Title Header */}
        <div className=" py-4 flex justify-between items-center">
          <h2 className="text-2xl font-display font-extrabold text-text-primary lg:mb-6">
            Full Weekly Plan
          </h2>
          <FilterIcon className="text-text-primary w-6 h-6 opacity-80 cursor-pointer" />
        </div>

        {/* Plan List */}
        <div className=" space-y-6 lg:flex lg:flex-wrap lg:justify-center gap-6 w-full">
          {loading && weekPlan.length === 0
            ? Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} className="space-y-3 lg:min-w-xs animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-text-muted/20"></div>
                    <div className="h-5 w-24 bg-text-muted/20 rounded-md"></div>
                  </div>
                  <div className="bg-white border border-text-muted/10 rounded-2xl overflow-hidden shadow-sm p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-text-muted/20 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-10 bg-text-muted/20 rounded-md"></div>
                          <div className="h-4 w-32 bg-text-muted/20 rounded-md"></div>
                        </div>
                        <div className="h-3 w-16 bg-text-muted/20 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : weekPlan.map((dayPlan, idx) => (
                <div key={idx} className="space-y-3 lg:min-w-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-6 rounded-full ${dayPlan.color}`}
                    ></div>
                    <h3 className="text-lg font-display font-bold text-text-primary">
                      {dayPlan.day}
                    </h3>
                  </div>

                  <div className="bg-white border border-text-muted/20 rounded-2xl overflow-hidden shadow-sm ">
                    {dayPlan.meals.map((meal, mIdx) => (
                      <div
                        key={mIdx}
                        onClick={() => navigate(`/meal/${meal.slug}`)}
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
        <div className="fixed bottom-14 left-0 right-0 py-4 px-2 bg-bg-background/80 backdrop-blur-md z-50 flex flex-col lg:flex-row gap-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate("/market")}
            disabled={loading}
          >
            Accept Plan
          </Button>
          <Button
            variant="outline"
            className="w-full "
            onClick={handleRegenerate}
            disabled={loading}
          >
            {loading && weekPlan.length > 0 ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WeeklyPlan;
