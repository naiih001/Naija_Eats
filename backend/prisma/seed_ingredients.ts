import { prisma } from "../src/config/prisma";
import { getMealIngredients } from "../src/data/mealIngredients";


async function seedIngredients() {
  const meals = await prisma.meals.findMany();
  console.log(`Found ${meals.length} meals to update`);

  let updated = 0;
  for (const meal of meals) {
    const ingredients = getMealIngredients(meal.name, meal.category);
    await prisma.meals.update({
      where: { id: meal.id },
      data: { ingredients: ingredients as any },
    });
    updated++;
  }

  console.log(`Updated ${updated} meals with ingredient data`);
}

seedIngredients()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
