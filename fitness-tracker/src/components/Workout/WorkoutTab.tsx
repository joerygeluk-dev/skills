import { useState } from 'react';
import { Plus, Play, Dumbbell, Zap, LayoutGrid, History } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { ActiveWorkoutView } from './ActiveWorkoutView';
import { MUSCLE_GROUP_COLORS } from '../../data/exercises';

type View = 'home' | 'history' | 'active';

export function WorkoutTab() {
  const { state, startWorkout } = useStore();
  const { workouts, workoutTemplates, exercises, activeWorkout, user } = state;
  const [view, setView] = useState<View>(activeWorkout ? 'active' : 'home');
  const [tab, setTab] = useState<'templates' | 'history'>('templates');

  if (activeWorkout || view === 'active') {
    return <ActiveWorkoutView onClose={() => setView('home')} />;
  }

  const recentWorkouts = workouts.slice(0, 10);

  function handleStartEmpty() {
    const name = `Workout ${new Date().toLocaleDateString('nl-NL', { weekday: 'long' })}`;
    startWorkout(name);
    setView('active');
  }

  function handleStartTemplate(templateId: string) {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (template) {
      startWorkout(template.name, templateId);
      setView('active');
    }
  }

  return (
    <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Start Workout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          className="btn-primary"
          onClick={handleStartEmpty}
          style={{ padding: '16px', borderRadius: 16, flexDirection: 'column', gap: 6, height: 80 }}
        >
          <Play size={22} fill="white" />
          <span>Empty Workout</span>
        </button>
        <button
          className="btn-secondary"
          onClick={() => setTab('templates')}
          style={{ padding: '16px', borderRadius: 16, flexDirection: 'column', gap: 6, height: 80, background: '#1e293b' }}
        >
          <LayoutGrid size={22} color="#a78bfa" />
          <span>From Template</span>
        </button>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <button className={`tab-item ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>
          Templates
        </button>
        <button className={`tab-item ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          History ({workouts.length})
        </button>
      </div>

      {/* Templates */}
      {tab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {workoutTemplates.map(template => {
            const muscleGroups = [...new Set(
              template.exercises
                .map(te => exercises.find(e => e.id === te.exerciseId)?.muscleGroup)
                .filter(Boolean)
            )];

            return (
              <div
                key={template.id}
                className="card"
                style={{ padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => handleStartTemplate(template.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{template.name}</h3>
                    {template.description && (
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>{template.description}</p>
                    )}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Play size={14} fill="white" color="white" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {muscleGroups.slice(0, 4).map(mg => (
                    <span key={mg} style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 8px', borderRadius: 6,
                      background: `${MUSCLE_GROUP_COLORS[mg as string]}22`,
                      color: MUSCLE_GROUP_COLORS[mg as string],
                    }}>
                      {mg}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>
                    {template.exercises.length} exercises
                  </span>
                </div>
              </div>
            );
          })}

          {user.isPremium && (
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              Create Template
            </button>
          )}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentWorkouts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <History size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <p>No workouts logged yet.</p>
            </div>
          )}
          {recentWorkouts.map(workout => {
            return (
              <div key={workout.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: '#1e293b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Dumbbell size={18} color="#60a5fa" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{workout.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {new Date(workout.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{workout.duration}</p>
                        <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>min</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{workout.exercises.length}</p>
                        <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>ex.</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                          {((workout.totalVolume ?? 0) / 1000).toFixed(1)}k
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>kg vol.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Exercise tags */}
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {workout.exercises.slice(0, 4).map(we => {
                    const ex = exercises.find(e => e.id === we.exerciseId);
                    return ex ? (
                      <span key={we.id} style={{
                        fontSize: 11, color: '#94a3b8',
                        background: '#0f172a', padding: '2px 8px',
                        borderRadius: 6, border: '1px solid #1e293b',
                      }}>
                        {ex.name}
                      </span>
                    ) : null;
                  })}
                  {workout.exercises.length > 4 && (
                    <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>
                      +{workout.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {workouts.length > 10 && !user.isPremium && (
            <div style={{
              background: '#1e293b', borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12,
              border: '1px solid #334155',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                  Full history with Premium
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  Free plan shows last 10 workouts
                </p>
              </div>
              <Zap size={16} color="#a78bfa" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
