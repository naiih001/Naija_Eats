import { useState, useEffect } from "react";
import { SearchIcon } from "../../constants/icons";
import { planService } from "../../services/plan.api";

export default function SwapMealModal({ swapItem, onClose, onSwapComplete }) {
  const [availableMeals, setAvailableMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(true);

  // Custom meal state
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customMealName, setCustomMealName] = useState("");
  const [customMealPrice, setCustomMealPrice] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoadingMeals(true);
        const res = await planService.getMeals();
        // The API wraps the response in 'data', and axios also wraps in 'data'
        const mealsArray =
          res.data?.data?.meals ||
          res.data?.meals ||
          (Array.isArray(res.data) ? res.data : []);
        setAvailableMeals(mealsArray);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      } finally {
        setLoadingMeals(false);
      }
    };
    if (swapItem) fetchMeals();
  }, [swapItem]);

  const filteredAvailableMeals = availableMeals.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category &&
        m.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleConfirmSwap = async (mealId) => {
    try {
      setIsSwapping(true);
      const res = await planService.updateTimetableItem(swapItem.id, mealId);
      onSwapComplete(res.data);
      setSearchQuery("");
    } catch (err) {
      console.error("Failed to swap meal:", err);
      alert(err.message || "Failed to swap meal");
    } finally {
      setIsSwapping(false);
      onClose();
    }
  };

  const handleAddCustomMeal = async () => {
    if (!customMealName.trim()) {
      alert("Please enter a custom meal name");
      return;
    }
    try {
      setIsSwapping(true);
      const customRes = await planService.createCustomMeal({
        name: customMealName,
        price: customMealPrice ? Number(customMealPrice) : 0,
      });
      const newMeal = customRes.data;

      const res = await planService.updateTimetableItem(
        swapItem.id,
        newMeal.id,
      );
      onSwapComplete(res.data);
    } catch (err) {
      console.error("Failed to create and swap custom meal:", err);
      alert(err.message || "Failed to add custom meal");
    } finally {
      setIsSwapping(false);
      onClose();
    }
  };

  if (!swapItem) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-5 border-b border-black/5 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-display font-bold text-text-primary">
              Swap Meal
            </h3>
            <p className="text-xs text-text-muted">
              Replacing <strong>{swapItem.name}</strong> ({swapItem.type})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-muted transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/5">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              !isCustomMode
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-text-muted hover:bg-black/5"
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              isCustomMode
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-text-muted hover:bg-black/5"
            }`}
          >
            Custom Meal
          </button>
        </div>

        {isCustomMode ? (
          <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">
                Meal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customMealName}
                onChange={(e) => setCustomMealName(e.target.value)}
                placeholder="e.g. Ewa Agoyin Special"
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm outline-none focus:bg-black/10 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1">
                Estimated Price (₦)
              </label>
              <input
                type="number"
                value={customMealPrice}
                onChange={(e) => setCustomMealPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-black/5 border-none rounded-xl py-3 px-4 text-sm outline-none focus:bg-black/10 transition-colors"
              />
            </div>
            <button
              onClick={handleAddCustomMeal}
              disabled={isSwapping || !customMealName.trim()}
              className="mt-4 w-full bg-accent-orange hover:bg-[#e66a13] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              Add & Swap
            </button>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-black/5">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 border-none rounded-xl py-2 pl-9 pr-4 text-sm outline-none placeholder:text-text-muted focus:bg-black/10 transition-colors"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-white">
              {loadingMeals ? (
                <div className="text-center py-8 text-text-muted text-sm animate-pulse">
                  Loading alternatives...
                </div>
              ) : filteredAvailableMeals.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  No matching meals found. Try adding a Custom Meal!
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableMeals.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => !isSwapping && handleConfirmSwap(m.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        swapItem.meal_id === m.id ||
                        swapItem.id === m.id ||
                        swapItem.meal?.id === m.id
                          ? "border-accent-orange bg-accent-orange/5"
                          : "border-black/5 hover:border-accent-orange/30 cursor-pointer"
                      } transition-colors`}
                    >
                      <div>
                        <p className="text-sm font-bold text-text-primary">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">
                          {m.category}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-orange-900">
                        ₦{Number(m.price_min).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {isSwapping && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-text-primary flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
              Swapping...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
