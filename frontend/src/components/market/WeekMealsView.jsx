import { normaliseSlot, getMealIngredients } from "../../utils/marketHelpers";

export default function WeekMealsView({
  filteredWeekPlan,
  checkedIngredients,
  toggleIngredientChecked,
}) {
  return (
    <div className="flex flex-col gap-8">
      {filteredWeekPlan.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-black/5 text-text-muted">
          No matching meals found for this week.
        </div>
      ) : (
        filteredWeekPlan.map((dayPlan) => (
          <div key={dayPlan.day} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-6 rounded-full ${
                  dayPlan.color || "bg-accent-orange"
                }`}
              ></div>
              <h3 className="text-lg font-display font-extrabold text-text-primary">
                {dayPlan.day}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dayPlan.meals.map((meal) => {
                const ingredients = getMealIngredients(meal);
                return (
                  <div
                    key={meal.slug}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-accent-orange uppercase tracking-wider">
                          {normaliseSlot(meal.type)}
                        </span>
                        <h4 className="text-sm font-display font-extrabold text-text-primary leading-tight mt-0.5">
                          {meal.name}
                        </h4>
                      </div>
                    </div>
                    <div className="h-px bg-black/5 w-full my-1" />
                    <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
                      Ingredients:
                    </p>
                    <div className="flex flex-col gap-2">
                      {ingredients.map((ingObj) => {
                        const key = `week-${dayPlan.day}-${meal.slug}-${ingObj.name}`;
                        const isChecked = !!checkedIngredients[key];
                        return (
                          <div
                            key={ingObj.name}
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleIngredientChecked(key)}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  isChecked
                                    ? "bg-accent-orange border-accent-orange text-white"
                                    : "border-text-muted"
                                }`}
                              >
                                {isChecked && (
                                  <svg
                                    width="8"
                                    height="6"
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
                                className={`text-xs ${
                                  isChecked
                                    ? "text-text-muted line-through"
                                    : "text-text-primary font-bold"
                                }`}
                              >
                                {ingObj.name}
                              </span>
                            </div>
                            {ingObj.quantity && (
                              <span className="text-[10px] text-text-muted">
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
          </div>
        ))
      )}
    </div>
  );
}
