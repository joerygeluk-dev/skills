// ─── Workout Types ───────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'forearms' | 'core' | 'quads' | 'hamstrings' | 'glutes'
  | 'calves' | 'full body' | 'cardio';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight'
  | 'kettlebell' | 'resistance band' | 'cardio machine' | 'other';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  isCustom?: boolean;
  description?: string;
  videoUrl?: string; // premium
  instructions?: string[]; // premium
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // premium: Rate of Perceived Exertion
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string
  duration: number; // minutes
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolume?: number; // kg * reps
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: { exerciseId: string; defaultSets: number; defaultReps: number; defaultWeight: number }[];
}

export interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
  workoutId: string;
}

// ─── Nutrition Types ──────────────────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number; // grams
  servingUnit: string; // 'g', 'ml', 'piece', etc.
  nutrition: NutritionInfo; // per serving
  barcode?: string;
  isCustom?: boolean;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  foodName: string;
  mealType: MealType;
  servings: number;
  nutrition: NutritionInfo; // calculated for servings
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:MM
}

export interface DailyNutrition {
  date: string;
  entries: FoodEntry[];
  water?: number; // ml
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  neck?: number;
  bodyFat?: number; // premium
}

// ─── User / Profile Types ─────────────────────────────────────────────────────

export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_fitness';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface UserProfile {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
  weightUnit: 'kg' | 'lbs';
  calorieGoal: number;
  proteinGoal: number; // grams
  carbsGoal: number;
  fatGoal: number;
  isPremium: boolean;
  premiumExpiresAt?: string;
  streakDays: number;
  lastActiveDate?: string;
  joinDate: string;
}

// ─── App State ────────────────────────────────────────────────────────────────

export type Tab = 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'profile';

export interface AppState {
  user: UserProfile;
  workouts: Workout[];
  exercises: Exercise[];
  workoutTemplates: WorkoutTemplate[];
  personalRecords: PersonalRecord[];
  foodEntries: FoodEntry[];
  weightEntries: WeightEntry[];
  bodyMeasurements: BodyMeasurement[];
  activeWorkout: ActiveWorkout | null;
  activeTab: Tab;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  startTime: number; // Date.now()
  exercises: WorkoutExercise[];
  templateId?: string;
}
