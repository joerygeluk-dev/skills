import { useState } from 'react';
import { Plus, Trophy, TrendingUp, Scale, X, Lock } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { MiniChart } from '../shared/MiniChart';
import { PremiumLock } from '../shared/PremiumLock';
import type { WeightEntry } from '../../types';

type ProgressView = 'weight' | 'strength' | 'body' | 'records';

export function ProgressTab() {
  const { state, addWeightEntry, removeWeightEntry, setActiveTab } = useStore();
  const { weightEntries, personalRecords, exercises, workouts, user } = state;

  const [view, setView] = useState<ProgressView>('weight');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);

  function handleAddWeight() {
    const w = parseFloat(newWeight);
    if (!w) return;
    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date: newWeightDate,
      weight: w,
      unit: user.weightUnit,
    };
    addWeightEntry(entry);
    setNewWeight('');
    setShowAddWeight(false);
  }

  const sortedWeights = [...weightEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const last30Weights = sortedWeights.slice(-30);

  const currentWeight = weightEntries[0]?.weight;
  const weightChange = weightEntries.length >= 2
    ? weightEntries[0].weight - weightEntries[weightEntries.length - 1].weight
    : 0;

  // Weekly workout volume for chart
  const last8Weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(Date.now() - (7 - i) * 7 * 86400000);
    const end = new Date(Date.now() - (6 - i) * 7 * 86400000);
    const weekWorkouts = workouts.filter(w => {
      const d = new Date(w.date);
      return d >= start && d < end;
    });
    const volume = weekWorkouts.reduce((s, w) => s + (w.totalVolume ?? 0), 0);
    return { date: start.toISOString().split('T')[0], value: volume / 1000 };
  });

  const tabs: { id: ProgressView; label: string; icon: typeof Trophy }[] = [
    { id: 'weight', label: 'Weight', icon: Scale },
    { id: 'strength', label: 'Volume', icon: TrendingUp },
    { id: 'records', label: 'PRs', icon: Trophy },
    { id: 'body', label: 'Body', icon: Scale },
  ];

  return (
    <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tabs */}
      <div className="tab-bar">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-item ${view === id ? 'active' : ''}`}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Weight Tab ── */}
      {view === 'weight' && (
        <>
          {/* Stats */}
          {weightEntries.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
                  {currentWeight?.toFixed(1) ?? '—'}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: '#64748b', marginTop: 2 }}>{user.weightUnit} now</p>
              </div>
              <div className="card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: weightChange > 0 ? '#ef4444' : '#22c55e' }}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: '#64748b', marginTop: 2 }}>total change</p>
              </div>
              <div className="card" style={{ padding: '12px 10px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
                  {weightEntries.length}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: '#64748b', marginTop: 2 }}>entries</p>
              </div>
            </div>
          )}

          {/* Chart */}
          {last30Weights.length >= 2 && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  30-Day Trend
                </h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {last30Weights[0]?.weight.toFixed(1)} → {last30Weights[last30Weights.length - 1]?.weight.toFixed(1)} {user.weightUnit}
                </span>
              </div>
              <MiniChart
                data={last30Weights.map(e => ({ date: e.date, value: e.weight }))}
                color="#22c55e"
                height={100}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#475569' }}>
                  {new Date(last30Weights[0]?.date + 'T00:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                </span>
                <span style={{ fontSize: 11, color: '#475569' }}>
                  {new Date(last30Weights[last30Weights.length - 1]?.date + 'T00:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          )}

          {/* Add Weight */}
          {!showAddWeight ? (
            <button className="btn-primary" onClick={() => setShowAddWeight(true)}>
              <Plus size={16} />
              Log Weight
            </button>
          ) : (
            <div className="card animate-slide-up" style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Log Weight</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Weight ({user.weightUnit})</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    placeholder="75.0"
                    step="0.1"
                    autoFocus
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newWeightDate}
                    onChange={e => setNewWeightDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={handleAddWeight} style={{ flex: 1 }}>Save</button>
                <button className="btn-secondary" onClick={() => setShowAddWeight(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Weight History */}
          {weightEntries.length > 0 && (
            <div className="card" style={{ padding: '14px 16px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                History
              </h3>
              {weightEntries.slice(0, 15).map((entry, idx) => {
                const prev = weightEntries[idx + 1];
                const diff = prev ? entry.weight - prev.weight : 0;
                return (
                  <div key={entry.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid #1e293b',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                        {entry.weight.toFixed(1)} {user.weightUnit}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                        {new Date(entry.date + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {prev && (
                        <span style={{ fontSize: 12, color: diff > 0 ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      )}
                      <button
                        onClick={() => removeWeightEntry(entry.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                      >
                        <X size={13} color="#475569" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {weightEntries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
              <Scale size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p>No weight entries yet. Start logging to see your trend!</p>
            </div>
          )}
        </>
      )}

      {/* ── Volume Tab ── */}
      {view === 'strength' && (
        <>
          {last8Weeks.some(w => w.value > 0) ? (
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Weekly Volume (tonnes)
              </h3>
              <MiniChart
                data={last8Weeks}
                color="#a78bfa"
                height={100}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <TrendingUp size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p>Complete workouts to see your volume trend</p>
            </div>
          )}

          {/* Workouts per muscle group */}
          {workouts.length > 0 && (() => {
            const muscleCount: Record<string, number> = {};
            workouts.slice(0, 20).forEach(w => {
              w.exercises.forEach(we => {
                const ex = exercises.find(e => e.id === we.exerciseId);
                if (ex) muscleCount[ex.muscleGroup] = (muscleCount[ex.muscleGroup] ?? 0) + 1;
              });
            });
            const sorted = Object.entries(muscleCount).sort((a, b) => b[1] - a[1]);
            const max = sorted[0]?.[1] ?? 1;

            return (
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Most Trained Muscles
                </h3>
                {sorted.slice(0, 8).map(([muscle, count]) => {
                  const COLORS: Record<string, string> = {
                    chest: '#f87171', back: '#60a5fa', shoulders: '#a78bfa',
                    biceps: '#34d399', triceps: '#4ade80', core: '#fbbf24',
                    quads: '#fb923c', hamstrings: '#f97316', glutes: '#ec4899',
                    calves: '#06b6d4', cardio: '#ef4444',
                  };
                  return (
                    <div key={muscle} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: '#94a3b8', textTransform: 'capitalize' }}>{muscle}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS[muscle] ?? '#94a3b8' }}>{count}x</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(count / max) * 100}%`, background: COLORS[muscle] ?? '#475569' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Premium Analytics Lock */}
          {!user.isPremium && (
            <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ filter: 'blur(3px)', pointerEvents: 'none', padding: 16 }}>
                <h3 style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: 14 }}>Strength Progress by Exercise</h3>
                {['Bench Press', 'Squat', 'Deadlift'].map(ex => (
                  <div key={ex} style={{ marginBottom: 12 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 13, color: '#f1f5f9' }}>{ex}</p>
                    <div style={{ height: 50, background: '#0f172a', borderRadius: 8 }} />
                  </div>
                ))}
              </div>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15,23,42,0.7)',
              }}>
                <Lock size={20} color="#a78bfa" style={{ marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', fontSize: 13, color: '#e2e8f0', textAlign: 'center', maxWidth: 200 }}>
                  Strength progress charts require Premium
                </p>
                <button
                  onClick={() => setActiveTab('profile')}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: 'white', border: 'none', borderRadius: 10,
                    padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Personal Records Tab ── */}
      {view === 'records' && (
        <>
          {personalRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Trophy size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p>Complete workouts to set your personal records!</p>
            </div>
          ) : (
            <div className="card" style={{ padding: '14px 16px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Personal Records ({personalRecords.length})
              </h3>
              {personalRecords.map(pr => {
                const ex = exercises.find(e => e.id === pr.exerciseId);
                const orm = (pr.weight * (1 + pr.reps / 30)).toFixed(1);
                return (
                  <div key={pr.exerciseId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid #1e293b',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: '#451a03', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>
                        🏆
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                          {ex?.name ?? pr.exerciseId}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>
                          {new Date(pr.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#fbbf24' }}>
                        {pr.weight > 0 ? `${pr.weight} kg` : 'BW'}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                        {pr.reps} reps
                        {pr.weight > 0 && <> • e1RM: {orm} kg</>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Body Measurements Tab ── */}
      {view === 'body' && (
        <>
          {user.isPremium ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              <p>Body measurements tracking coming soon!</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <PremiumLock
                onUpgrade={() => setActiveTab('profile')}
                message="Track chest, waist, arms and more with FitTrack Premium"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
