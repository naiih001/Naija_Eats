import { useState, useEffect } from "react";
import { SearchIcon, ShoppingCartIcon } from "../constants/icons";

import { useBudgetAlert } from "../context/useBudgetAlert";
import { WeekPlan } from "../constants/weekPlan";
import { getMealMarketData } from "../utils/getMarketData";
import {
  GrainIcon,
  LeafIcon,
  ProteinIcon,
  SpiceIcon,
} from "../constants/icons";
import { WeeklySummaryCard } from "../components/ui/WeeklySummaryCard";

const Market = () => {
  const [activeFilter, setActiveFilter] = useState("Today's Meals");
  const [searchTerm, setSearchTerm] = useState("");
  const { setShoppingListTotal } = useBudgetAlert();
  const [randomMeal, setRandomMeal] = useState(WeekPlan[0].meals[0]);
  const [marketData, setMarketData] = useState(() =>
    getMealMarketData(WeekPlan[0].meals[0]),
  );
  const categoryIcons = {
    Grains: <GrainIcon />,
    Proteins: <ProteinIcon />,
    Vegetables: <LeafIcon />,
    Spices: <SpiceIcon />,
    Miscellaneous: "🥣",
  };

  const swapMeals = () => {
    let meal;
    do {
      const randomDay = WeekPlan[Math.floor(Math.random() * WeekPlan.length)];
      meal =
        randomDay.meals[Math.floor(Math.random() * randomDay.meals.length)];
    } while (meal.name === randomMeal.name);

    setRandomMeal(meal);
    setMarketData(getMealMarketData(meal)); // add this
  };

  // Calculate and update shopping list total
  useEffect(() => {
    const total = marketData.reduce(
      (sum, category) =>
        sum +
        category.items.reduce(
          (catSum, item) => catSum + (item.minPrice || 0),
          0,
        ),
      0,
    );
    setShoppingListTotal(total);
  }, [marketData, setShoppingListTotal]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleBought = (catIdx, itemIdx) => {
    setMarketData((prevData) =>
      prevData.map((category, cIdx) => {
        if (cIdx !== catIdx) return category;

        return {
          ...category,
          items: category.items.map((item, iIdx) => {
            if (iIdx !== itemIdx) return item;
            return { ...item, bought: !item.bought };
          }),
        };
      }),
    );
  };

  const allBought = marketData.every((category) =>
    category.items.every((item) => item.bought),
  );

  const handleMarkAllBought = () => {
    const allBought = marketData.every((category) =>
      category.items.every((item) => item.bought),
    );

    setMarketData((prevData) =>
      prevData.map((category) => ({
        ...category,
        items: category.items.map((item) => ({ ...item, bought: !allBought })),
      })),
    );
  };
  const filters = ["Today's Meals", "This Week's Meals", "All"];

  return (
    <main className="px-5 pt-6 flex flex-col gap-6 relative">
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

      {/* Featured Card: Today's Meal */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-display font-extrabold text-text-primary">
            Today's Meal
          </h2>
          <button
            onClick={swapMeals}
            className="text-accent-orange text-xs font-bold flex items-center gap-1 hover:underline"
          >
            Swap Meal
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m21 2-5 5m-11 5 5 5m0-10 8 8" />
            </svg>
          </button>
        </div>

        <div className="bg-text-primary rounded-3xl p-5 text-white flex flex-col gap-4 max-w-xs">
          <div className="flex gap-4 ">
            <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-white/10">
              <img
                src={randomMeal.image}
                alt={randomMeal.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Served 1
                </span>
              </div>
              <h3 className="text-xl font-display font-bold leading-tight mt-1">
                {randomMeal.name}
              </h3>
              <p className="text-[10px] text-white/70 leading-relaxed line-clamp-3 font-medium">
                {randomMeal.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/50">
              Ingredients Needed:
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {randomMeal.ingredients.slice(0, 4).map((ing) => (
                <div key={ing} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent-orange" />
                  <span className="text-[11px] font-medium text-white/90">
                    {ing}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="bg-accent-orange hover:bg-[#e66a13] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors">
            <ShoppingCartIcon className="w-4 h-4" />
            Add All to Cart
          </button>
        </div>
      </section>

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

      {/* Market Categories */}
      <div className="flex flex-col gap-8">
        {marketData.map((section, catIdx) => (
          <div key={catIdx} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 opacity-80">
              <span className="text-xl text-text-muted/50">
                {categoryIcons[section.category] ?? "🛒"}
              </span>
              <h2 className="text-lg font-display font-bold text-text-primary">
                {section.category}
              </h2>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2">
              {section.items.map((item, itemIdx) => {
                if (
                  searchTerm &&
                  !item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                  return null;

                return (
                  <div
                    key={itemIdx}
                    onClick={() => toggleBought(catIdx, itemIdx)}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm cursor-pointer active:scale-[0.98] transition-all border border-transparent"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        item.bought
                          ? "bg-accent-orange border-accent-orange"
                          : "border-text-muted"
                      }`}
                    >
                      {item.bought && (
                        <svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L4.5 7.5L11 1"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
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
                    <div className="flex items-center gap-2">
                      {item.price && (
                        <span
                          className={`text-xs font-bold ${
                            item.bought
                              ? "text-text-muted line-through"
                              : "text-text-primary"
                          }`}
                        >
                          ₦ {item.price.toFixed(2)}
                        </span>
                      )}
                      {item.qty && (
                        <span className="bg-[#F8F8DF] text-text-primary text-[10px] font-bold px-3 py-1 rounded-lg border border-text-primary/10">
                          {item.qty}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Estimated Total
          </span>
          <span className="text-2xl font-display font-extrabold text-text-primary">
            ₦
            {marketData
              .reduce(
                (sum, cat) =>
                  sum +
                  cat.items.reduce((s, item) => s + (item.minPrice || 0), 0),
                0,
              )
              .toLocaleString()}
            {" – "}₦
            {marketData
              .reduce(
                (sum, cat) =>
                  sum +
                  cat.items.reduce((s, item) => s + (item.maxPrice || 0), 0),
                0,
              )
              .toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-text-muted font-medium">
            {marketData.reduce((sum, cat) => sum + cat.items.length, 0)} items
          </span>
          <span className="text-[10px] text-text-muted font-medium">
            {marketData.reduce(
              (sum, cat) => sum + cat.items.filter((i) => i.bought).length,
              0,
            )}{" "}
            bought
          </span>
        </div>
      </div>

      <div className="">
        <button
          onClick={handleMarkAllBought}
          className="bg-accent-orange text-white w-full max-w-xs rounded-2xl h-14 text-sm font-bold shadow-orange-200 hover:bg-[#e66a13] transition-colors cursor-pointer"
        >
          {allBought ? "Unmark all" : "Mark all as bought"}
        </button>
      </div>
    </main>
  );
};

export default Market;
