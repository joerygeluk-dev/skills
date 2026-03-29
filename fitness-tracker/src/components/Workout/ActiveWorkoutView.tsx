import { useState, useEffect } from 'react';
import { Plus, Check, X, Search, Timer, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { MUSCLE_GROUP_COLORS } from '../../data/exercises';
import type { MuscleGroup } from '../../types';

interface ActiveWorkoutViewProps {
  onClose: () => void;
}

export function ActiveWorkoutView({ onClose }: ActiveWorkoutViewProps) {
  const {
    state,
    cancelWorkout,
    finishWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSet,
    removeSet,
    updateSet,
  } = useStore();

  const { activeWorkout, exercises } = state;
  const [elapsed, setElapsed] = useState(0);
  const [restCountdown, setRestCountdown] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | 'all'>('all');
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Workout timer
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Rest timer countdown
  useEffect(() => {
    if (restCountdown <= 0) return;
    const t = setTimeout(() => setRestCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [restCountdown]);

  if (!activeWorkout) return null;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const completedSets = activeWorkout.exercises.reduce(
    (s, ex) => s + ex.sets.filter(set => set.completed).length, 0
  );
  const totalSets = activeWorkout.exercises.reduce((s, ex) => s + ex.sets.length, 0);

  const filteredExercises = exercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchGroup = filterGroup === 'all' || ex.muscleGroup === filterGroup;
    return matchSearch && matchGroup;
  });

  const muscleGroups: (MuscleGroup | 'all')[] = [
    'all', 'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'core', 'quads', 'hamstrings', 'glutes', 'calves', 'cardio',
  ];

  function handleSetComplete(workoutExId: string, setId: string, completed: boolean) {
    updateSet(workoutExId, setId, { completed });
    if (completed) {
      setRestCountdown(90); // 90 second rest timer
    }
  }

  function handleFinish() {
    finishWorkout();
    onClose();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Workout Header */}
      <div style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
              {activeWorkout.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Timer size={13} /> {formatTime(elapsed)}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {completedSets}/{totalSets} sets
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowFinishConfirm(true)}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: 13 }}
            >
              Finish
            </button>
            <button
              onClick={() => {
                if (confirm('Cancel workout? All progress will be lost.')) {
                  cancelWorkout();
                  onClose();
                }
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              <X size={18} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ height: 6 }}>
          <div
            className="progress-fill"
            style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%`, background: '#22c55e' }}
          />
        </div>
      </div>

      {/* Rest Timer */}
      {restCountdown > 0 && (
        <div style={{
          background: '#052e16',
          borderBottom: '1px solid #166534',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Timer size={14} color="#4ade80" />
            <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
              Rest: {formatTime(restCountdown)}
            </span>
          </div>
          <button
            onClick={() => setRestCountdown(0)}
            style={{ background: 'none', border: '1px solid #166534', borderRadius: 6, padding: '3px 10px', color: '#4ade80', fontSize: 12, cursor: 'pointer' }}
          >
            Skip
          </button>
        </div>
      )}

      {/* Exercise List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 100px' }}>
        {activeWorkout.exercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Plus size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Add exercises to get started</p>
          </div>
        )}

        {activeWorkout.exercises.map((we) => {
          const exercise = exercises.find(e => e.id === we.exerciseId);
          const isExpanded = expandedExercise === we.id || expandedExercise === null;
          const completedSetCount = we.sets.filter(s => s.completed).length;

          return (
            <div key={we.id} className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
              {/* Exercise header */}
              <div
                style={{
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedExercise(isExpanded && expandedExercise === we.id ? null : we.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${MUSCLE_GROUP_COLORS[exercise?.muscleGroup ?? 'chest']}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14 }}>💪</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                      {exercise?.name ?? we.exerciseId}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>
                      {exercise?.muscleGroup} • {completedSetCount}/{we.sets.length} sets done
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {completedSetCount === we.sets.length && we.sets.length > 0 && (
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} color="#4ade80" />
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExerciseFromWorkout(we.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Sets */}
              <div style={{ padding: '0 14px 12px' }}>
                {/* Set header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 1fr 44px',
                  gap: 8, paddingBottom: 6,
                  borderBottom: '1px solid #0f172a',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>SET</span>
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, textAlign: 'center' }}>
                    {exercise?.muscleGroup === 'cardio' ? 'MIN' : 'KG'}
                  </span>
                  <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, textAlign: 'center' }}>
                    {exercise?.muscleGroup === 'cardio' ? 'DIST' : 'REPS'}
                  </span>
                  <span />
                </div>

                {we.sets.map((set, setIdx) => (
                  <div key={set.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr 1fr 44px',
                    gap: 8, alignItems: 'center',
                    padding: '5px 0',
                    background: set.completed ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                    borderRadius: 6,
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: set.completed ? '#166534' : '#334155',
                      fontSize: 11, fontWeight: 700,
                      color: set.completed ? '#4ade80' : '#94a3b8',
                      flexShrink: 0,
                    }}>
                      {setIdx + 1}
                    </div>
                    <input
                      type="number"
                      className="input-field"
                      value={set.weight || ''}
                      onChange={e => updateSet(we.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      step="2.5"
                      style={{ textAlign: 'center', padding: '7px 8px' }}
                    />
                    <input
                      type="number"
                      className="input-field"
                      value={set.reps || ''}
                      onChange={e => updateSet(we.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      style={{ textAlign: 'center', padding: '7px 8px' }}
                    />
                    <button
                      onClick={() => handleSetComplete(we.id, set.id, !set.completed)}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: 'none',
                        background: set.completed ? '#166534' : '#334155',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={14} color={set.completed ? '#4ade80' : '#64748b'} />
                    </button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => addSet(we.id)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                  >
                    <Plus size={14} /> Add Set
                  </button>
                  {we.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(we.id, we.sets[we.sets.length - 1].id)}
                      className="btn-danger"
                      style={{ padding: '8px 12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Exercise */}
        <button
          onClick={() => setShowExercisePicker(true)}
          className="btn-secondary"
          style={{ width: '100%', marginTop: 4 }}
        >
          <Plus size={16} />
          Add Exercise
        </button>
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="modal-overlay" onClick={() => setShowExercisePicker(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="swipe-handle" />
            <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
              Add Exercise
            </h3>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
                autoFocus
              />
            </div>

            {/* Filter by muscle group */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
              {muscleGroups.map(mg => (
                <button
                  key={mg}
                  onClick={() => setFilterGroup(mg)}
                  style={{
                    flexShrink: 0,
                    padding: '5px 12px', borderRadius: 20,
                    border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: filterGroup === mg ? '#22c55e' : '#334155',
                    color: filterGroup === mg ? 'white' : '#94a3b8',
                    transition: 'all 0.2s',
                  }}
                >
                  {mg === 'all' ? 'All' : mg}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div style={{ maxHeight: '55vh', overflow: 'auto' }}>
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    addExerciseToWorkout(ex.id);
                    setShowExercisePicker(false);
                    setExerciseSearch('');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 4px', cursor: 'pointer',
                    borderBottom: '1px solid #334155',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: `${MUSCLE_GROUP_COLORS[ex.muscleGroup]}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 16 }}>
                      {ex.equipment === 'bodyweight' ? '🤸' :
                       ex.equipment === 'dumbbell' ? '🏋️' :
                       ex.equipment === 'barbell' ? '🏋' :
                       ex.muscleGroup === 'cardio' ? '🏃' : '⚙️'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{ex.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>
                      <span style={{ color: MUSCLE_GROUP_COLORS[ex.muscleGroup] }}>{ex.muscleGroup}</span>
                      {' '}• {ex.equipment}
                    </p>
                  </div>
                  <Plus size={16} color="#22c55e" />
                </div>
              ))}
              {filteredExercises.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>No exercises found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finish Confirm Modal */}
      {showFinishConfirm && (
        <div className="modal-overlay">
          <div className="modal-content-center">
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#f1f5f9', textAlign: 'center' }}>
              Finish Workout?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#94a3b8', textAlign: 'center' }}>
              {formatTime(elapsed)} elapsed • {completedSets}/{totalSets} sets completed
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-primary" onClick={handleFinish} style={{ width: '100%' }}>
                <Check size={16} />
                Save Workout
              </button>
              <button className="btn-secondary" onClick={() => setShowFinishConfirm(false)} style={{ width: '100%' }}>
                Continue Workout
              </button>
              <button
                onClick={() => { cancelWorkout(); onClose(); }}
                style={{
                  background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer',
                  fontSize: 14, padding: '8px', fontWeight: 600,
                }}
              >
                Discard Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
