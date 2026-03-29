import type { Exercise } from '../types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', description: 'Classic compound chest exercise' },
  { id: 'incline-bench', name: 'Incline Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'decline-bench', name: 'Decline Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'db-bench', name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'db-flyes', name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'cable-flyes', name: 'Cable Flyes', muscleGroup: 'chest', equipment: 'cable' },
  { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'chest', equipment: 'machine' },
  { id: 'pushups', name: 'Push-Ups', muscleGroup: 'chest', equipment: 'bodyweight' },
  { id: 'dips', name: 'Dips', muscleGroup: 'chest', equipment: 'bodyweight' },

  // BACK
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', description: 'The king of all exercises' },
  { id: 'pullups', name: 'Pull-Ups', muscleGroup: 'back', equipment: 'bodyweight' },
  { id: 'chinups', name: 'Chin-Ups', muscleGroup: 'back', equipment: 'bodyweight' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'db-row', name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'dumbbell' },
  { id: 'cable-row', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'cable' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable' },
  { id: 'tbar-row', name: 'T-Bar Row', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'hyperextension', name: 'Hyperextensions', muscleGroup: 'back', equipment: 'machine' },

  // SHOULDERS
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell' },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'lateral-raises', name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'front-raises', name: 'Front Raises', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-flyes', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'face-pulls', name: 'Face Pulls', muscleGroup: 'shoulders', equipment: 'cable' },
  { id: 'shrugs', name: 'Shrugs', muscleGroup: 'shoulders', equipment: 'barbell' },

  // BICEPS
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell' },
  { id: 'db-curl', name: 'Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'biceps', equipment: 'machine' },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'cable' },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },

  // TRICEPS
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscleGroup: 'triceps', equipment: 'barbell' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'triceps', equipment: 'cable' },
  { id: 'overhead-tricep', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', equipment: 'dumbbell' },
  { id: 'skull-crushers', name: 'Skull Crushers', muscleGroup: 'triceps', equipment: 'barbell' },
  { id: 'tricep-dips', name: 'Tricep Dips', muscleGroup: 'triceps', equipment: 'bodyweight' },
  { id: 'kickbacks', name: 'Tricep Kickbacks', muscleGroup: 'triceps', equipment: 'dumbbell' },

  // CORE
  { id: 'crunches', name: 'Crunches', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'plank', name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'leg-raises', name: 'Leg Raises', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'core', equipment: 'bodyweight' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'core', equipment: 'cable' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'core', equipment: 'other' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', muscleGroup: 'core', equipment: 'bodyweight' },

  // QUADS
  { id: 'squat', name: 'Squat', muscleGroup: 'quads', equipment: 'barbell', description: 'The king of leg exercises' },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'quads', equipment: 'barbell' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'quads', equipment: 'machine' },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'quads', equipment: 'machine' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'quads', equipment: 'machine' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'quads', equipment: 'dumbbell' },
  { id: 'bulgarian-split', name: 'Bulgarian Split Squat', muscleGroup: 'quads', equipment: 'dumbbell' },

  // HAMSTRINGS & GLUTES
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', equipment: 'barbell' },
  { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'hamstrings', equipment: 'machine' },
  { id: 'good-morning', name: 'Good Morning', muscleGroup: 'hamstrings', equipment: 'barbell' },
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'glutes', equipment: 'bodyweight' },
  { id: 'cable-kickback', name: 'Cable Kickback', muscleGroup: 'glutes', equipment: 'cable' },

  // CALVES
  { id: 'standing-calf', name: 'Standing Calf Raise', muscleGroup: 'calves', equipment: 'machine' },
  { id: 'seated-calf', name: 'Seated Calf Raise', muscleGroup: 'calves', equipment: 'machine' },
  { id: 'donkey-calf', name: 'Donkey Calf Raise', muscleGroup: 'calves', equipment: 'machine' },

  // CARDIO
  { id: 'treadmill', name: 'Treadmill Run', muscleGroup: 'cardio', equipment: 'cardio machine' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'cardio', equipment: 'cardio machine' },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'cardio', equipment: 'cardio machine' },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'cardio', equipment: 'cardio machine' },
  { id: 'stairmaster', name: 'StairMaster', muscleGroup: 'cardio', equipment: 'cardio machine' },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'cardio', equipment: 'other' },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'full body', equipment: 'bodyweight' },
];

