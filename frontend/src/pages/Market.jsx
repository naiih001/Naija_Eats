import { useState, useEffect } from "react";
import { SearchIcon } from "../constants/icons";
import { WeeklySummaryCard } from "../components/ui/WeeklySummaryCard";
import { planService } from "../services/plan.api";
import transformTimetable from "../constants/weekPlan";
import EmptyState from "./EmptyState";
import {
  getTodayName,
  normaliseSlot,
  getMealIngredients,
  SLOT_ORDER,
} from "../utils/marketHelpers";

import TodayMealsView from "../components/market/TodayMealsView";
import WeekMealsView from "../components/market/WeekMealsView";
import ConsolidatedListView from "../components/market/ConsolidatedListView";
import CustomItemsSection from "../components/market/CustomItemsSection";
import SwapMealModal from "../components/shared/SwapMealModal";

import { getWeeklyPlanKey } from "../utils/planHelpers";

const Market = () => {
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

  const [swapItem, setSwapItem] = useState(null);

  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    try {
      const saved = localStorage.getItem("market_checked_ingredients");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "market_checked_ingredients",
      JSON.stringify(checkedIngredients),
    );
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
        const cached = localStorage.getItem(getWeeklyPlanKey());
        if (cached) {
          data = JSON.parse(cached);
        } else {
          data = await planService.getTimetable();
          localStorage.setItem(getWeeklyPlanKey(), JSON.stringify(data));
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

  const handleInitiateSwap = (mealItem) => {
    setSwapItem(mealItem);
  };

  const handleSwapComplete = (updatedData) => {
    localStorage.setItem(getWeeklyPlanKey(), JSON.stringify(updatedData));
    const parsedWeekPlan = transformTimetable(updatedData);
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
  };

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
      ingredients.some((ing) => ing.name.toLowerCase().includes(term))
    );
  });

  const filteredWeekPlan = weekPlan
    .map((dayPlan) => {
      const meals = dayPlan.meals.filter((meal) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const ingredients = getMealIngredients(meal);
        return (
          meal.name.toLowerCase().includes(term) ||
          ingredients.some((ing) => ing.name.toLowerCase().includes(term))
        );
      });
      return { ...dayPlan, meals };
    })
    .filter((dayPlan) => dayPlan.meals.length > 0);

  const getConsolidatedIngredients = () => {
    const allIngredientsMap = {};
    const term = searchTerm.toLowerCase();

    weekPlan.forEach((dayPlan) => {
      dayPlan.meals.forEach((meal) => {
        const ingredients = getMealIngredients(meal);
        ingredients.forEach((ing) => {
          const cleanName = ing.name;
          const category = ing.category || "Other";
          const qty = ing.quantity || "";

          if (searchTerm && !cleanName.toLowerCase().includes(term)) {
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
          {activeFilter === "Today's Meals" && (
            <TodayMealsView
              filteredTodayMeals={filteredTodayMeals}
              checkedIngredients={checkedIngredients}
              toggleIngredientChecked={toggleIngredientChecked}
              onInitiateSwap={handleInitiateSwap}
            />
          )}

          {activeFilter === "This Week's Meals" && (
            <WeekMealsView
              filteredWeekPlan={filteredWeekPlan}
              checkedIngredients={checkedIngredients}
              toggleIngredientChecked={toggleIngredientChecked}
            />
          )}

          {activeFilter === "All" && (
            <ConsolidatedListView
              consolidatedIngredients={getConsolidatedIngredients()}
              checkedIngredients={checkedIngredients}
              toggleIngredientChecked={toggleIngredientChecked}
            />
          )}
        </>
      )}

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

      <CustomItemsSection
        customItems={customItems}
        searchTerm={searchTerm}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        newItemPrice={newItemPrice}
        setNewItemPrice={setNewItemPrice}
        addCustomItem={addCustomItem}
        removeCustomItem={removeCustomItem}
        toggleCustomBought={toggleCustomBought}
      />

      <SwapMealModal
        swapItem={swapItem}
        onClose={() => setSwapItem(null)}
        onSwapComplete={handleSwapComplete}
      />
    </main>
  );
};

export default Market;
