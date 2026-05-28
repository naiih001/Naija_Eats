import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../../components/layout/OnboardingLayout";
import { toast } from "sonner";
import { GroupIcon, SweetTooth } from "../../constants/icons";
import CustomRadio from "../../components/ui/CustomRadio";
import { preferencesService } from "../../services/preferences.api";

const HOUSEHOLD_OPTIONS = [
  { value: "1", label: "SOLO", number: "1" },
  { value: "2", label: "DUO", number: "2" },
  { value: "3", label: "SMALL", number: "3" },
  { value: "4", label: "FAMILY", number: "4" },
];

const MEAL_COUNTS = ["1", "2", "3"];

const FREQUENCY_OPTIONS = [
  "Daily (7 Days)",
  "Most Days (5-6 Days)",
  "Once in a while (3-4 Days)",
  "Rarely (1-2 Days)",
];

const FREQUENCY_MAP = {
  "Daily (7 Days)": "daily",
  "Most Days (5-6 Days)": "most-days",
  "Once in a while (3-4 Days)": "sometimes",
  "Rarely (1-2 Days)": "rarely",
};

const CookingFrequency = () => {
  const navigate = useNavigate();
  const [householdSize, setHouseholdSize] = useState("1");
  const [dailyMeals, setDailyMeals] = useState("1");
  const [includeDesserts, setIncludeDesserts] = useState(false);
  const [selectedFrequencies, setSelectedFrequencies] = useState([]);

  const handleFrequencySelect = (option) => {
    setSelectedFrequencies([option]);
  };

  const handleNext = async () => {
    if (selectedFrequencies.length === 0) {
      toast.error("Please tell us how often you cook.");
      return;
    }

    const getFrequencyPayload = () => ({
      household_size: parseInt(householdSize),
      daily_meals: parseInt(dailyMeals),
      is_dessert: includeDesserts,
      cooking_frequency: FREQUENCY_MAP[selectedFrequencies[0]] || "daily",
    });

    // save to localStorage — API call happens at the end in FoodPreferences
    const storeFrequencyLocally = () => {
      localStorage.setItem(
        "onboarding_frequency",
        JSON.stringify({
          household_size: parseInt(householdSize),
          daily_meals: parseInt(dailyMeals),
          is_dessert: includeDesserts,
          cooking_frequency: FREQUENCY_MAP[selectedFrequencies[0]] || "daily",
        }),
      );
    };

    try {
      await preferencesService.saveCookingFrequency(getFrequencyPayload());
      storeFrequencyLocally();
      toast.success("Cooking frequency saved successfully.");
      navigate("/onboarding/food-preferences");
    } catch (err) {
      console.log(
        err?.message || "An error occurred while saving preferences.",
      );
      toast.error("We couldn't save your cooking frequency. Please try again.");
    }
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={3}
      label="Frequency"
      prevTo="/onboarding/set-budget"
      onNext={handleNext}
      nextLabel="Set Preferences"
    >
      <h1 className="text-subheading font-bold leading-tight mb-2">
        Your Daily Rhythm
      </h1>
      <p className="text-base text-body font-inter mb-6">
        Tell us how you'd like to experience your meals so we can tailor the
        perfect plan for your household.
      </p>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {/* household size */}
        <div className="bg-white/50 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <GroupIcon className={"text-lg"} />
            <span className="text-sm font-bold font-inter">Household Size</span>
          </div>
          <div className="flex gap-2">
            {HOUSEHOLD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHouseholdSize(opt.value)}
                className={`flex-1 py-5 rounded-sm flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${
                  householdSize === opt.value
                    ? "bg-text-primary border text-bg-background"
                    : "bg-white/80 text-text-primary border border-body/20"
                }`}
              >
                <span className="text-lg font-bold font-inter">
                  {opt.number}
                </span>
                <span className="text-[10px] font-semibold font-inter uppercase tracking-wider">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* daily meals */}
        <div className="bg-white/50 rounded-2xl p-5 mb-4">
          <span className="text-sm font-bold font-inter mb-1">Daily Meals</span>
          <p className="text-xs text-body font-inter mb-4">
            How many meals daily?
          </p>
          <div className="flex gap-2">
            {MEAL_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setDailyMeals(count)}
                className={`flex-1 py-1.5 rounded-full text-sm font-semibold font-inter transition-all duration-300 cursor-pointer ${
                  dailyMeals === count
                    ? "bg-text-primary text-bg-background"
                    : "bg-transparent text-body"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 place-items-stretch">
        {/* sweet tooth */}
        <div className="bg-white/50 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold font-inter">Sweet Tooth</span>
            <SweetTooth className={"text-lg text-accent-orange/50"} />
          </div>
          <p className="text-xs text-body font-inter mb-4">Include desserts?</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold font-inter text-body">
              NO
            </span>
            <button
              onClick={() => setIncludeDesserts(!includeDesserts)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                includeDesserts ? "bg-accent-orange" : "bg-body/30"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                  includeDesserts ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-xs font-semibold font-inter text-body">
              YES
            </span>
          </div>
        </div>

        {/* cooking frequency */}
        <div className="bg-white/50 rounded-2xl p-5">
          <span className="text-sm font-bold font-inter mb-4">
            How often do you cook?
          </span>
          <ul className="flex flex-col gap-1">
            {FREQUENCY_OPTIONS.map((option) => (
              <li
                key={option}
                className="flex items-center gap-3 py-3 cursor-pointer"
                onClick={() => handleFrequencySelect(option)}
              >
                <CustomRadio checked={selectedFrequencies.includes(option)} />
                <span className="text-sm font-medium font-inter">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default CookingFrequency;
