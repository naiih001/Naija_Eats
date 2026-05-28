import { IngredientLookup } from "../constants/ingredientLookup";

export const getMealMarketData = (meal) => {
    const grouped = {};

    meal.ingredients.forEach((ing) => {
        const data = IngredientLookup[ing];
        if (!data) return;

        const { category, ...itemData } = data;
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({ name: ing, ...itemData, bought: false });
    });

    return Object.entries(grouped).map(([category, items]) => ({
        category,
        items,
    }));
};