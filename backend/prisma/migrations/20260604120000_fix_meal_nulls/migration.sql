-- Fix null values for meal fields
UPDATE meals SET price_min = 0 WHERE price_min IS NULL;
UPDATE meals SET price_max = 0 WHERE price_max IS NULL;
UPDATE meals SET dietary_tags = '' WHERE dietary_tags IS NULL;
UPDATE meals SET instructions = '' WHERE instructions IS NULL;
