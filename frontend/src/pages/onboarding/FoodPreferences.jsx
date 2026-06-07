import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../../components/layout/OnboardingLayout";
import { toast } from "sonner";
import {
  RhombusAlertIcon,
  CircleAlertIcon,
  CloseIcon,
  PlusIcon,
} from "../../constants/icons";
import { Preferences } from "../../constants/preferences";
import { preferencesService } from "../../services/preferences.api";

// all start unticked — user actively selects what applies to them
// added Shellfish and Eggs — both very common allergens in Nigeria
const DEFAULT_DIETARY_TAGS = [
  { label: "Gluten-Free", active: false },
  { label: "Lactose-Intolerant", active: false },
  { label: "Nut-Free", active: false },
  { label: "Shellfish", active: false },
  { label: "Eggs", active: false },
];

const FoodPreferences = () => {
  const navigate = useNavigate();
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [dietaryTags, setDietaryTags] = useState(DEFAULT_DIETARY_TAGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllergyTip, setShowAllergyTip] = useState(false);

  const handleTogglePref = (id) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleTag = (id) => {
    setDietaryTags((prev) =>
      prev.map((tag, i) => (i === id ? { ...tag, active: !tag.active } : tag)),
    );
  };

  const handleNext = async () => {
    if (selectedPrefs.length === 0) {
      toast.error("Please select at least one food preference.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      selectedPreferences: selectedPrefs.map((id) => Preferences[id].category),
      allergies: allergyInput.trim()
        ? allergyInput
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
            .join(", ")
        : "",
      dietaryTags: dietaryTags
        .filter((tag) => tag.active)
        .map((tag) => tag.label),
    };

    try {
      await preferencesService.saveFoodPreferences(payload);
      toast.success("Your food preferences were saved successfully.");
      localStorage.removeItem("onboarding_budget");
      localStorage.removeItem("onboarding_frequency");
      localStorage.setItem("onboarded", "true");
      navigate("/onboarding/generating-plan");
    } catch (err) {
      console.error(
        err?.message || "An error occurred while saving preferences.",
      );
      toast.error("We couldn't save your food preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={3}
      label="Preferences"
      prevTo="/onboarding/cooking-frequency"
      onNext={handleNext}
      nextButtonDisabled={isSubmitting}
      nextLabel={isSubmitting ? "Saving..." : "Generate Plan"}
    >
      <h1 className="text-[28px] font-bold leading-tight mb-2">
        What do you enjoy eating?
      </h1>
      <p className="text-sm text-body mb-6">
        Tell your flavour so we can help curate the best experience for you!
      </p>

      {/* food category grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {Preferences.map((pref, id) => (
          <button
            key={id}
            onClick={() => handleTogglePref(id)}
            className="group relative rounded-2xl overflow-hidden h-36 cursor-pointer transition-all duration-300"
          >
            <img
              src={pref.image}
              alt={pref.category}
              className="w-full h-full object-cover"
            />
            <div
              className={`transition-all absolute inset-0 ${
                selectedPrefs.includes(id)
                  ? "bg-text-primary/70 group-hover:bg-text-primary/70"
                  : "bg-none group-hover:bg-white/50"
              }`}
            />
            <div
              className={`group-hover:bottom-2 transition-all w-[90%] absolute -bottom-20 h-20 left-1/2 -translate-x-1/2 right-0 flex flex-col items-center justify-center gap-2 py-1 px-2 rounded-sm ${
                selectedPrefs.includes(id)
                  ? "bottom-2 bg-text-primary/75 text-white"
                  : "-bottom-20 bg-white group-hover:bg-white"
              }`}
            >
              <span
                className={`text-lg drop-shadow-md ${
                  selectedPrefs.includes(id)
                    ? "text-white"
                    : "text-accent-orange"
                }`}
              >
                {pref.icon}
              </span>
              <span
                className={`text-xs font-bold leading-tight drop-shadow-md text-center ${
                  selectedPrefs.includes(id)
                    ? "text-white"
                    : "text-text-primary"
                }`}
              >
                {pref.category}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* dietary requirements */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-3">
          <RhombusAlertIcon className="text-lg text-accent-orange" />
          <h2 className="text-base font-bold">Dietary Requirements</h2>
        </div>

        <p className="text-sm font-medium mb-3">Do you have any allergies?</p>

        {/* textarea with clickable info icon */}
        <div className="relative mb-4">
          <textarea
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="e.g. Peanuts, Shellfish, Gluten..."
            className="w-full bg-white/50 border border-body/20 rounded-xl p-3 text-sm resize-none h-20 outline-none focus:border-accent-orange transition-colors"
          />

          <div className="absolute bottom-2 right-2">
            <button
              type="button"
              onClick={() => setShowAllergyTip((prev) => !prev)}
              className="flex items-center justify-center"
            >
              <CircleAlertIcon className="text-body text-xs hover:text-accent-orange transition-colors cursor-pointer" />
            </button>

            {showAllergyTip && (
              <div className="absolute bottom-full right-0 mb-2 w-72 p-4 bg-text-primary text-white text-[11px] rounded-xl z-50 shadow-xl">
                <p className="font-bold mb-1.5">💡 About Food Allergies</p>
                <p className="leading-relaxed mb-2">
                  A food allergy is when your immune system reacts negatively to
                  a specific ingredient. Reactions can range from mild
                  discomfort to severe responses.
                </p>
                <p className="leading-relaxed mb-2">
                  <span className="font-semibold">Common in Nigeria:</span>{" "}
                  Peanuts (used in soups and stews), shellfish (fresh fish
                  markets), eggs (baked goods and breakfast), and dairy (lactose
                  intolerance affects up to 90% of Africans).
                </p>
                <p className="leading-relaxed text-white/70">
                  Always inform your chef or host about your allergies before
                  eating a meal prepared by others.
                </p>
                {/* arrow pointing down */}
                <div className="absolute top-[99%] right-3 border-8 border-transparent border-t-text-primary" />
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-body mb-2">Select any that apply to you:</p>
        <div className="flex flex-wrap gap-2">
          {dietaryTags.map((tag, id) => (
            <button
              key={id}
              onClick={() => handleToggleTag(id)}
              className={`py-2 px-4 rounded-sm text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                tag.active
                  ? "bg-text-primary/20 text-text-primary border border-text-primary/30"
                  : "bg-white/50 text-body border border-body/20"
              }`}
            >
              <span className="text-[10px]">
                {tag.active ? <CloseIcon /> : <PlusIcon />}
              </span>
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default FoodPreferences;