export const MUSCLE_GROUP_COLORS: Record<string, string> = {
  chest: '#f87171',
  back: '#60a5fa',
  shoulders: '#a78bfa',
  biceps: '#34d399',
  triceps: '#4ade80',
  forearms: '#86efac',
  core: '#fbbf24',
  quads: '#fb923c',
  hamstrings: '#f97316',
  glutes: '#ec4899',
  calves: '#06b6d4',
  'full body': '#8b5cf6',
  cardio: '#ef4444',
};

export const DEFAULT_TEMPLATES = [
  {
    id: 'push-a',
    name: 'Push Day A',
    description: 'Chest, Shoulders & Triceps',
    exercises: [
      { exerciseId: 'bench-press', defaultSets: 4, defaultReps: 8, defaultWeight: 60 },
      { exerciseId: 'incline-bench', defaultSets: 3, defaultReps: 10, defaultWeight: 50 },
      { exerciseId: 'ohp', defaultSets: 3, defaultReps: 10, defaultWeight: 40 },
      { exerciseId: 'lateral-raises', defaultSets: 3, defaultReps: 15, defaultWeight: 10 },
      { exerciseId: 'tricep-pushdown', defaultSets: 3, defaultReps: 12, defaultWeight: 30 },
    ],
  },
  {
    id: 'pull-a',
    name: 'Pull Day A',
    description: 'Back & Biceps',
    exercises: [
      { exerciseId: 'deadlift', defaultSets: 4, defaultReps: 5, defaultWeight: 100 },
      { exerciseId: 'pullups', defaultSets: 3, defaultReps: 8, defaultWeight: 0 },
      { exerciseId: 'barbell-row', defaultSets: 3, defaultReps: 10, defaultWeight: 60 },
      { exerciseId: 'lat-pulldown', defaultSets: 3, defaultReps: 12, defaultWeight: 50 },
      { exerciseId: 'barbell-curl', defaultSets: 3, defaultReps: 12, defaultWeight: 30 },
    ],
  },
  {
    id: 'legs-a',
    name: 'Leg Day A',
    description: 'Quads, Hamstrings & Glutes',
    exercises: [
      { exerciseId: 'squat', defaultSets: 4, defaultReps: 6, defaultWeight: 80 },
      { exerciseId: 'leg-press', defaultSets: 3, defaultReps: 12, defaultWeight: 120 },
      { exerciseId: 'rdl', defaultSets: 3, defaultReps: 10, defaultWeight: 70 },
      { exerciseId: 'leg-curl', defaultSets: 3, defaultReps: 12, defaultWeight: 40 },
      { exerciseId: 'standing-calf', defaultSets: 4, defaultReps: 15, defaultWeight: 60 },
    ],
  },
  {
    id: 'upper-body',
    name: 'Upper Body',
    description: 'Full upper body workout',
    exercises: [
      { exerciseId: 'bench-press', defaultSets: 3, defaultReps: 10, defaultWeight: 60 },
      { exerciseId: 'barbell-row', defaultSets: 3, defaultReps: 10, defaultWeight: 55 },
      { exerciseId: 'ohp', defaultSets: 3, defaultReps: 10, defaultWeight: 40 },
      { exerciseId: 'lat-pulldown', defaultSets: 3, defaultReps: 12, defaultWeight: 50 },
      { exerciseId: 'db-curl', defaultSets: 3, defaultReps: 12, defaultWeight: 14 },
      { exerciseId: 'tricep-pushdown', defaultSets: 3, defaultReps: 12, defaultWeight: 25 },
    ],
  },
];
