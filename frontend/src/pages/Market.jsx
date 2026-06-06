import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, SearchIcon } from "../constants/icons";
import { WeeklySummaryCard } from "../components/ui/WeeklySummaryCard";
import { planService } from "../services/plan.api";
import transformTimetable from "../constants/weekPlan";
import EmptyState from "./EmptyState";
import { MEAL_DETAILS } from "../constants/mealDetails";
import { IngredientLookup } from "../constants/ingredientLookup";

/* ─── module-level helpers ─────────────────────────────────────────────── */
const SLOT_ORDER = ["Breakfast", "Lunch", "Dinner"];

const SLOT_EMOJI = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
};

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(),
  );
}

function normaliseSlot(type = "") {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function getMealIngredients(meal) {
  if (meal.slug && MEAL_DETAILS[meal.slug]?.ingredients) {
    return MEAL_DETAILS[meal.slug].ingredients;
  }
  const normName = meal.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const foundKey = Object.keys(MEAL_DETAILS).find(
    (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === normName
  );
  if (foundKey && MEAL_DETAILS[foundKey]?.ingredients) {
    return MEAL_DETAILS[foundKey].ingredients;
  }
  return [
    "Fresh ingredients for " + meal.name,
    "Salt and pepper to taste"
  ];
}

function findLookupIngredient(ingStr) {
  const cleanStr = ingStr.toLowerCase();
  const sortedKeys = Object.keys(IngredientLookup).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const cleanKey = key.toLowerCase();
    
    if (cleanStr.includes(cleanKey)) {
      return { key, data: IngredientLookup[key] };
    }
    
    let keyToCheck = cleanKey;
    if (cleanKey.endsWith("s") && cleanKey.length > 3) {
      keyToCheck = cleanKey.slice(0, -1);
    }
    if (cleanStr.includes(keyToCheck)) {
      return { key, data: IngredientLookup[key] };
    }
  }
  return null;
}

/* ─── Market ───────────────────────────────────────────────────────────── */
const Market = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Today's Meals");
  const [searchTerm, setSearchTerm] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const [weekPlan, setWeekPlan] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState(true);

  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    try {
      const saved = localStorage.getItem("market_checked_ingredients");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("market_checked_ingredients", JSON.stringify(checkedIngredients));
  }, [checkedIngredients]);

  const toggleIngredientChecked = (key) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filters = ["Today's Meals", "This Week's Meals", "All"];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        let data;
        const cached = localStorage.getItem("weekly_meal_plan");
        if (cached) {
          data = JSON.parse(cached);
          console.log("Loaded timetable from cache in Market:", data);
        } else {
          data = await planService.getTimetable();
          localStorage.setItem("weekly_meal_plan", JSON.stringify(data));
          console.log("Fetched timetable from backend in Market:", data);
        }
        const parsedWeekPlan = transformTimetable(data);
        setWeekPlan(parsedWeekPlan);

        const todayDay = parsedWeekPlan.find((d) => d.day === getTodayName());
        if (!todayDay || todayDay.meals.length === 0) {
          setHasPlan(false);
        } else {
          const sorted = [...todayDay.meals].sort(
            (a, b) =>
              SLOT_ORDER.indexOf(normaliseSlot(a.type)) -
              SLOT_ORDER.indexOf(normaliseSlot(b.type)),
          );
          setTodayMeals(sorted);
          setHasPlan(true);
        }
      } catch (err) {
        console.error("Failed to fetch plan in Market:", err);
        setHasPlan(false);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const addCustomItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    const price = parseFloat(newItemPrice) || 0;
    setCustomItems((prev) => [
      ...prev,
      { name, price, bought: false, id: Date.now() },
    ]);
    setNewItemName("");
    setNewItemPrice("");
    setShowAddForm(false);
  };

  const removeCustomItem = (id) =>
    setCustomItems((prev) => prev.filter((item) => item.id !== id));

  const toggleCustomBought = (id) =>
    setCustomItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item,
      ),
    );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredTodayMeals = todayMeals.filter((meal) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const ingredients = getMealIngredients(meal);
    return (
      meal.name.toLowerCase().includes(term) ||
      ingredients.some((ing) => ing.toLowerCase().includes(term))
    );
  });

  const filteredWeekPlan = weekPlan.map((dayPlan) => {
    const meals = dayPlan.meals.filter((meal) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const ingredients = getMealIngredients(meal);
      return (
        meal.name.toLowerCase().includes(term) ||
        ingredients.some((ing) => ing.toLowerCase().includes(term))
      );
    });
    return { ...dayPlan, meals };
  }).filter((dayPlan) => dayPlan.meals.length > 0);

  const getConsolidatedIngredients = () => {
    const allIngredientsMap = {};
    const term = searchTerm.toLowerCase();

    weekPlan.forEach((dayPlan) => {
      dayPlan.meals.forEach((meal) => {
        const ingredients = getMealIngredients(meal);
        ingredients.forEach((ing) => {
          const lookup = findLookupIngredient(ing);
          const cleanName = lookup ? lookup.key : ing;
          const category = lookup ? lookup.data.category : "Other";
          const qty = lookup ? lookup.data.qty : null;

          if (searchTerm && !cleanName.toLowerCase().includes(term) && !ing.toLowerCase().includes(term)) {
            return;
          }

          if (!allIngredientsMap[cleanName]) {
            allIngredientsMap[cleanName] = {
              name: cleanName,
              category,
              qty,
              count: 0,
            };
          }
          allIngredientsMap[cleanName].count += 1;
        });
      });
    });

    const categories = {};
    Object.values(allIngredientsMap).forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    return categories;
  };

  return (
    <main className="px-5 pt-6 flex flex-col gap-6 relative pb-10">
      <h1 className="text-[2.5rem] font-display font-extrabold text-text-primary leading-none">
        MARKET
      </h1>
      <WeeklySummaryCard />

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? "bg-accent-orange text-white shadow-lg shadow-orange-200"
                : "bg-black/5 text-text-muted hover:bg-black/10"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {planLoading ? (
        /* skeleton — inline grid, not a sub-component */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-text-primary/10 rounded-3xl overflow-hidden animate-pulse h-72"
            >
              <div className="h-44 bg-text-muted/20" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-2/3 bg-text-muted/20 rounded-full" />
                <div className="h-3 w-1/2 bg-text-muted/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasPlan ? (
        <EmptyState />
      ) : (
        <>
          {/* ── Today's Meals ───────────────────────────────────────────────── */}
          {activeFilter === "Today's Meals" && (
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
                      onClick={() => navigate("/weekly-plan")}
                      className="text-accent-orange text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Full Week
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
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
                          <button
                            onClick={() => navigate(`/meal/${meal.slug}`)}
                            className="mt-auto bg-accent-orange hover:bg-[#e66a13] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
                          >
                            <ArrowRightIcon />
                            View Recipe
                          </button>
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
                            {ingredients.map((ing) => {
                              const key = `today-${meal.slug}-${ing}`;
                              const isChecked = !!checkedIngredients[key];
                              const lookup = findLookupIngredient(ing);
                              return (
                                <div
                                  key={ing}
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
                                      className={`text-xs ${
                                        isChecked
                                          ? "text-text-muted line-through"
                                          : "text-text-primary font-bold"
                                      }`}
                                    >
                                      {ing}
                                    </span>
                                  </div>
                                  {lookup && lookup.data.qty && (
                                    <span className="text-[10px] text-text-muted bg-black/5 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                                      {lookup.data.qty}
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
          )}

          {/* ── This Week's Meals ───────────────────────────────────────────── */}
          {activeFilter === "This Week's Meals" && (
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
                              {ingredients.map((ing) => {
                                const key = `week-${dayPlan.day}-${meal.slug}-${ing}`;
                                const isChecked = !!checkedIngredients[key];
                                return (
                                  <div
                                    key={ing}
                                    className="flex items-center gap-2.5 cursor-pointer"
                                    onClick={() => toggleIngredientChecked(key)}
                                  >
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
                                      {ing}
                                    </span>
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
          )}

          {/* ── All (Consolidated Grocery List) ─────────────────────────────── */}
          {activeFilter === "All" && (
            <div className="flex flex-col gap-6">
              {(() => {
                const consolidated = getConsolidatedIngredients();
                if (Object.keys(consolidated).length === 0) {
                  return (
                    <div className="text-center py-12 bg-white rounded-3xl border border-black/5 text-text-muted">
                      No matching ingredients found.
                    </div>
                  );
                }
                return Object.entries(consolidated).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-3">
                    <h3 className="text-md font-display font-extrabold text-text-primary flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-[#2d4a1e]"></span>
                      {category}
                    </h3>
                    <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col gap-3">
                      {items.map((item) => {
                        const key = `all-ing-${item.name}`;
                        const isChecked = !!checkedIngredients[key];
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between py-1 border-b border-black/5 last:border-0"
                          >
                            <div
                              className="flex items-center gap-3 cursor-pointer flex-1"
                              onClick={() => toggleIngredientChecked(key)}
                            >
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  isChecked
                                    ? "bg-[#2d4a1e] border-[#2d4a1e] text-white"
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
                                {item.name}{" "}
                                <span className="text-xs text-text-muted/70 font-normal">
                                  ({item.count} {item.count > 1 ? "meals" : "meal"})
                                </span>
                              </span>
                            </div>
                            {item.qty && (
                              <span className="text-xs text-text-muted bg-black/5 px-2 py-0.5 rounded-md font-semibold font-sans">
                                {item.qty}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </>
      )}

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search items..."
          name="item-search"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-white border-none rounded-xl py-4 pl-12 pr-4 shadow-sm outline-none placeholder:text-text-muted text-sm"
        />
      </div>

      {/* Custom Items Section */}
      {(customItems.length > 0 || showAddForm) && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 opacity-80">
            <span className="text-xl">✏️</span>
            <h2 className="text-lg font-display font-bold text-text-primary">
              Custom Items
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {customItems
              .filter(
                (item) =>
                  !searchTerm ||
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-transparent"
                >
                  <div
                    onClick={() => toggleCustomBought(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.bought
                        ? "bg-accent-orange border-accent-orange"
                        : "border-text-muted"
                    }`}
                  >
                    {item.bought && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex-1 flex flex-col cursor-pointer"
                    onClick={() => toggleCustomBought(item.id)}
                  >
                    <span
                      className={`text-sm font-bold ${
                        item.bought
                          ? "text-text-muted line-through"
                          : "text-text-primary"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.price > 0 && (
                      <span
                        className={`text-xs font-bold ${
                          item.bought
                            ? "text-text-muted line-through"
                            : "text-text-primary"
                        }`}
                      >
                        ₦{item.price.toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={() => removeCustomItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors text-red-500"
                      aria-label="Remove item"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Custom Item */}
      {showAddForm ? (
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border-2 border-accent-orange/30">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
            New Item
          </p>
          <input
            type="text"
            placeholder="Item name (e.g. Ugwu leaves)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            autoFocus
            className="w-full bg-[#F8F8DF] rounded-xl py-3 px-4 text-sm font-medium outline-none placeholder:text-text-muted border border-transparent focus:border-accent-orange/50 transition-colors"
          />
          <input
            type="number"
            placeholder="Estimated price (optional, ₦)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            className="w-full bg-[#F8F8DF] rounded-xl py-3 px-4 text-sm font-medium outline-none placeholder:text-text-muted border border-transparent focus:border-accent-orange/50 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={addCustomItem}
              className="flex-1 bg-accent-orange text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#e66a13] transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewItemName("");
                setNewItemPrice("");
              }}
              className="px-4 bg-black/5 text-text-muted rounded-xl py-2.5 text-sm font-bold hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-sm font-bold text-accent-orange hover:underline"
        >
          <span className="w-7 h-7 rounded-full bg-accent-orange/10 flex items-center justify-center text-accent-orange font-bold text-lg leading-none">
            +
          </span>
          Add Custom Item
        </button>
      )}
    </main>
  );
};

export default Market;
