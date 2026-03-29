import type { FoodItem } from '../types';

export const DEFAULT_FOODS: FoodItem[] = [
  // PROTEIN SOURCES
  { id: 'chicken-breast', name: 'Chicken Breast', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  { id: 'ground-beef-lean', name: 'Ground Beef (95% Lean)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 152, protein: 22, carbs: 0, fat: 7 } },
  { id: 'salmon', name: 'Salmon (Atlantic)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13 } },
  { id: 'tuna-canned', name: 'Tuna (Canned in Water)', brand: 'Generic', servingSize: 85, servingUnit: 'g', nutrition: { calories: 90, protein: 20, carbs: 0, fat: 1 } },
  { id: 'eggs-whole', name: 'Egg (Whole)', brand: 'Generic', servingSize: 50, servingUnit: 'piece', nutrition: { calories: 72, protein: 6, carbs: 0.4, fat: 5 } },
  { id: 'egg-whites', name: 'Egg Whites', brand: 'Generic', servingSize: 30, servingUnit: 'g', nutrition: { calories: 17, protein: 3.6, carbs: 0.2, fat: 0 } },
  { id: 'greek-yogurt', name: 'Greek Yogurt (0% Fat)', brand: 'Generic', servingSize: 170, servingUnit: 'g', nutrition: { calories: 100, protein: 17, carbs: 6, fat: 0 } },
  { id: 'cottage-cheese', name: 'Cottage Cheese (Low Fat)', brand: 'Generic', servingSize: 113, servingUnit: 'g', nutrition: { calories: 90, protein: 12, carbs: 5, fat: 2.5 } },
  { id: 'turkey-breast', name: 'Turkey Breast', brand: 'Generic', servingSize: 85, servingUnit: 'g', nutrition: { calories: 120, protein: 26, carbs: 0, fat: 1 } },
  { id: 'protein-powder-whey', name: 'Whey Protein Powder', brand: 'Generic', servingSize: 30, servingUnit: 'g', nutrition: { calories: 120, protein: 24, carbs: 3, fat: 2 } },

  // CARBOHYDRATES
  { id: 'rice-white', name: 'White Rice (Cooked)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 } },
  { id: 'rice-brown', name: 'Brown Rice (Cooked)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8 } },
  { id: 'oats', name: 'Oatmeal (Rolled Oats)', brand: 'Generic', servingSize: 40, servingUnit: 'g', nutrition: { calories: 152, protein: 5.3, carbs: 27, fat: 2.6, fiber: 4 } },
  { id: 'pasta', name: 'Pasta (Cooked)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 131, protein: 5, carbs: 25, fat: 1.1 } },
  { id: 'bread-whole-wheat', name: 'Whole Wheat Bread', brand: 'Generic', servingSize: 28, servingUnit: 'slice', nutrition: { calories: 69, protein: 3.6, carbs: 12, fat: 1.1, fiber: 1.9 } },
  { id: 'sweet-potato', name: 'Sweet Potato', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 } },
  { id: 'banana', name: 'Banana', brand: 'Generic', servingSize: 118, servingUnit: 'piece', nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 } },
  { id: 'apple', name: 'Apple', brand: 'Generic', servingSize: 182, servingUnit: 'piece', nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 } },
  { id: 'quinoa', name: 'Quinoa (Cooked)', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8 } },

  // FATS
  { id: 'avocado', name: 'Avocado', brand: 'Generic', servingSize: 50, servingUnit: 'g', nutrition: { calories: 80, protein: 1, carbs: 4.3, fat: 7.3, fiber: 3.4 } },
  { id: 'olive-oil', name: 'Olive Oil', brand: 'Generic', servingSize: 14, servingUnit: 'tbsp', nutrition: { calories: 120, protein: 0, carbs: 0, fat: 14 } },
  { id: 'almond-butter', name: 'Almond Butter', brand: 'Generic', servingSize: 32, servingUnit: 'tbsp', nutrition: { calories: 196, protein: 7, carbs: 6, fat: 18 } },
  { id: 'almonds', name: 'Almonds', brand: 'Generic', servingSize: 28, servingUnit: 'g', nutrition: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 } },
  { id: 'walnuts', name: 'Walnuts', brand: 'Generic', servingSize: 28, servingUnit: 'g', nutrition: { calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5 } },

  // DAIRY
  { id: 'milk-whole', name: 'Whole Milk', brand: 'Generic', servingSize: 240, servingUnit: 'ml', nutrition: { calories: 149, protein: 8, carbs: 12, fat: 8 } },
  { id: 'milk-skim', name: 'Skim Milk', brand: 'Generic', servingSize: 240, servingUnit: 'ml', nutrition: { calories: 83, protein: 8, carbs: 12, fat: 0.2 } },
  { id: 'cheddar-cheese', name: 'Cheddar Cheese', brand: 'Generic', servingSize: 28, servingUnit: 'g', nutrition: { calories: 113, protein: 7, carbs: 0.4, fat: 9.3 } },
  { id: 'mozzarella', name: 'Mozzarella (Low Fat)', brand: 'Generic', servingSize: 28, servingUnit: 'g', nutrition: { calories: 72, protein: 6.9, carbs: 1, fat: 4.5 } },

  // VEGETABLES
  { id: 'broccoli', name: 'Broccoli', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 } },
  { id: 'spinach', name: 'Spinach', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 } },
  { id: 'kale', name: 'Kale', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 35, protein: 2.9, carbs: 4.4, fat: 0.7, fiber: 4.1 } },
  { id: 'cucumber', name: 'Cucumber', brand: 'Generic', servingSize: 100, servingUnit: 'g', nutrition: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 } },

  // FAST FOOD / COMMON
  { id: 'big-mac', name: 'Big Mac', brand: "McDonald's", servingSize: 211, servingUnit: 'piece', nutrition: { calories: 550, protein: 25, carbs: 45, fat: 30 } },
  { id: 'pizza-slice', name: 'Pizza Slice (Pepperoni)', brand: 'Generic', servingSize: 107, servingUnit: 'slice', nutrition: { calories: 298, protein: 12, carbs: 34, fat: 13 } },
  { id: 'protein-bar', name: 'Protein Bar', brand: 'Generic', servingSize: 60, servingUnit: 'piece', nutrition: { calories: 220, protein: 20, carbs: 22, fat: 7 } },
];

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};
