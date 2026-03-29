import { Dumbbell, Flame, Target, Trophy, ChevronRight, Zap, Plus } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { MacroRing } from '../shared/MacroRing';
import { MiniChart } from '../shared/MiniChart';

export function Dashboard() {
  const { state, setActiveTab } = useStore();
  const { user, workouts, foodEntries, weightEntries, personalRecords, exercises, activeWorkout } = state;

  const todayStr = new Date().toISOString().split('T')[0];

  // Today's nutrition
  const todayEntries = foodEntries.filter(e => e.date === todayStr);
  const todayNutrition = todayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.nutrition.calories,
      protein: acc.protein + e.nutrition.protein,
      carbs: acc.carbs + e.nutrition.carbs,
      fat: acc.fat + e.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // This week's workouts
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const weekWorkouts = workouts.filter(w => w.date >= weekAgo);

  // Recent weight entries
  const recentWeights = weightEntries.slice(0, 14).reverse();

  // Last workout
  const lastWorkout = workouts[0];

  // Recent PRs (last 7 days)
  const recentPRs = personalRecords.filter(pr => {
    const weekAgoStr = new Date(Date.now() - 7 * 86400000).toISOString();
    return pr.date >= weekAgoStr;
  }).slice(0, 3);

  const calorieRemaining = Math.max(0, user.calorieGoal - todayNutrition.calories);

  return (
    <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Active Workout Banner */}
      {activeWorkout && (
        <div
          className="card animate-slide-up"
          onClick={() => setActiveTab('workout')}
          style={{
            background: 'linear-gradient(135deg, #166534, #15803d)',
            border: '1px solid #22c55e44',
            padding: '14px 16px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#4ade80', animation: 'pulse 2s infinite',
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Workout in progress
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#86efac', marginTop: 2 }}>
              {activeWorkout.name} • Tap to continue
            </p>
          </div>
          <ChevronRight size={18} color="#4ade80" />
        </div>
      )}

      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
            Hey, {user.name.split(' ')[0]} 👋
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', marginTop: 2 }}>
            {weekWorkouts.length} workout{weekWorkouts.length !== 1 ? 's' : ''} this week
          </p>
        </div>
        {user.streakDays >= 3 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: '#431407', borderRadius: 12, padding: '8px 12px',
          }}>
            <Flame size={20} color="#f97316" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>{user.streakDays}</span>
            <span style={{ fontSize: 10, color: '#c2410c' }}>streak</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!activeWorkout && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn-primary" onClick={() => setActiveTab('workout')} style={{ padding: '14px 16px', borderRadius: 14 }}>
            <Dumbbell size={18} />
            <span>Log Workout</span>
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('nutrition')} style={{ padding: '14px 16px', borderRadius: 14 }}>
            <Plus size={18} />
            <span>Log Food</span>
          </button>
        </div>
      )}

      {/* Today's Calories */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Today's Nutrition
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {Math.round(calorieRemaining)} kcal remaining
            </p>
          </div>
          <button
            onClick={() => setActiveTab('nutrition')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            View <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <MacroRing
            calories={todayNutrition.calories}
            calorieGoal={user.calorieGoal}
            protein={todayNutrition.protein}
            proteinGoal={user.proteinGoal}
            carbs={todayNutrition.carbs}
            carbsGoal={user.carbsGoal}
            fat={todayNutrition.fat}
            fatGoal={user.fatGoal}
            size={130}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Protein', val: todayNutrition.protein, goal: user.proteinGoal, color: '#60a5fa' },
              { label: 'Carbs', val: todayNutrition.carbs, goal: user.carbsGoal, color: '#34d399' },
              { label: 'Fat', val: todayNutrition.fat, goal: user.fatGoal, color: '#fb923c' },
            ].map(({ label, val, goal, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color }}>
                    {Math.round(val)}g
                    <span style={{ color: '#475569', fontWeight: 400 }}> / {goal}g</span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(val / (goal || 1) * 100, 100)}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { icon: <Dumbbell size={16} color="#60a5fa" />, label: 'Workouts', value: weekWorkouts.length.toString(), sub: 'this week', bg: '#172554' },
          { icon: <Target size={16} color="#34d399" />, label: 'Calories', value: Math.round(todayNutrition.calories).toString(), sub: 'today', bg: '#052e16' },
          { icon: <Trophy size={16} color="#fbbf24" />, label: 'PRs', value: personalRecords.length.toString(), sub: 'all time', bg: '#451a03' },
        ].map(({ icon, label, value, sub, bg }) => (
          <div key={label} className="card" style={{ padding: '12px 10px', textAlign: 'center', background: bg, border: `1px solid ${bg}` }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Weight Chart */}
      {recentWeights.length >= 2 && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Body Weight
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {weightEntries[0]?.weight} {user.weightUnit}
                {recentWeights.length >= 2 && (
                  <span style={{ color: recentWeights[recentWeights.length - 1].weight > recentWeights[0].weight ? '#f87171' : '#4ade80', marginLeft: 6 }}>
                    {(recentWeights[recentWeights.length - 1].weight - recentWeights[0].weight) > 0 ? '+' : ''}
                    {(recentWeights[recentWeights.length - 1].weight - recentWeights[0].weight).toFixed(1)} kg
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View <ChevronRight size={14} />
            </button>
          </div>
          <MiniChart
            data={recentWeights.map(e => ({ date: e.date, value: e.weight }))}
            color="#22c55e"
            height={70}
          />
        </div>
      )}

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Trophy size={16} color="#fbbf24" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              New Personal Records
            </h3>
          </div>
          {recentPRs.map(pr => {
            const ex = exercises.find(e => e.id === pr.exerciseId);
            return (
              <div key={pr.exerciseId} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #1e293b',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: '#451a03', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trophy size={14} color="#fbbf24" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{ex?.name ?? pr.exerciseId}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                      {new Date(pr.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>
                    {pr.weight > 0 ? `${pr.weight}kg` : 'BW'}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{pr.reps} reps</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Last Workout Summary */}
      {lastWorkout && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="#a78bfa" />
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Last Workout
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('workout')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              History <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #4c1d95, #2e1065)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Dumbbell size={20} color="#a78bfa" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{lastWorkout.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {lastWorkout.duration} min •{' '}
                {lastWorkout.exercises.length} exercises •{' '}
                {Math.round((lastWorkout.totalVolume ?? 0) / 1000)}k kg volume
              </p>
            </div>
            <span style={{ fontSize: 11, color: '#475569' }}>
              {new Date(lastWorkout.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {workouts.length === 0 && foodEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💪</div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
            Welcome to FitTrack!
          </h3>
          <p style={{ margin: '8px 0 20px', fontSize: 14, color: '#64748b' }}>
            Start logging your workouts and meals to track your progress.
          </p>
          <button className="btn-primary" onClick={() => setActiveTab('workout')} style={{ margin: '0 auto' }}>
            <Dumbbell size={16} />
            Log Your First Workout
          </button>
        </div>
      )}
    </div>
  );
}
