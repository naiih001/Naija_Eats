// import { MEAL_DETAILS } from "../constants/mealDetails";
// import { IngredientLookup } from "../constants/ingredientLookup";

export const SLOT_ORDER = ["Breakfast", "Lunch", "Dinner"];

export const SLOT_EMOJI = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
};

export function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(),
  );
}

export function normaliseSlot(type = "") {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function getMealIngredients(meal) {
  if (meal.ingredients && Array.isArray(meal.ingredients)) {
    return meal.ingredients.map(ing => {
      // If backend returns strings for some reason, normalize to object
      if (typeof ing === "string") {
        return { name: ing, category: "Other", quantity: null };
      }
      return ing;
    });
  }
  return [];
}
