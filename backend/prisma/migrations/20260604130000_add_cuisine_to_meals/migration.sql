-- Add cuisine column to meals table for preference-based filtering
ALTER TABLE meals ADD COLUMN IF NOT EXISTS cuisine TEXT;

-- Update Nigerian meals (first 70 seeded meals)
UPDATE meals SET cuisine = 'Nigerian' WHERE cuisine IS NULL AND name IN (
  'Jollof Rice', 'Egusi Soup', 'Pounded Yam', 'Suya', 'Fried Plantain (Dodo)',
  'Ogbono Soup', 'Efo Riro', 'Fried Rice', 'Akara', 'Moi Moi',
  'Pepper Soup', 'Banga Soup', 'Tuwo Shinkafa', 'Amala', 'Ewa Agoyin',
  'Asun', 'Okra Soup', 'Ofada Rice', 'Meat Pie', 'Puff Puff',
  'Yam Porridge', 'Chin Chin', 'Boli', 'Fish Stew', 'Chicken Stew',
  'Beef Stew', 'Vegetable Soup', 'Edikang Ikong', 'Afang Soup', 'Bitterleaf Soup',
  'Oha Soup', 'Groundnut Soup', 'Peppered Snails', 'Scotch Egg', 'Egg Roll',
  'Fried Yam', 'Roasted Corn', 'Boiled Corn', 'Plantain Chips', 'Egg Sauce',
  'Bread and Fried Egg', 'Semovita', 'Wheat Flour Swallow', 'Garri', 'Fufu',
  'Eba', 'Coconut Rice', 'Beans and Plantain', 'Porridge Beans', 'Spaghetti Jollof',
  'Indomie', 'Yam and Egg Sauce', 'Akara and Bread', 'Tea and Bread', 'Custard and Akara',
  'Pap (Ogi)', 'Fried Titus Fish', 'Grilled Catfish', 'Cowleg Pepper Soup', 'Goat Meat Pepper Soup',
  'Chicken Pepper Soup', 'Nkwobi', 'Isi Ewu', 'Abacha', 'Ugba',
  'Okpa', 'Tuwo Masara', 'Miyan Kuka', 'Miyan Tuwo', 'Kilishi'
);

-- Update International meals
UPDATE meals SET cuisine = 'International' WHERE cuisine IS NULL;
