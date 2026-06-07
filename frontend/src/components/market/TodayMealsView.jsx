import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "../../constants/icons";
import {
  getTodayName,
  normaliseSlot,
  SLOT_EMOJI,
  getMealIngredients,
  // findLookupIngredient,
} from "../../utils/marketHelpers";

export default function TodayMealsView({
  filteredTodayMeals,
  checkedIngredients,
  toggleIngredientChecked,
  onInitiateSwap,
}) {
  const [isSwapMode, setIsSwapMode] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-2xl font-display font-extrabold text-text-primary">
              Today&apos;s Meals
            </h2>
            <p className="text-xs text-text-muted font-medium">
              {getTodayName()} &bull;{" "}
              {filteredTodayMeals.length > 0
                ? `${filteredTodayMeals.length} meals planned`
                : "No matching meals"}
            </p>
          </div>
          {filteredTodayMeals.length > 0 && (
            <button
              onClick={() => {
                if (filteredTodayMeals.length === 1) {
                  onInitiateSwap(filteredTodayMeals[0]);
                } else {
                  setIsSwapMode(!isSwapMode);
                }
              }}
              className="text-accent-orange text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              {isSwapMode ? "Cancel Swap" : "Swap Meals"}
            </button>
          )}
        </div>

        {/* meal slot cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {filteredTodayMeals.map((meal, idx) => {
            const slotLabel = normaliseSlot(meal.type);
            const emoji = SLOT_EMOJI[slotLabel] ?? "🍽️";
            return (
              <div
                key={meal.slug ?? idx}
                className="bg-text-primary rounded-3xl overflow-hidden text-white flex flex-col group transition-transform hover:-translate-y-1 duration-300 shadow-lg"
              >
                {/* image */}
                <div className="relative h-44 shrink-0 overflow-hidden">
                  <img
                    src={meal.image || "/images/dish.webp"}
                    alt={meal.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* slot badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs">{emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      {slotLabel}
                    </span>
                  </div>
                </div>

                {/* content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-display font-bold leading-tight">
                      {meal.name}
                    </h3>
                    <span className="text-[11px] font-bold text-accent-orange whitespace-nowrap shrink-0">
                      {meal.price}
                    </span>
                  </div>
                  {isSwapMode ? (
                    <button
                      onClick={() => onInitiateSwap(meal)}
                      className="mt-auto bg-black/10 hover:bg-black/20 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
                    >
                      Swap {slotLabel}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/meal/${meal.slug}`)}
                      className="mt-auto bg-accent-orange hover:bg-[#e66a13] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
                    >
                      <ArrowRightIcon />
                      View Recipe
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Today's Ingredients Checklist */}
      {filteredTodayMeals.length > 0 && (
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-xl font-display font-extrabold text-text-primary">
              Today&apos;s Ingredients Checklist
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTodayMeals.map((meal) => {
              const ingredients = getMealIngredients(meal);
              return (
                <div
                  key={meal.slug}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col gap-3"
                >
                  <h3 className="text-sm font-display font-extrabold text-text-primary flex items-center gap-2 border-b border-black/5 pb-2">
                    <span className="w-1.5 h-3 rounded-full bg-accent-orange"></span>
                    {meal.name} ({normaliseSlot(meal.type)})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {ingredients.map((ingObj) => {
                      const key = `today-${meal.slug}-${ingObj.name}`;
                      const isChecked = !!checkedIngredients[key];
                      return (
                        <div
                          key={ingObj.name}
                          className="flex items-center justify-between py-1 border-b border-black/5 last:border-0"
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => toggleIngredientChecked(key)}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isChecked
                                  ? "bg-accent-orange border-accent-orange text-white"
                                  : "border-text-muted"
                              }`}
                            >
                              {isChecked && (
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                >
                                  <path
                                    d="M1 4L4.5 7.5L11 1"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isChecked
                                  ? "text-text-muted line-through"
                                  : "text-text-primary font-bold"
                              }`}
                            >
                              {ingObj.name}
                            </span>
                          </div>
                          {ingObj.quantity && (
                            <span className="text-xs font-bold text-text-muted">
                              {ingObj.quantity}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
