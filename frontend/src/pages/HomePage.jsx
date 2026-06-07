import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  PlusIcon,
  GenerateIcon,
  BasketIcon,
  StarIcon,
} from "../constants/icons";
import transformTimetable from "../constants/weekPlan";
import { planService } from "../services/plan.api";
import Button from "../components/ui/Button";
import EmptyState from "./EmptyState";
// import TrendingRecipes from "../components/shared/TrendingRecipes";

/* ─── module-level helpers ─────────────────────────────────────────────── */
const SLOT_ORDER = ["Breakfast", "Lunch", "Dinner"];

const SLOT_META = {
  Breakfast: { emoji: "🌅", label: "Breakfast" },
  Lunch: { emoji: "☀️", label: "Lunch" },
  Dinner: { emoji: "🌙", label: "Dinner" },
};

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(),
  );
}

function normaliseSlot(type = "") {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

/* ─── HomePage ─────────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [weekPlan, setWeekPlan] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState(true);

  // const categories = ["All", "Yoruba", "Igbo", "Hausa"];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await planService.getTimetable();
        const transformed = transformTimetable(data);

        if (transformed.length === 0) {
          setHasPlan(false);
        } else {
          setWeekPlan(transformed);
          setHasPlan(true);

          const todayDay = transformed.find((d) => d.day === getTodayName());
          if (todayDay?.meals?.length) {
            const sorted = [...todayDay.meals].sort(
              (a, b) =>
                SLOT_ORDER.indexOf(normaliseSlot(a.type)) -
                SLOT_ORDER.indexOf(normaliseSlot(b.type)),
            );
            setTodayMeals(sorted);
          }
        }
      } catch {
        setHasPlan(false);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchPlan();
  }, []);

  return (
    <div className="flex flex-col gap-10 p-6 lg:p-10 animate-in fade-in duration-700">
      {/* ── Hero: Today's Meals ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-text-primary px-3 py-1 rounded-full w-fit">
              <div className="w-4 h-4 bg-text-primary rounded-full flex items-center justify-center text-[8px] text-white">
                <StarIcon />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                The Elite Taste of Nigeria
              </span>
            </div>
            <h1 className="text-subheading lg:text-[38px] font-display font-bold text-text-primary leading-tight mt-1">
              Today&apos;s Meals
              <span className="block text-[#8B4513] font-display text-2xl lg:text-3xl font-semibold">
                {getTodayName()} &middot;{" "}
                {hasPlan && todayMeals.length > 0
                  ? `${todayMeals.length} meals`
                  : "No active plan"}
              </span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button
              className="py-3 px-5 text-sm font-bold flex items-center justify-center gap-2"
              onClick={() => navigate("/menu-page")}
            >
              View Menu <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <button
              className="py-3 px-5 border-2 border-text-primary text-text-primary rounded-xl font-bold text-sm hover:bg-text-primary hover:text-white transition-all cursor-pointer flex items-center justify-center"
              onClick={() => navigate("/market")}
            >
              Market
            </button>
          </div>
        </div>

        {/* meal cards — inline JSX, no sub-component */}
        {planLoading ? (
          /* skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-3xl bg-text-muted/10 animate-pulse ${i === 0 ? "lg:col-span-2 h-64" : "lg:col-span-1 h-64"}`}
              />
            ))}
          </div>
        ) : !hasPlan || todayMeals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {todayMeals.map((meal, idx) => {
              const slotLabel = normaliseSlot(meal.type);
              const meta = SLOT_META[slotLabel] ?? {
                emoji: "🍽️",
                label: slotLabel,
              };
              return (
                <div
                  key={meal.slug ?? idx}
                  onClick={() => navigate(`/meal/${meal.slug}`)}
                  className={`relative rounded-3xl overflow-hidden text-white cursor-pointer group transition-transform hover:-translate-y-1 duration-300 shadow-md ${idx === 0 ? "lg:col-span-2" : "lg:col-span-1"}`}
                  style={{ minHeight: "240px" }}
                >
                  <img
                    src={meal.image || "/images/dish.webp"}
                    alt={meal.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* slot badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs">{meta.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {meta.label}
                    </span>
                  </div>

                  {/* day badge on first card */}
                  {idx === 0 && (
                    <div className="absolute top-4 right-4 bg-accent-orange text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {getTodayName()}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-display font-bold leading-tight mb-0.5">
                      {meal.name}
                    </h3>
                    <span className="text-[11px] font-bold text-accent-orange">
                      {meal.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Weekly Plan & Sidebar Cards ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3-day plan strip */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-text-muted/5">
          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
                Your Weekly Plan
              </h2>
              <p className="text-xs text-text-muted font-medium">
                {hasPlan && weekPlan.length > 0
                  ? `${weekPlan.length} days planned`
                  : "No active plan"}
              </p>
            </div>
            <Link
              to="/weekly-plan"
              className="text-xs font-bold text-text-primary flex items-center gap-1 hover:underline"
            >
              View Full Calendar <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {planLoading ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 min-w-40 shrink-0 animate-pulse"
                >
                  <div className="h-3 w-16 bg-text-muted/20 rounded-full ml-1" />
                  <div className="h-48 w-full bg-text-muted/10 rounded-2xl" />
                  <div className="h-3 w-24 bg-text-muted/20 rounded-full ml-1" />
                  <div className="h-2 w-16 bg-text-muted/10 rounded-full ml-1" />
                </div>
              ))
            ) : !hasPlan ? (
              <div className="w-full">
                <EmptyState />
              </div>
            ) : (
              <>
                {weekPlan.slice(0, 3).map((day, idx) => {
                  const isToday = day.day === getTodayName();
                  return (
                    <div
                      key={idx}
                      onClick={() => navigate(`/meal/${day.meals[0].slug}`)}
                      className="flex flex-col gap-3 min-w-40 shrink-0 group cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">
                        {day.day}
                      </span>
                      <div
                        className={`relative rounded-2xl overflow-hidden h-48 border-2 transition-all ${isToday ? "border-accent-orange ring-4 ring-accent-orange/10" : "border-transparent"}`}
                      >
                        <img
                          src={day.meals[0].image || "/images/dish.webp"}
                          alt={day.meals[0].name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isToday && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            !
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 ml-1">
                        <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                          {day.meals[0].name}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-accent-orange" : "text-[#5C8C4C]"}`}
                        >
                          {day.meals[0].type}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* view full plan */}
                <div
                  onClick={() => navigate("/weekly-plan")}
                  className="flex flex-col justify-center items-center gap-3 min-w-40 h-60 rounded-3xl border-2 border-dashed border-text-muted/20 bg-text-muted/5 text-text-muted group hover:bg-text-muted/10 transition-colors cursor-pointer shrink-0"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-text-muted/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-center px-2">
                    View Full Plan
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* action cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-accent-orange rounded-3xl p-6 text-white flex flex-col justify-between h-auto relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <BasketIcon className="w-8 h-8 mb-1 opacity-80" />
              <h3 className="text-xl font-display font-bold mb-1">
                Market Day
              </h3>
              <p className="text-[10px] font-medium text-white/80 max-w-45">
                Pre-order local ingredients for next week&apos;s meal plan.
              </p>
            </div>
            <button
              onClick={() => navigate("/market")}
              className="relative z-10 w-fit bg-black/20 hover:bg-black/30 px-4 py-2 rounded-lg text-xs font-bold transition-all mt-4"
            >
              Shop The Market
            </button>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-[#1A3013] rounded-3xl p-6 text-white flex flex-col justify-between h-auto relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <div className="w-8 h-8 mb-4 opacity-80 flex items-center justify-center">
                <GenerateIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold mb-1">
                Auto-Generate
              </h3>
              <p className="text-[10px] font-medium text-white/80 max-w-45">
                Create a 7-day plan based on your preferences.
              </p>
            </div>
            <button
              onClick={() => navigate("/weekly-plan")}
              className="relative z-10 w-fit bg-white text-[#1A3013] px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/90 transition-all mt-4 cursor-pointer"
            >
              Create Plan
            </button>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-orange/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* ── Trending Recipes ───────────────────────────────────────────────
      <section className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
            Trending Recipes
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${cat === "All" ? "bg-[#D1D89D] text-text-primary" : "bg-white border border-text-muted/10 text-text-muted hover:border-text-primary hover:text-text-primary"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <TrendingRecipes />
      </section> */}
    </div>
  );
};

export default HomePage;
