import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import type {
  AppState, Tab, UserProfile, Workout, WorkoutExercise, WorkoutSet,
  FoodEntry, WeightEntry, ActiveWorkout, PersonalRecord, Exercise,
} from '../types';
import { DEFAULT_EXERCISES, DEFAULT_TEMPLATES } from '../data/exercises';

// ─── Default State ─────────────────────────────────────────────────────────────

const DEFAULT_USER: UserProfile = {
  name: 'Athlete',
  goal: 'gain_muscle',
  activityLevel: 'moderate',
  weightUnit: 'kg',
  calorieGoal: 2400,
  proteinGoal: 180,
  carbsGoal: 280,
  fatGoal: 70,
  isPremium: false,
  streakDays: 0,
  joinDate: new Date().toISOString(),
};

const STORAGE_KEY = 'fittrack_v2';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: Partial<AppState>) {
  try {
    // Don't persist activeTab and activeWorkout timer details
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      workouts: state.workouts,
      exercises: state.exercises,
      workoutTemplates: state.workoutTemplates,
      personalRecords: state.personalRecords,
      foodEntries: state.foodEntries,
      weightEntries: state.weightEntries,
      bodyMeasurements: state.bodyMeasurements,
      activeWorkout: state.activeWorkout,
    }));
  } catch (e) {
    console.warn('Failed to save state', e);
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState;
  setActiveTab: (tab: Tab) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  // Workouts
  startWorkout: (name: string, templateId?: string) => void;
  cancelWorkout: () => void;
  finishWorkout: () => void;
  addExerciseToWorkout: (exerciseId: string) => void;
  removeExerciseFromWorkout: (workoutExerciseId: string) => void;
  addSet: (workoutExerciseId: string) => void;
  removeSet: (workoutExerciseId: string, setId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  // Food
  addFoodEntry: (entry: FoodEntry) => void;
  removeFoodEntry: (entryId: string) => void;
  // Weight
  addWeightEntry: (entry: WeightEntry) => void;
  removeWeightEntry: (entryId: string) => void;
  // Premium
  activatePremium: () => void;
  // Exercises
  addCustomExercise: (exercise: Exercise) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const saved = loadState();

  const [state, setState] = useState<AppState>({
    user: { ...DEFAULT_USER, ...saved.user },
    workouts: saved.workouts ?? [],
    exercises: saved.exercises ?? DEFAULT_EXERCISES,
    workoutTemplates: saved.workoutTemplates ?? DEFAULT_TEMPLATES,
    personalRecords: saved.personalRecords ?? [],
    foodEntries: saved.foodEntries ?? [],
    weightEntries: saved.weightEntries ?? [],
    bodyMeasurements: saved.bodyMeasurements ?? [],
    activeWorkout: saved.activeWorkout ?? null,
    activeTab: 'dashboard',
  });

  // Auto-save on state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const last = state.user.lastActiveDate;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = last === yesterday ? state.user.streakDays + 1 : 1;
      setState(s => ({
        ...s,
        user: { ...s.user, lastActiveDate: today, streakDays: newStreak },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActiveTab = useCallback((tab: Tab) => {
    setState(s => ({ ...s, activeTab: tab }));
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setState(s => ({ ...s, user: { ...s.user, ...updates } }));
  }, []);

  const startWorkout = useCallback((name: string, templateId?: string) => {
    const template = templateId
      ? state.workoutTemplates.find(t => t.id === templateId)
      : undefined;

    const exercises: WorkoutExercise[] = template
      ? template.exercises.map(te => ({
          id: crypto.randomUUID(),
          exerciseId: te.exerciseId,
          sets: Array.from({ length: te.defaultSets }, () => ({
            id: crypto.randomUUID(),
            weight: te.defaultWeight,
            reps: te.defaultReps,
            completed: false,
          })),
        }))
      : [];

    const activeWorkout: ActiveWorkout = {
      id: crypto.randomUUID(),
      name,
      startTime: Date.now(),
      exercises,
      templateId,
    };
    setState(s => ({ ...s, activeWorkout }));
  }, [state.workoutTemplates]);

  const cancelWorkout = useCallback(() => {
    setState(s => ({ ...s, activeWorkout: null }));
  }, []);

  const finishWorkout = useCallback(() => {
    setState(s => {
      if (!s.activeWorkout) return s;
      const aw = s.activeWorkout;
      const duration = Math.round((Date.now() - aw.startTime) / 60000);

      // Calculate total volume
      let totalVolume = 0;
      aw.exercises.forEach(ex => {
        ex.sets.filter(set => set.completed).forEach(set => {
          totalVolume += set.weight * set.reps;
        });
      });

      const workout: Workout = {
        id: aw.id,
        name: aw.name,
        date: new Date().toISOString(),
        duration,
        exercises: aw.exercises,
        totalVolume,
      };

      // Update personal records
      const newPRs = [...s.personalRecords];
      aw.exercises.forEach(ex => {
        ex.sets.filter(set => set.completed).forEach(set => {
          const existing = newPRs.find(pr => pr.exerciseId === ex.exerciseId);
          const oneRepMax = set.weight * (1 + set.reps / 30);
          const existingORM = existing ? existing.weight * (1 + existing.reps / 30) : 0;
          if (oneRepMax > existingORM) {
            const idx = newPRs.findIndex(pr => pr.exerciseId === ex.exerciseId);
            const pr: PersonalRecord = {
              exerciseId: ex.exerciseId,
              weight: set.weight,
              reps: set.reps,
              date: new Date().toISOString(),
              workoutId: aw.id,
            };
            if (idx >= 0) newPRs[idx] = pr;
            else newPRs.push(pr);
          }
        });
      });

      return {
        ...s,
        workouts: [workout, ...s.workouts],
        personalRecords: newPRs,
        activeWorkout: null,
      };
    });
  }, []);

  const addExerciseToWorkout = useCallback((exerciseId: string) => {
    setState(s => {
      if (!s.activeWorkout) return s;
      const newEx: WorkoutExercise = {
        id: crypto.randomUUID(),
        exerciseId,
        sets: [{ id: crypto.randomUUID(), weight: 0, reps: 0, completed: false }],
      };
      return {
        ...s,
        activeWorkout: {
          ...s.activeWorkout,
          exercises: [...s.activeWorkout.exercises, newEx],
        },
      };
    });
  }, []);

  const removeExerciseFromWorkout = useCallback((workoutExerciseId: string) => {
    setState(s => {
      if (!s.activeWorkout) return s;
      return {
        ...s,
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.filter(e => e.id !== workoutExerciseId),
        },
      };
    });
  }, []);

  const addSet = useCallback((workoutExerciseId: string) => {
    setState(s => {
      if (!s.activeWorkout) return s;
      return {
        ...s,
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map(ex => {
            if (ex.id !== workoutExerciseId) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            const newSet: WorkoutSet = {
              id: crypto.randomUUID(),
              weight: lastSet?.weight ?? 0,
              reps: lastSet?.reps ?? 0,
              completed: false,
            };
            return { ...ex, sets: [...ex.sets, newSet] };
          }),
        },
      };
    });
  }, []);

  const removeSet = useCallback((workoutExerciseId: string, setId: string) => {
    setState(s => {
      if (!s.activeWorkout) return s;
      return {
        ...s,
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map(ex => {
            if (ex.id !== workoutExerciseId) return ex;
            return { ...ex, sets: ex.sets.filter(set => set.id !== setId) };
          }),
        },
      };
    });
  }, []);

  const updateSet = useCallback((workoutExerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setState(s => {
      if (!s.activeWorkout) return s;
      return {
        ...s,
        activeWorkout: {
          ...s.activeWorkout,
          exercises: s.activeWorkout.exercises.map(ex => {
            if (ex.id !== workoutExerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map(set => set.id === setId ? { ...set, ...updates } : set),
            };
          }),
        },
      };
    });
  }, []);

  const addFoodEntry = useCallback((entry: FoodEntry) => {
    setState(s => ({ ...s, foodEntries: [...s.foodEntries, entry] }));
  }, []);

  const removeFoodEntry = useCallback((entryId: string) => {
    setState(s => ({ ...s, foodEntries: s.foodEntries.filter(e => e.id !== entryId) }));
  }, []);

  const addWeightEntry = useCallback((entry: WeightEntry) => {
    setState(s => ({
      ...s,
      weightEntries: [entry, ...s.weightEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
  }, []);

  const removeWeightEntry = useCallback((entryId: string) => {
    setState(s => ({ ...s, weightEntries: s.weightEntries.filter(e => e.id !== entryId) }));
  }, []);

  const activatePremium = useCallback(() => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setState(s => ({
      ...s,
      user: { ...s.user, isPremium: true, premiumExpiresAt: expires },
    }));
  }, []);

  const addCustomExercise = useCallback((exercise: Exercise) => {
    setState(s => ({ ...s, exercises: [...s.exercises, exercise] }));
  }, []);

  const value: StoreContextValue = {
    state,
    setActiveTab,
    updateUser,
    startWorkout,
    cancelWorkout,
    finishWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSet,
    removeSet,
    updateSet,
    addFoodEntry,
    removeFoodEntry,
    addWeightEntry,
    removeWeightEntry,
    activatePremium,
    addCustomExercise,
  };

  return createElement(StoreContext.Provider, { value }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside AppStoreProvider');
  return ctx;
}
