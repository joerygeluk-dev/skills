import { useState } from 'react';
import { Crown, Activity, ChevronRight, Download, Bell, Shield, Sparkles, Check } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { PremiumModal } from '../Premium/PremiumModal';
import type { Goal } from '../../types';

const GOAL_LABELS: Record<Goal, { label: string; icon: string; description: string }> = {
  lose_weight: { label: 'Lose Weight', icon: '⬇️', description: 'Calorie deficit focus' },
  maintain: { label: 'Maintain Weight', icon: '⚖️', description: 'Balanced nutrition' },
  gain_muscle: { label: 'Build Muscle', icon: '💪', description: 'High protein & surplus' },
  improve_fitness: { label: 'Improve Fitness', icon: '🏃', description: 'Endurance & strength' },
};


export function ProfileTab() {
  const { state, updateUser } = useStore();
  const { user, workouts, foodEntries, weightEntries, personalRecords } = state;
  const [showPremium, setShowPremium] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);

  // Local edit state
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age?.toString() ?? '');
  const [editHeight, setEditHeight] = useState(user.height?.toString() ?? '');
  const [editWeight] = useState(user.weight?.toString() ?? '');
  const [editCalories, setEditCalories] = useState(user.calorieGoal.toString());
  const [editProtein, setEditProtein] = useState(user.proteinGoal.toString());
  const [editCarbs, setEditCarbs] = useState(user.carbsGoal.toString());
  const [editFat, setEditFat] = useState(user.fatGoal.toString());

  function saveProfile() {
    updateUser({
      name: editName,
      age: editAge ? parseInt(editAge) : undefined,
      height: editHeight ? parseFloat(editHeight) : undefined,
      weight: editWeight ? parseFloat(editWeight) : undefined,
    });
    setEditSection(null);
  }

  function saveGoals() {
    updateUser({
      calorieGoal: parseInt(editCalories) || user.calorieGoal,
      proteinGoal: parseInt(editProtein) || user.proteinGoal,
      carbsGoal: parseInt(editCarbs) || user.carbsGoal,
      fatGoal: parseInt(editFat) || user.fatGoal,
    });
    setEditSection(null);
  }

  function exportData() {
    if (!user.isPremium) {
      setShowPremium(true);
      return;
    }
    const data = {
      profile: user,
      workouts,
      foodEntries,
      weightEntries,
      personalRecords,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const joinedAgo = Math.floor((Date.now() - new Date(user.joinDate).getTime()) / 86400000);
  const totalVolume = workouts.reduce((s, w) => s + (w.totalVolume ?? 0), 0);

  return (
    <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Premium Banner */}
      {!user.isPremium ? (
        <div
          onClick={() => setShowPremium(true)}
          style={{
            background: 'linear-gradient(135deg, #4c1d95, #1e1b4b)',
            border: '1px solid #7c3aed44',
            borderRadius: 16, padding: '16px 18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}>
            <Crown size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
              Upgrade to Premium
            </p>
            <p style={{ margin: 0, fontSize: 12, color: '#a78bfa', marginTop: 2 }}>
              Advanced analytics, AI suggestions & more
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white', fontSize: 12, fontWeight: 700,
            padding: '6px 12px', borderRadius: 8,
          }}>
            From €4.99
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #4c1d95, #1e1b4b)',
          border: '1px solid #7c3aed44',
          borderRadius: 16, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Crown size={22} color="#a78bfa" />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Premium Active 🎉
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#7c3aed' }}>
              {user.premiumExpiresAt
                ? `Expires ${new Date(user.premiumExpiresAt).toLocaleDateString()}`
                : 'Lifetime access'}
            </p>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { value: workouts.length, label: 'Workouts' },
          { value: personalRecords.length, label: 'PRs' },
          { value: `${(totalVolume / 1000000).toFixed(1)}t`, label: 'Volume' },
          { value: `${joinedAgo}d`, label: 'Member' },
        ].map(({ value, label }) => (
          <div key={label} className="card" style={{ padding: '10px 6px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{value}</p>
            <p style={{ margin: 0, fontSize: 10, color: '#64748b', marginTop: 1 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Profile Info */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: 'white',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{user.name}</h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {GOAL_LABELS[user.goal].icon} {GOAL_LABELS[user.goal].label}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditSection(editSection === 'profile' ? null : 'profile')}
            style={{ background: '#334155', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Edit
          </button>
        </div>

        {editSection === 'profile' ? (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Name</label>
              <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Age</label>
                <input className="input-field" type="number" value={editAge} onChange={e => setEditAge(e.target.value)} placeholder="28" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Height (cm)</label>
                <input className="input-field" type="number" value={editHeight} onChange={e => setEditHeight(e.target.value)} placeholder="178" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={saveProfile} style={{ flex: 1, padding: '10px' }}>
                <Check size={14} /> Save
              </button>
              <button className="btn-secondary" onClick={() => setEditSection(null)} style={{ flex: 1, padding: '10px' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Age', value: user.age ? `${user.age} yr` : '—' },
              { label: 'Height', value: user.height ? `${user.height} cm` : '—' },
              { label: 'Weight', value: user.weight ? `${user.weight} kg` : '—' },
              { label: 'Activity', value: user.activityLevel.replace('_', ' ') },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{label}</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginTop: 2, textTransform: 'capitalize' }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Selection */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Fitness Goal
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(Object.entries(GOAL_LABELS) as [Goal, typeof GOAL_LABELS[Goal]][]).map(([goal, info]) => (
            <button
              key={goal}
              onClick={() => updateUser({ goal })}
              style={{
                padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                border: user.goal === goal ? '2px solid #22c55e' : '2px solid #334155',
                background: user.goal === goal ? '#052e16' : '#0f172a',
                textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>{info.icon}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: user.goal === goal ? '#22c55e' : '#94a3b8' }}>
                {info.label}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: '#475569' }}>{info.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nutrition Goals */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Nutrition Goals
          </h3>
          <button
            onClick={() => setEditSection(editSection === 'nutrition' ? null : 'nutrition')}
            style={{ background: '#334155', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Edit
          </button>
        </div>

        {editSection === 'nutrition' ? (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Calories (kcal)', value: editCalories, set: setEditCalories },
              { label: 'Protein (g)', value: editProtein, set: setEditProtein },
              { label: 'Carbs (g)', value: editCarbs, set: setEditCarbs },
              { label: 'Fat (g)', value: editFat, set: setEditFat },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>
                <input className="input-field" type="number" value={value} onChange={e => set(e.target.value)} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={saveGoals} style={{ flex: 1, padding: '10px' }}>
                <Check size={14} /> Save
              </button>
              <button className="btn-secondary" onClick={() => setEditSection(null)} style={{ flex: 1, padding: '10px' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
            {[
              { label: 'Calories', value: user.calorieGoal, unit: 'kcal', color: '#f1f5f9' },
              { label: 'Protein', value: user.proteinGoal, unit: 'g', color: '#60a5fa' },
              { label: 'Carbs', value: user.carbsGoal, unit: 'g', color: '#34d399' },
              { label: 'Fat', value: user.fatGoal, unit: 'g', color: '#fb923c' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="card-dark" style={{ padding: '10px 6px' }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color }}>{value}</p>
                <p style={{ margin: 0, fontSize: 9, color: '#64748b', marginTop: 2 }}>{unit} {label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Settings
        </h3>
        {[
          {
            icon: <Download size={15} color="#22c55e" />,
            label: 'Export Data',
            sub: user.isPremium ? 'Download your fitness data' : 'Premium feature',
            action: exportData,
            premium: !user.isPremium,
          },
          {
            icon: <Activity size={15} color="#60a5fa" />,
            label: 'Weight Unit',
            sub: user.weightUnit.toUpperCase(),
            action: () => updateUser({ weightUnit: user.weightUnit === 'kg' ? 'lbs' : 'kg' }),
            premium: false,
          },
          {
            icon: <Bell size={15} color="#fbbf24" />,
            label: 'Notifications',
            sub: 'Workout reminders',
            action: () => {},
            premium: false,
          },
          {
            icon: <Shield size={15} color="#a78bfa" />,
            label: 'Privacy & Data',
            sub: 'Manage your data',
            action: () => {},
            premium: false,
          },
        ].map(({ icon, label, sub, action, premium }) => (
          <div
            key={label}
            onClick={action}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: '1px solid #1e293b',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#0f172a', border: '1px solid #1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>{sub}</p>
            </div>
            {premium ? (
              <Sparkles size={14} color="#a78bfa" />
            ) : (
              <ChevronRight size={14} color="#475569" />
            )}
          </div>
        ))}
      </div>

      {/* App Info */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#334155' }}>
          FitTrack v1.0
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#1e293b' }}>
          Made with 💪 for serious athletes
        </p>
      </div>

      {/* Premium Modal */}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}
