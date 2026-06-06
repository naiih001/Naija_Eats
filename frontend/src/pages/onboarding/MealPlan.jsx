import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import {
  HeartIcon,
  ShoppingCartIcon,
  StopWatch,
  BoltIcon,
} from "../../constants/icons";

import { budgetStats, featuredMeal, subMeals } from "../../constants/mealPlan";
import { planService } from "../../services/plan.api";

const MealPlan = () => {
  const navigate = useNavigate();
  const bufferedBudget =
    JSON.parse(localStorage.getItem("buffered_budget")) || "0";
  const amount = bufferedBudget?.amount;

  const onBoardUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    localStorage.setItem("onboarded", "true");
    navigate("/weekly-plan");
  };

  const onRegeneratePlan = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    // Logic for regenerating plan would go here
    navigate("/onboarding/set-budget");
  };

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const data = await planService.getCurrentMealPlan();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMealPlan();
  }, []);

  return (
    <>
      <div className="max-w-350 mx-auto px-6 md:px-12">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-subheading font-display font-bold leading-tight mb-2">
            Your weekly plan is ready!
          </h1>
          <p className="text-base opacity-80">
            We've curated 7 days of heritage-inspired healthy meals just for
            you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Sidebar */}
          <div className=" flex flex-col gap-6">
            {/* Weekly Budget Card */}
            <div className="bg-white rounded-4xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-2xl font-display font-bold mb-3">
                Your Weekly Budget
              </h2>
              <p className="text-text-muted text-sm mb-8 leading-relaxed">
                Based on your preferences, your budget for the incoming week is
                stated below
              </p>

              <div className="space-y-3">
                {budgetStats(amount).map((stat, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-gray-100 pb-4"
                  >
                    <span className="text-[0.65rem] font-bold text-text-muted tracking-widest">
                      {stat.label}
                    </span>
                    <span
                      className={`font-display font-bold ${stat.highlight ? "text-accent-orange text-lg" : "text-[#2d4a1e]"}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  variant="primary"
                  className="w-full py-4 rounded-2xl bg-accent-orange hover:bg-[#d55b1a]"
                  onClick={onBoardUser}
                >
                  View Full Plan
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-4 rounded-2xl border-[#2d4a1e] text-[#2d4a1e] hover:bg-[#2d4a1e] hover:text-white transition-all"
                  onClick={onRegeneratePlan}
                >
                  Regenerate Plan
                </Button>
              </div>
            </div>

            {/* Nutritional Info Card
            <div className="bg-[#2d4a1e] rounded-3xl p-5 text-white shadow-lg overflow-hidden relative">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 opacity-80">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <BoltIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Nutritional Info
                  </span>
                </div>

                <div className="flex justify-between items-center px-2">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] font-bold opacity-60 uppercase mb-0.5">
                      Avg Calories
                    </span>
                    <span className="text-2xl font-bold">650 kcal</span>
                  </div>
                  <div className="w-px h-10 bg-white/20"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[0.6rem] font-bold opacity-60 uppercase mb-0.5">
                      Protein
                    </span>
                    <span className="text-2xl font-bold">42g</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Shopping List Card */}
            <div className="bg-white/50 border-2 border-dashed border-[#2d4a1e]/20 rounded-4xl p-4 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-accent-orange">
                <ShoppingCartIcon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 text-[#2d4a1e]">
                Shopping List Ready
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-62.5 leading-relaxed">
                All ingredients for this week are automatically calculated for
                your cart.
              </p>
              <Button
                variant="outline"
                className="w-full py-3 rounded-xl border-[#2d4a1e] text-[#2d4a1e] font-bold"
                onClick={() => navigate("/market")}
              >
                View Shopping List
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className=" flex flex-col gap-6">
            {/* Featured Meal Card */}
            <div className="bg-[#2d4a1e] rounded-3xl overflow-hidden text-white shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-green-900/20">
              <div className="h-60 relative overflow-hidden">
                <img
                  src={featuredMeal.image}
                  alt={featuredMeal.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 bg-accent-orange text-white px-4 py-1.5 rounded-lg text-[0.7rem] font-black tracking-widest uppercase">
                  {featuredMeal.day}
                </div>
              </div>
              <div className="py-4 px-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-subheading font-display font-bold max-w-lg leading-tight">
                    {featuredMeal.title}
                  </h2>
                  <button className="bg-white/10 hover:bg-accent-orange p-3 rounded-full transition-colors duration-300">
                    <HeartIcon className="w-4 h-4 text-white fill-none group-hover:fill-current" />
                  </button>
                </div>
                <p className="text-base opacity-70 mb-8 max-w-xl leading-relaxed">
                  {featuredMeal.description}
                </p>
                <div className="flex gap-8 items-center border-t border-white/10 pt-8">
                  <div className="flex items-center gap-2">
                    <StopWatch className="w-5 h-5 text-accent-orange" />
                    <span className="font-bold opacity-80">
                      {featuredMeal.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">•</div>
                  <div className="flex items-center gap-2">
                    <BoltIcon className="w-5 h-5 text-accent-orange" />
                    <span className="font-bold opacity-80">
                      {featuredMeal.calories}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Meals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subMeals.map((meal, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-4 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] font-black text-text-muted tracking-widest mb-1 uppercase">
                      {meal.type}
                    </span>
                    <h3 className="text-base font-display font-bold text-[#2d4a1e] group-hover:text-accent-orange transition-colors">
                      {meal.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {weeklyMeals.map((meal, i) => (
            <div
              key={i}
              className="bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100 flex flex-col h-full hover:-translate-y-2"
            >
              <div className="h-60 relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#2d4a1e] px-3 py-1 rounded-md text-[0.6rem] font-black tracking-widest uppercase shadow-sm">
                  {meal.day}
                </div>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-display font-bold leading-tight group-hover:text-[#2d4a1e]">
                    {meal.title}
                  </h3>
                  <button className="text-gray-200 hover:text-accent-orange transition-colors">
                    <HeartIcon className="w-6 h-6 fill-none" />
                  </button>
                </div>
                <p className="text-sm text-text-muted mb-6 line-clamp-2 leading-relaxed">
                  {meal.description}
                </p>
                <div className="mt-auto pt-5 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                    {meal.time}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-accent-orange transition-colors">
                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-accent-orange transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default MealPlan;
