import { useState, useEffect } from "react";
import { SearchIcon } from "../constants/icons";
import { useNavigate } from "react-router-dom";
import { planService } from "../services/plan.api";
import { getMealImage } from "../constants/weekPlan";
import EmptyState from "./EmptyState";

const CATEGORY_MAP = {
  Main: "Rice Dishes",
  Snack: "Proteins",
  Breakfast: "Proteins",
  Dessert: "Proteins",
  Swallow: "Swallows",
  Side: "Proteins",
};

function transformMenuMeals(apiData) {
  const seen = new Set();

  return apiData.data.items
    .filter(({ meal }) => {
      if (seen.has(meal.id)) return false;
      seen.add(meal.id);
      return true;
    })
    .map(({ meal }, index) => ({
      id: index + 1,
      slug: meal.name.toLowerCase().replace(/\s+/g, "-"),
      name: meal.name,
      price: `₦${Number(meal.price_min).toLocaleString()} - ₦${Number(meal.price_max).toLocaleString()}`,
      duration: `${meal.prep_time_mins} mins`,
      description: meal.instructions,
      img: getMealImage(meal.name),
      category: [CATEGORY_MAP[meal.category] ?? "Proteins"],
    }));
}

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Soups", "Rice Dishes", "Swallows", "Proteins"];
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await planService.getTimetable();
        const transformed = transformMenuMeals(data);
        if (transformed.length === 0) {
          setHasPlan(false);
        } else {
          setMeals(transformed);
          setHasPlan(true);
        }
      } catch {
        setHasPlan(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      activeCategory === "All" ||
      [].concat(meal.category).includes(activeCategory);
    const matchesSearch =
      meal.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      meal.description.toLowerCase().includes(debouncedValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="px-5 pt-8 flex flex-col gap-6">
      <h1 className="text-3xl font-display font-extrabold text-text-primary leading-tight">
        Discover Authentic
        <br />
        Flavors
      </h1>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search for Jollof, Egusi, Suya..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full max-w-xs bg-white rounded-xl py-4 pl-12 pr-4 border border-text-muted outline-none placeholder:text-text-muted text-sm font-medium"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === category
                ? "bg-text-primary text-white shadow-lg"
                : "bg-[#D1D89D] text-text-primary hover:bg-[#c4cc8b]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 pb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-text-primary/10 rounded-md overflow-hidden animate-pulse h-[420px]"
            >
              <div className="h-[50%] bg-text-muted/20" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-4 w-3/4 bg-text-muted/20 rounded-full" />
                <div className="h-3 w-full bg-text-muted/10 rounded-full" />
                <div className="h-3 w-5/6 bg-text-muted/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasPlan ? (
        /* No active meal plan — show EmptyState */
        <EmptyState />
      ) : filteredMeals.length === 0 ? (
        /* Plan exists but search/filter returned nothing */
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-3xl">
            🍽️
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            No meals found
          </h3>
          <p className="text-sm text-text-muted max-w-xs">
            Try a different search term or category filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-text-primary rounded-md overflow-hidden shadow-xl flex flex-col h-full max-h-[420px]"
            >
              <div className="relative h-[50%] overflow-hidden">
                <img
                  src={meal.img}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF7A1A"
                    strokeWidth="2.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 bg-text-primary/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-[10px] font-bold text-white uppercase">
                    {meal.duration}
                  </span>
                </div>
              </div>

              <div className="p-6 h-[50%] flex flex-col justify-between items-start gap-3">
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-xl font-display font-bold text-white max-w-[70%] leading-tight">
                    {meal.name}
                  </h3>
                  <span className="text-sm font-bold text-white opacity-80">
                    {meal.price}
                  </span>
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                  {meal.description}
                </p>
                <button
                  className="bg-accent-orange mt-auto hover:bg-accent-orange/75 text-white py-3.5 rounded-xs font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 w-full max-w-xs mt-auto"
                  onClick={() => navigate(`/meal/${meal.slug}`)}
                >
                  View Meal
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trending section — shown only when plan is active */}
      {hasPlan && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Trending Recipe */}
          <div className="lg:col-span-7 bg-white rounded-4xl overflow-hidden group cursor-pointer border border-text-muted/5">
            <div className="relative h-100 lg:h-125">
              <img
                src="/images/fisherman_soup.png"
                alt="Fisherman's Harvest Soup"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute h-inherit inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className=" px-3 py-1.5 bg-accent-orange rounded-xl text-white mb-4 inline-block">
                  Trending
                </span>

                <h3 className="text-3xl lg:text-4xl font-display font-bold mb-2">
                  Fisherman's Harvest Soup
                </h3>
                <p className="text-white/70 text-sm mb-6 max-w-md line-clamp-2">
                  A rich, aromatic seafood delicacy from the coastal regions,
                  reimagined for the modern palate.
                </p>
                <div className="flex justify-between items-center"></div>
              </div>
            </div>
          </div>

          {/* Grid of smaller recipes */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            <div className="bg-[#1A3013] rounded-4xl overflow-hidden  group cursor-pointer h-full min-h-60 relative">
              <img
                src="/images/ribeye.png"
                alt="Suya-Spiced Ribeye"
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-xl font-display font-bold mb-1">
                  Suya-Spiced Ribeye
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 h-full min-h-60">
              <div className="bg-[#F8F8DF] rounded-4xl overflow-hidden border border-text-muted/10 group cursor-pointer relative">
                <img
                  src="/images/puffpuff.png"
                  alt="Spiced Puff-Puff"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-sm font-bold text-white drop">
                    Spiced Puff-Puff
                  </h4>
                </div>
              </div>
              <div className="bg-[#F8F8DF] rounded-4xl overflow-hidden border border-text-muted/10 group cursor-pointer relative">
                <img
                  src="/images/vegetable.svg"
                  alt="Fonio Superbowl"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-sm font-bold text-white drop">
                    Fonio Superbowl
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MenuPage;
