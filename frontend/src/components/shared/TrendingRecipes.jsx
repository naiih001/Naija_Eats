import {
  StopWatch,
  ChartIcon,
  BookmarkIcon,
  TrendUpIcon,
} from "../../constants/icons";

export default function TrendingRecipes() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-white rounded-4xl overflow-hidden group cursor-pointer border border-text-muted/5">
        <div className="relative h-100 lg:h-125">
          <img
            src="/images/fisherman_soup.png"
            alt="Fisherman's Harvest Soup"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="px-3 py-1.5 bg-accent-orange rounded-xl text-white mb-4 inline-block text-xs font-bold">
              Trending
            </span>
            <h3 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              Fisherman&apos;s Harvest Soup
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

      <div className="lg:col-span-5 grid grid-cols-1 gap-6">
        <div className="bg-[#1A3013] rounded-4xl overflow-hidden group cursor-pointer h-full min-h-60 relative">
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
              25 Min &bull; Medium Effort
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
              <h4 className="text-sm font-bold text-white drop-shadow-md">
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
              <h4 className="text-sm font-bold text-white drop-shadow-md">
                Fonio Superbowl
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
