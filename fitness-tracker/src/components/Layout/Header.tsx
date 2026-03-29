import { Flame, Crown } from 'lucide-react';
import { useStore } from '../../store/useAppStore';

const TAB_TITLES: Record<string, string> = {
  dashboard: 'FitTrack',
  workout: 'Workouts',
  nutrition: 'Nutrition',
  progress: 'Progress',
  profile: 'Profile',
};

export function Header() {
  const { state, setActiveTab } = useStore();
  const { user, activeTab } = state;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e293b',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 30,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
          {activeTab === 'dashboard' ? (
            <>
              <span style={{ color: '#22c55e' }}>Fit</span>Track
            </>
          ) : TAB_TITLES[activeTab]}
        </h1>
        {activeTab === 'dashboard' && (
          <p style={{ margin: 0, fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Streak */}
        {user.streakDays > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#431407', borderRadius: 10,
            padding: '5px 10px',
          }}>
            <Flame size={14} color="#f97316" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>
              {user.streakDays}
            </span>
          </div>
        )}

        {/* Premium badge */}
        {user.isPremium ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            borderRadius: 10, padding: '5px 10px',
          }}>
            <Crown size={13} color="white" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>PRO</span>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed22, #4f46e522)',
              border: '1px solid #7c3aed44',
              borderRadius: 10, padding: '5px 10px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Crown size={13} color="#a78bfa" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>Pro</span>
          </button>
        )}

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 15, color: 'white',
          cursor: 'pointer',
        }}
          onClick={() => setActiveTab('profile')}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
