import Button from "../ui/Button";
import Header from "../ui/Header";

const STEPS = [
  { id: 1, label: "Budget & Buffer" },
  { id: 2, label: "Daily Rhythm" },
  { id: 3, label: "Food Interests" },
];

const OnboardingLayout = ({
  step,
  totalSteps,
  label,
  prevTo,
  nextTo,
  nextLabel = "Set Daily Rhythm",
  onNext,
  nextButtonDisabled = false,
  children,
  submitFunction,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-background overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row relative">
        {/* Decorative blobs*/}
        <img
          src="/images/blob-1.svg"
          alt="blob image"
          className="absolute -top-20 -left-4 w-40 h-40 opacity-10 pointer-events-none"
        />
        <img
          src="/images/blob-2.svg"
          className="absolute top-24 -right-12 opacity-15 w-70 h-70 pointer-events-none"
        />
        <img
          src="/images/blob-3.svg"
          className="absolute bottom-4 -right-6 w-75 pointer-events-none"
        />

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:flex w-full lg:w-75 flex-col p-12 border-r border-text-muted/10 relative z-20">
          <div className="mb-12">
            <div className="flex flex-col gap-8">
              {STEPS.map((s) => {
                const isCompleted = s.id < step;
                const isActive = s.id === step;

                return (
                  <div key={s.id} className="flex items-center gap-4 group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-inter transition-all duration-300 ${
                        isActive
                          ? "bg-accent-orange text-white shadow-lg scale-110"
                          : isCompleted
                            ? "bg-text-primary text-white"
                            : "bg-white border-2 border-text-muted/20 text-text-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        s.id
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${
                          isActive ? "text-accent-orange" : "text-text-muted"
                        }`}
                      >
                        Step {s.id}
                      </span>
                      <span
                        className={`text-sm font-bold font-inter transition-colors duration-300 ${
                          isActive ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-text-muted/10">
            <div className="flex flex-wrap gap-4 opacity-60">
              <span className="text-[10px] text-text-muted font-inter">
                Help Center
              </span>
              <span className="text-[10px] text-text-muted font-inter">
                Privacy
              </span>
              <span className="text-[10px] text-text-muted font-inter">
                Terms
              </span>
            </div>
            <p className="text-[10px] text-text-muted font-inter mt-2 opacity-60">
              © 2026 NaijaEats
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
          <div className="lg:hidden px-6 pt-8 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-text-primary uppercase tracking-widest">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs font-bold text-accent-orange">
                {label}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-orange transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 px-6 py-8 mx-auto w-full max-w-5xl lg:overflow-y-auto">
            {children}
          </div>

          <div className="px-3 py-6 mt-auto w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {prevTo ? (
                <Button
                  variant="outline"
                  to={prevTo}
                  className="py-4 px-10 text-sm font-bold min-w-30"
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {onNext ? (
                <Button
                  variant="primary"
                  onClick={onNext}
                  disabled={nextButtonDisabled}
                  className="py-4 px-10 text-sm font-bold min-w-40"
                >
                  {nextLabel} <span className="ml-2">→</span>
                </Button>
              ) : nextTo ? (
                <Button
                  variant="primary"
                  to={nextTo}
                  onClick={submitFunction}
                  disabled={nextButtonDisabled}
                  className="py-4 px-10 text-sm font-bold min-w-40"
                >
                  {nextLabel} <span className="ml-2">→</span>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
