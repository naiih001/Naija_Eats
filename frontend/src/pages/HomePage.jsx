import { Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  StopWatch,
  BoltIcon,
  ChevronRightIcon,
  PlusIcon,
  GenerateIcon,
  BasketIcon,
  StarIcon,
  ChartIcon,
  BookmarkIcon,
  TrendUpIcon,
  // TrendDownIcon,
} from "../constants/icons";
import { WeekPlan } from "../constants/weekPlan";
import Button from "../components/ui/Button";

const HomePage = () => {
  const navigate = useNavigate();

  const categories = ["All", "Yoruba", "Igbo", "Hausa"];

  return (
    <div className="flex flex-col gap-10 p-6 lg:p-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div
          onClick={() => navigate("/meal/jollof-rice-and-grilled-fish")}
          className="lg:col-span-5 bg-text-primary rounded-3xl overflow-hidden text-white cursor-pointer group"
        >
          <div className="relative h-70">
            <img
              src="/images/jollof_fish_plantains.png"
              alt="Jollof Rice & Grilled Fish"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-accent-orange text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              Monday
            </div>
          </div>
          <div className="p-4 ">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl lg:text-subheading font-display font-bold">
                Jollof Rice & Grilled Fish
              </h2>
              <HeartIcon className="w-8 h-8 text-accent-orange fill-accent-orange" />
            </div>
            <p className="text-text-muted text-base lg:text-lg mb-6 leading-relaxed max-w-xl">
              A decade proven meal that has served various generations of
              African Heritage.
            </p>
            <div className="flex gap-4 text-sm font-medium opacity-80">
              <div className="flex items-center gap-2">
                <StopWatch className="w-5 h-5" />
                <span>45 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <BoltIcon className="w-5 h-5" />
                <span>520 kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-transparent rounded-3xl border-2 border-text-primary p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-text-primary px-3 py-1 rounded-full w-fit">
              <div className="w-4 h-4 bg-text-primary rounded-full flex items-center justify-center text-[8px] text-white">
                <StarIcon />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                The Elite Taste of Nigeria
              </span>
            </div>
            <h1 className="text-subheading lg:text-[42px] font-display font-bold text-text-primary leading-tight">
              Heritage Flavors, <br />
              <span className="text-[#8B4513] font-display!">
                Modern <br /> Convenience
              </span>
            </h1>
            <p className="text-text-muted leading-relaxed font-inter">
              Experience curated culinary journeys with our premium meal
              planning and authentic local grocery delivery service designed for
              the modern Nigerian home.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Button
              className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2"
              onClick={() => navigate("/menu-page")}
            >
              View Menu <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <button
              className="w-full py-4 border-2 border-text-primary text-text-primary rounded-xl font-bold text-sm hover:bg-text-primary hover:text-white transition-all cursor-pointer"
              onClick={() => navigate("/market")}
            >
              Explore Market
            </button>
          </div>
        </div>
      </section>

      {/* Weekly Plan & Sidebar Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Plan */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-text-muted/5">
          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
                Your Weekly Plan
              </h2>
              <p className="text-xs text-text-muted font-medium">
                OCT 23 - OCT 29 • 85% Completed
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
            {WeekPlan.slice(0, 3).map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 min-w-40 shrink-0 group cursor-pointer"
              >
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">
                  {day.day}
                </span>
                <div
                  className={`relative rounded-2xl overflow-hidden h-48 border-2 transition-all ${idx === 1 ? "border-accent-orange ring-4 ring-accent-orange/10" : "border-transparent"}`}
                >
                  <img
                    src={day.meals[0].image || "/images/dish.webp"}
                    alt={day.meals[0].name}
                    className="w-full h-full object-cover"
                  />
                  {idx === 1 && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-accent-orange rounded-full flex items-center justify-center text-[10px] font-bold text-white ">
                      !
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 ml-1">
                  <h4 className="text-sm font-bold text-text-primary line-clamp-1">
                    {day.meals[0].name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${idx === 1 ? "text-accent-orange" : "text-[#5C8C4C]"}`}
                  >
                    {day.meals[0].type}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex flex-col justify-center items-center gap-3 min-w-40 h-60 rounded-3xl border-2 border-dashed border-text-muted/20 bg-text-muted/5 text-text-muted group hover:bg-text-muted/10 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full border-2 border-text-muted/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">
                Plan Thursday
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-accent-orange rounded-3xl p-6 text-white flex flex-col justify-between h-auto  relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <BasketIcon className="w-8 h-8 mb-1 opacity-80" />
              <h3 className="text-xl font-display font-bold mb-1">
                Market Day
              </h3>
              <p className="text-[10px] font-medium text-white/80 max-w-45">
                Pre-order local ingredients for next week's meal plan.
              </p>
            </div>
            <button
              onClick={() => navigate("/market")}
              className="relative z-10 w-fit bg-black/20 hover:bg-black/30 px-4 py-2 rounded-lg text-xs font-bold transition-all mt-4"
            >
              Shop The Market
            </button>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform cursor-pointer" />
          </div>

          <div className="bg-[#1A3013] rounded-3xl p-6 text-white flex flex-col justify-between h-auto  relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <div className="w-8 h-8 mb-4 opacity-80 flex items-center justify-center">
                <GenerateIcon className={"w-8 h-8 text-white"} />
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

      {/* Trending Recipes */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary">
            Trending Recipes
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  cat === "All"
                    ? "bg-[#D1D89D] text-text-primary"
                    : "bg-white border border-text-muted/10 text-text-muted hover:border-text-primary hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

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
                <div className="flex justify-between items-center">
                  <div className="flex gap-6 text-xs font-bold opacity-80">
                    <div className="flex items-center gap-2">
                      <StopWatch className="w-4 h-4" />
                      <span>45 Min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <ChartIcon />
                      </div>
                      <span>Advanced</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                    <BookmarkIcon />
                  </button>
                </div>
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
                <span className="text-[10px] font-bold text-white/60">
                  25 Min • Medium Effort
                </span>
              </div>
              <div className="absolute bottom-6 right-6 text-white opacity-40">
                <TrendUpIcon />
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
      </section>
    </div>
  );
};

export default HomePage;
