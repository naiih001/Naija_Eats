import { getIngredientInfo } from "./ingredientLookup";

export interface MealIngredient {
  name: string;
  quantity: string | null;
  category: string;
}

function ing(name: string): MealIngredient {
  const info = getIngredientInfo(name);
  return { name, quantity: info.quantity, category: info.category };
}

const KNOWN_MEAL_INGREDIENTS: Record<string, MealIngredient[]> = {
  "Jollof Rice": [
    ing("Rice"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Egusi Soup": [
    ing("Melon Seeds"), ing("Meat"), ing("Spinach"), ing("Palm Oil"),
    ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Ogbono Soup": [
    ing("Meat"), ing("Palm Oil"), ing("Crayfish"), ing("Pepper"),
    ing("Onions"), ing("Spinach"), ing("Salt"),
  ],
  "Efo Riro": [
    ing("Spinach"), ing("Locust Beans"), ing("Meat"), ing("Palm Oil"),
    ing("Pepper"), ing("Onions"), ing("Crayfish"), ing("Salt"),
  ],
  "Fried Rice": [
    ing("Rice"), ing("Carrots"), ing("Green Pepper"), ing("Vegetable Oil"),
    ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Moi Moi": [
    ing("Beans"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"),
    ing("Egg"), ing("Salt"),
  ],
  "Pepper Soup": [
    ing("Meat"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"), ing("Seasoning Cubes"),
  ],
  "Banga Soup": [
    ing("Palm Oil"), ing("Fish"), ing("Meat"), ing("Crayfish"),
    ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Ewa Agoyin": [
    ing("Beans"), ing("Palm Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Okra Soup": [
    ing("Okra"), ing("Meat"), ing("Fish"), ing("Palm Oil"),
    ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Ofada Rice": [
    ing("Rice"), ing("Palm Oil"), ing("Locust Beans"), ing("Pepper"),
    ing("Onions"), ing("Crayfish"), ing("Salt"),
  ],
  "Yam Porridge": [
    ing("Yam"), ing("Palm Oil"), ing("Spinach"), ing("Fish"),
    ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Fish Stew": [
    ing("Fish"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Chicken Stew": [
    ing("Chicken"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Beef Stew": [
    ing("Beef"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Vegetable Soup": [
    ing("Spinach"), ing("Meat"), ing("Palm Oil"), ing("Crayfish"),
    ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Edikang Ikong": [
    ing("Pumpkin Leaves"), ing("Waterleaf"), ing("Meat"), ing("Fish"),
    ing("Palm Oil"), ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Afang Soup": [
    ing("Afang Leaves"), ing("Waterleaf"), ing("Meat"), ing("Fish"),
    ing("Palm Oil"), ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Bitterleaf Soup": [
    ing("Bitterleaf"), ing("Meat"), ing("Fish"), ing("Palm Oil"),
    ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Oha Soup": [
    ing("Oha Leaves"), ing("Meat"), ing("Fish"), ing("Palm Oil"),
    ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Groundnut Soup": [
    ing("Groundnut"), ing("Meat"), ing("Tomatoes"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Nsala Soup": [
    ing("Yam"), ing("Catfish"), ing("Scent Leaves"), ing("Pepper"),
    ing("Crayfish"), ing("Onions"), ing("Salt"),
  ],
  "Ukodo": [
    ing("Plantain"), ing("Yam"), ing("Meat"), ing("Pepper"),
    ing("Onions"), ing("Palm Oil"), ing("Salt"),
  ],
  "Gbegiri": [
    ing("Beans"), ing("Palm Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Ewedu": [
    ing("Jute Leaves"), ing("Locust Beans"), ing("Crayfish"),
    ing("Pepper"), ing("Salt"),
  ],
  "Miyan Kuka": [
    ing("Baobab Leaves"), ing("Meat"), ing("Palm Oil"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Miyan Taushe": [
    ing("Pumpkin"), ing("Groundnut"), ing("Meat"), ing("Pepper"),
    ing("Onions"), ing("Palm Oil"), ing("Salt"),
  ],
  "Dan Wake": [
    ing("Beans"), ing("Pepper"), ing("Palm Oil"), ing("Salt"),
  ],
  "Ayamase": [
    ing("Green Pepper"), ing("Meat"), ing("Palm Oil"), ing("Locust Beans"),
    ing("Crayfish"), ing("Onions"), ing("Salt"),
  ],
  "Miyan Gyada": [
    ing("Groundnut"), ing("Meat"), ing("Pepper"), ing("Onions"),
    ing("Palm Oil"), ing("Salt"),
  ],
  "Karkashi Soup": [
    ing("Sesame Leaves"), ing("Meat"), ing("Palm Oil"), ing("Crayfish"),
    ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Editan Soup": [
    ing("Editan Leaves"), ing("Meat"), ing("Fish"), ing("Palm Oil"),
    ing("Crayfish"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Alale Soup": [
    ing("Meat"), ing("Spinach"), ing("Palm Oil"), ing("Crayfish"),
    ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Coconut Rice": [
    ing("Rice"), ing("Coconut Milk"), ing("Pepper"), ing("Onions"),
    ing("Salt"), ing("Seasoning Cubes"),
  ],
  "Beans and Plantain": [
    ing("Beans"), ing("Plantain"), ing("Palm Oil"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Porridge Beans": [
    ing("Beans"), ing("Palm Oil"), ing("Pepper"), ing("Onions"),
    ing("Crayfish"), ing("Salt"),
  ],
  "Spaghetti Jollof": [
    ing("Spaghetti"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Grilled Catfish": [
    ing("Catfish"), ing("Pepper"), ing("Onions"), ing("Spices"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Cowleg Pepper Soup": [
    ing("Cow Skin"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"), ing("Seasoning Cubes"),
  ],
  "Goat Meat Pepper Soup": [
    ing("Goat Meat"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"), ing("Seasoning Cubes"),
  ],
  "Chicken Pepper Soup": [
    ing("Chicken"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"), ing("Seasoning Cubes"),
  ],
  "Abacha": [
    ing("Cassava Flour"), ing("Palm Oil"), ing("Locust Beans"),
    ing("Crayfish"), ing("Pepper"), ing("Salt"),
  ],
  "Okpa": [
    ing("Beans"), ing("Palm Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Native Jollof Rice": [
    ing("Rice"), ing("Fish"), ing("Palm Oil"), ing("Pepper"),
    ing("Onions"), ing("Crayfish"), ing("Salt"),
  ],
  "Yam Balls": [
    ing("Yam"), ing("Vegetable Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Dambun Nama": [
    ing("Beef"), ing("Pepper"), ing("Spices"), ing("Salt"),
  ],
  "Mushroom Sauce": [
    ing("Mushrooms"), ing("Palm Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Tuwon Dawa Sauce": [
    ing("Baobab Leaves"), ing("Meat"), ing("Palm Oil"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Waina": [
    ing("Rice"), ing("Sugar"), ing("Salt"), ing("Vegetable Oil"),
  ],
  "Zogale": [
    ing("Moringa Leaves"), ing("Groundnut"), ing("Pepper"), ing("Onions"),
    ing("Salt"),
  ],
  "Pepper Rice": [
    ing("Rice"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"),
    ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Coconut Jollof Rice": [
    ing("Rice"), ing("Coconut Milk"), ing("Tomatoes"), ing("Pepper"),
    ing("Onions"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Yaji Fish": [
    ing("Fish"), ing("Pepper"), ing("Suya Spice"), ing("Vegetable Oil"),
    ing("Onions"), ing("Salt"),
  ],
  "Fresh Fish Pepper Soup": [
    ing("Fish"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"),
  ],
  "Dry Fish Pepper Soup": [
    ing("Fish"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"),
  ],
  "Bushmeat Pepper Soup": [
    ing("Meat"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"),
  ],
  "Catfish Stew": [
    ing("Catfish"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Goat Meat Stew": [
    ing("Goat Meat"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Turkey Pepper Soup": [
    ing("Turkey"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"),
  ],
  "Snail Pepper Soup": [
    ing("Snails"), ing("Pepper"), ing("Ginger"), ing("Garlic"),
    ing("Scent Leaves"), ing("Salt"),
  ],
  "Assorted Meat Stew": [
    ing("Meat"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
  ],
  "White Soup": [
    ing("Yam"), ing("Catfish"), ing("Scent Leaves"), ing("Pepper"),
    ing("Crayfish"), ing("Onions"), ing("Salt"),
  ],

  "Pounded Yam": [ing("Yam"), ing("Water")],
  "Tuwo Shinkafa": [ing("Rice"), ing("Water")],
  "Amala": [ing("Yam Flour"), ing("Water")],
  "Semovita": [ing("Semovita"), ing("Water")],
  "Wheat Flour Swallow": [ing("Wheat Flour"), ing("Water")],
  "Garri": [ing("Garri"), ing("Water")],
  "Fufu": [ing("Cassava Flour"), ing("Plantain"), ing("Water")],
  "Eba": [ing("Garri"), ing("Water")],
  "Tuwo Masara": [ing("Corn Flour"), ing("Water")],
  "Lafun": [ing("Cassava Flour"), ing("Water")],
  "Tuwo Dawa": [ing("Millet Flour"), ing("Water")],

  "Akara": [
    ing("Beans"), ing("Vegetable Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Egg Sauce": [
    ing("Egg"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Bread and Fried Egg": [
    ing("Bread"), ing("Egg"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Indomie": [
    ing("Instant Noodles"), ing("Egg"), ing("Onions"), ing("Pepper"),
  ],
  "Yam and Egg Sauce": [
    ing("Yam"), ing("Egg"), ing("Tomatoes"), ing("Pepper"),
    ing("Onions"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Akara and Bread": [
    ing("Beans"), ing("Bread"), ing("Vegetable Oil"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Tea and Bread": [ing("Bread"), ing("Tea Leaves"), ing("Sugar"), ing("Milk")],
  "Custard and Akara": [
    ing("Custard Powder"), ing("Beans"), ing("Vegetable Oil"),
    ing("Pepper"), ing("Onions"), ing("Sugar"), ing("Milk"), ing("Salt"),
  ],
  "Pap (Ogi)": [ing("Corn Flour"), ing("Water"), ing("Sugar")],
  "Masa": [ing("Rice"), ing("Sugar"), ing("Salt"), ing("Vegetable Oil")],
  "Koko and Koose": [ing("Beans"), ing("Millet Flour"), ing("Pepper"),
    ing("Onions"), ing("Vegetable Oil"), ing("Sugar"), ing("Salt"),
  ],
  "Alkubus": [ing("Flour"), ing("Sugar"), ing("Salt"), ing("Water")],
  "Yam and Palm Oil": [ing("Yam"), ing("Palm Oil"), ing("Salt")],
  "Bread and Akara": [
    ing("Bread"), ing("Beans"), ing("Vegetable Oil"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],

  "Suya": [ing("Beef"), ing("Suya Spice"), ing("Vegetable Oil"), ing("Onions"), ing("Salt")],
  "Asun": [ing("Goat Meat"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"), ing("Salt")],
  "Meat Pie": [ing("Flour"), ing("Beef"), ing("Potatoes"), ing("Carrots"),
    ing("Butter"), ing("Salt"),
  ],
  "Puff Puff": [ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Salt")],
  "Chin Chin": [ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Butter"), ing("Salt")],
  "Boli": [ing("Plantain"), ing("Palm Oil"), ing("Salt")],
  "Peppered Snails": [
    ing("Snails"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Scotch Egg": [ing("Egg"), ing("Beef"), ing("Flour"), ing("Vegetable Oil"), ing("Salt")],
  "Egg Roll": [ing("Egg"), ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Salt")],
  "Nkwobi": [
    ing("Cow Skin"), ing("Palm Oil"), ing("Pepper"), ing("Onions"),
    ing("Crayfish"), ing("Salt"),
  ],
  "Isi Ewu": [
    ing("Goat Meat"), ing("Palm Oil"), ing("Pepper"), ing("Onions"),
    ing("Crayfish"), ing("Salt"),
  ],
  "Ugba": [
    ing("Locust Beans"), ing("Palm Oil"), ing("Pepper"), ing("Onions"),
    ing("Crayfish"), ing("Salt"),
  ],
  "Kilishi": [
    ing("Beef"), ing("Suya Spice"), ing("Pepper"), ing("Salt"),
  ],
  "Kuli Kuli": [ing("Groundnut"), ing("Vegetable Oil"), ing("Salt")],
  "Balangu": [ing("Meat"), ing("Pepper"), ing("Spices"), ing("Salt")],
  "Awara": [ing("Beans"), ing("Vegetable Oil"), ing("Salt")],
  "Gizdodo": [
    ing("Chicken"), ing("Plantain"), ing("Tomatoes"), ing("Pepper"),
    ing("Onions"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Fish Roll": [ing("Fish"), ing("Flour"), ing("Vegetable Oil"), ing("Pepper"), ing("Salt")],
  "Samosa": [ing("Beef"), ing("Flour"), ing("Onions"), ing("Pepper"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Buns": [ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Salt")],
  "Gizzard": [
    ing("Chicken"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"),
    ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Roasted Corn": [ing("Corn Flour"), ing("Salt")],
  "Boiled Corn": [ing("Corn Flour"), ing("Salt")],
  "Plantain Chips": [ing("Plantain"), ing("Vegetable Oil"), ing("Salt")],
  "Coconut Candy": [ing("Coconut Milk"), ing("Sugar")],
  "Groundnut Cake": [ing("Groundnut"), ing("Sugar"), ing("Butter")],
  "Dankwa": [ing("Millet Flour"), ing("Groundnut"), ing("Pepper"), ing("Salt")],
  "Agege Bread": [ing("Flour"), ing("Sugar"), ing("Butter"), ing("Salt")],
  "Yaji Chips": [ing("Potatoes"), ing("Vegetable Oil"), ing("Suya Spice"), ing("Salt")],
  "Roasted Groundnut": [ing("Groundnut"), ing("Salt")],
  "Coconut Flakes": [ing("Coconut Milk"), ing("Sugar")],

  "Fried Plantain (Dodo)": [ing("Plantain"), ing("Vegetable Oil"), ing("Salt")],
  "Fried Yam": [ing("Yam"), ing("Vegetable Oil"), ing("Salt")],
  "Fried Titus Fish": [ing("Fish"), ing("Vegetable Oil"), ing("Pepper"), ing("Salt")],
  "Nigerian Salad": [
    ing("Lettuce"), ing("Tomatoes"), ing("Cucumber"), ing("Beans"),
    ing("Egg"), ing("Mayonnaise"), ing("Salt"),
  ],
  "Nigerian Coleslaw": [
    ing("Cabbage"), ing("Carrots"), ing("Mayonnaise"), ing("Sugar"), ing("Salt"),
  ],
  "Boiled Plantain": [ing("Plantain"), ing("Salt")],
  "Steamed Vegetables": [
    ing("Carrots"), ing("Green Pepper"), ing("Cabbage"), ing("Salt"),
  ],
  "Fried Chicken": [
    ing("Chicken"), ing("Vegetable Oil"), ing("Spices"), ing("Salt"),
  ],
  "Fried Fish": [
    ing("Fish"), ing("Vegetable Oil"), ing("Spices"), ing("Salt"),
  ],
  "Gizzard Sauce": [
    ing("Chicken"), ing("Pepper"), ing("Onions"), ing("Vegetable Oil"),
    ing("Seasoning Cubes"), ing("Salt"),
  ],
  "Sweet Potato Fries": [
    ing("Sweet Potatoes"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Spicy Fried Potatoes": [
    ing("Potatoes"), ing("Vegetable Oil"), ing("Pepper"), ing("Salt"),
  ],

  "Puff Puff with Honey": [
    ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Honey"), ing("Salt"),
  ],
  "Coconut Rice Pudding": [
    ing("Rice"), ing("Coconut Milk"), ing("Sugar"), ing("Milk"),
  ],
  "Fruit Salad": [ing("Mixed Fruits"), ing("Honey")],
  "Peppermint Candy": [ing("Sugar"), ing("Peppermint")],
  "Doughnuts": [
    ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Butter"), ing("Salt"),
  ],
  "Queen Cakes": [
    ing("Flour"), ing("Sugar"), ing("Egg"), ing("Butter"), ing("Milk"),
  ],
  "Zobo Sorbet": [ing("Hibiscus Leaves"), ing("Sugar"), ing("Ginger")],
  "Kunun Aya Pudding": [ing("Coconut Milk"), ing("Corn Flour"), ing("Sugar")],

  "Pasta Carbonara": [
    ing("Pasta"), ing("Egg"), ing("Cheese"), ing("Salt"), ing("Butter"),
  ],
  "Pizza Margherita": [ing("Flour"), ing("Tomatoes"), ing("Cheese"), ing("Salt")],
  "Beef Burger": [ing("Bread"), ing("Beef"), ing("Tomatoes"), ing("Lettuce"), ing("Salt")],
  "Sushi Roll": [ing("Rice"), ing("Fish"), ing("Nori"), ing("Salt")],
  "Chicken Curry": [
    ing("Chicken"), ing("Onions"), ing("Curry Powder"), ing("Coconut Milk"),
    ing("Pepper"), ing("Salt"),
  ],
  "Tacos": [ing("Beef"), ing("Tortilla"), ing("Tomatoes"), ing("Lettuce"),
    ing("Cheese"), ing("Salt"),
  ],
  "Grilled Salmon": [
    ing("Salmon"), ing("Lemon"), ing("Spices"), ing("Olive Oil"), ing("Salt"),
  ],
  "Vegetable Stir-fry": [
    ing("Carrots"), ing("Cabbage"), ing("Green Pepper"), ing("Soy Sauce"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Lasagna": [
    ing("Pasta"), ing("Beef"), ing("Tomatoes"), ing("Cheese"),
    ing("Butter"), ing("Salt"),
  ],
  "Fish and Chips": [
    ing("Fish"), ing("Potatoes"), ing("Flour"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Ramen": [
    ing("Instant Noodles"), ing("Egg"), ing("Chicken"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Burrito": [
    ing("Tortilla"), ing("Rice"), ing("Beans"), ing("Beef"),
    ing("Cheese"), ing("Salt"),
  ],
  "Fried Rice (Chinese)": [
    ing("Rice"), ing("Egg"), ing("Carrots"), ing("Green Pepper"),
    ing("Soy Sauce"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Chili Con Carne": [
    ing("Beef"), ing("Beans"), ing("Tomatoes"), ing("Pepper"),
    ing("Onions"), ing("Salt"),
  ],
  "Pad Thai": [
    ing("Pasta"), ing("Egg"), ing("Groundnut"), ing("Soy Sauce"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Kebab": [
    ing("Beef"), ing("Pepper"), ing("Onions"), ing("Spices"), ing("Salt"),
  ],
  "Shawarma": [
    ing("Bread"), ing("Chicken"), ing("Tomatoes"), ing("Cabbage"),
    ing("Mayonnaise"), ing("Spices"), ing("Salt"),
  ],
  "Pasta Alfredo": [
    ing("Pasta"), ing("Butter"), ing("Milk"), ing("Cheese"), ing("Salt"),
  ],
  "Thai Green Curry": [
    ing("Chicken"), ing("Coconut Milk"), ing("Green Pepper"), ing("Pepper"),
    ing("Salt"),
  ],
  "Butter Chicken": [
    ing("Chicken"), ing("Butter"), ing("Tomatoes"), ing("Coconut Milk"),
    ing("Pepper"), ing("Salt"),
  ],
  "Peking Duck": [
    ing("Chicken"), ing("Flour"), ing("Cucumber"), ing("Soy Sauce"),
    ing("Spices"), ing("Salt"),
  ],
  "Beef Stroganoff": [
    ing("Beef"), ing("Mushrooms"), ing("Onions"), ing("Butter"), ing("Salt"),
  ],
  "Paella": [
    ing("Rice"), ing("Chicken"), ing("Fish"), ing("Pepper"),
    ing("Onions"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Chicken Parmesan": [
    ing("Chicken"), ing("Tomatoes"), ing("Cheese"), ing("Flour"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Steak and Fries": [
    ing("Beef"), ing("Potatoes"), ing("Butter"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Caesar Salad": [
    ing("Lettuce"), ing("Bread"), ing("Cheese"), ing("Mayonnaise"), ing("Salt"),
  ],
  "Pancakes": [
    ing("Flour"), ing("Egg"), ing("Milk"), ing("Sugar"), ing("Butter"),
  ],
  "French Toast": [
    ing("Bread"), ing("Egg"), ing("Milk"), ing("Sugar"), ing("Butter"),
  ],
  "Omelette": [
    ing("Egg"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Sandwich": [
    ing("Bread"), ing("Beef"), ing("Tomatoes"), ing("Lettuce"),
    ing("Mayonnaise"), ing("Salt"),
  ],
  "Waffles": [
    ing("Flour"), ing("Egg"), ing("Milk"), ing("Sugar"), ing("Butter"),
  ],
  "Cereal Bowl": [ing("Oatmeal"), ing("Milk"), ing("Sugar")],
  "Bagel with Cream Cheese": [ing("Bread"), ing("Cheese"), ing("Butter")],
  "Croissant": [ing("Flour"), ing("Butter"), ing("Sugar"), ing("Egg")],
  "English Breakfast": [
    ing("Egg"), ing("Bread"), ing("Beans"), ing("Tomatoes"),
    ing("Vegetable Oil"), ing("Salt"),
  ],
  "Granola with Yogurt": [ing("Oatmeal"), ing("Yogurt"), ing("Honey"), ing("Mixed Fruits")],

  "Chicken Wings": [
    ing("Chicken"), ing("Vegetable Oil"), ing("Spices"), ing("Salt"),
  ],
  "Falafel": [
    ing("Beans"), ing("Vegetable Oil"), ing("Pepper"), ing("Onions"), ing("Salt"),
  ],
  "Hummus": [ing("Beans"), ing("Garlic"), ing("Lemon"), ing("Olive Oil"), ing("Salt")],
  "Fruit Smoothie": [ing("Mixed Fruits"), ing("Yogurt"), ing("Sugar")],
  "Nachos": [
    ing("Tortilla"), ing("Cheese"), ing("Tomatoes"), ing("Beans"), ing("Salt"),
  ],
  "Garlic Bread": [ing("Bread"), ing("Butter"), ing("Garlic"), ing("Salt")],
  "Mozzarella Sticks": [ing("Cheese"), ing("Flour"), ing("Vegetable Oil"), ing("Salt")],
  "Potato Wedges": [
    ing("Potatoes"), ing("Vegetable Oil"), ing("Spices"), ing("Salt"),
  ],
  "Spring Rolls": [
    ing("Cabbage"), ing("Carrots"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Onion Rings": [
    ing("Onions"), ing("Flour"), ing("Vegetable Oil"), ing("Salt"),
  ],

  "Mashed Potatoes": [ing("Potatoes"), ing("Butter"), ing("Milk"), ing("Salt")],
  "Greek Salad": [
    ing("Tomatoes"), ing("Cucumber"), ing("Onions"), ing("Olive Oil"), ing("Salt"),
  ],
  "Roasted Vegetables": [
    ing("Carrots"), ing("Potatoes"), ing("Vegetable Oil"), ing("Spices"), ing("Salt"),
  ],
  "Sweet Corn": [ing("Corn Flour"), ing("Butter"), ing("Salt")],
  "Coleslaw": [
    ing("Cabbage"), ing("Carrots"), ing("Mayonnaise"), ing("Sugar"), ing("Salt"),
  ],

  "Tiramisu": [ing("Coffee Beans"), ing("Sugar"), ing("Egg"), ing("Cocoa Powder")],
  "Brownies": [ing("Flour"), ing("Sugar"), ing("Egg"), ing("Butter"), ing("Cocoa Powder")],
  "Apple Pie": [ing("Flour"), ing("Butter"), ing("Sugar"), ing("Mixed Fruits"), ing("Cinnamon")],
  "Cheesecake": [ing("Cheese"), ing("Sugar"), ing("Egg"), ing("Butter"), ing("Milk")],
  "Ice Cream Sundae": [ing("Milk"), ing("Sugar"), ing("Mixed Fruits"), ing("Cocoa Powder")],
  "Chocolate Mousse": [ing("Egg"), ing("Sugar"), ing("Butter"), ing("Cocoa Powder")],
  "Creme Brulee": [ing("Egg"), ing("Sugar"), ing("Milk")],
  "Fruit Tart": [ing("Flour"), ing("Butter"), ing("Sugar"), ing("Mixed Fruits"), ing("Milk")],
  "Banoffee Pie": [ing("Flour"), ing("Butter"), ing("Sugar"), ing("Mixed Fruits"), ing("Milk")],
  "Chicken Schnitzel": [
    ing("Chicken"), ing("Flour"), ing("Egg"), ing("Vegetable Oil"), ing("Salt"),
  ],
  "Beef Tacos": [
    ing("Beef"), ing("Tortilla"), ing("Tomatoes"), ing("Lettuce"),
    ing("Cheese"), ing("Salt"),
  ],
};

export function getMealIngredients(mealName: string, category: string): MealIngredient[] {
  const known = KNOWN_MEAL_INGREDIENTS[mealName];
  if (known) return known;

  const normalized = mealName.toLowerCase();

  if (normalized.includes("soup") || normalized.includes("stew")) {
    return [
      ing("Meat"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
      ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
    ];
  }

  switch (category) {
    case "Swallow":
      return [ing("Yam Flour"), ing("Water")];
    case "Breakfast":
      return [ing("Bread"), ing("Egg"), ing("Tea Leaves"), ing("Sugar"), ing("Milk")];
    case "Snack":
      return [ing("Flour"), ing("Sugar"), ing("Vegetable Oil"), ing("Salt")];
    case "Side":
      return [ing("Plantain"), ing("Vegetable Oil"), ing("Salt")];
    case "Dessert":
      return [ing("Flour"), ing("Sugar"), ing("Butter"), ing("Milk")];
    default:
      return [
        ing("Rice"), ing("Tomatoes"), ing("Pepper"), ing("Onions"),
        ing("Vegetable Oil"), ing("Seasoning Cubes"), ing("Salt"),
      ];
  }
}
