import { LayoutDashboard, Dumbbell, UtensilsCrossed, TrendingUp, User } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import type { Tab } from '../../types';

const NAV_ITEMS: { tab: Tab; icon: typeof LayoutDashboard; label: string }[] = [
  { tab: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { tab: 'workout', icon: Dumbbell, label: 'Workout' },
  { tab: 'nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
  { tab: 'progress', icon: TrendingUp, label: 'Progress' },
  { tab: 'profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const { state, setActiveTab } = useStore();
  const { activeTab, activeWorkout } = state;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #1e293b',
      padding: '8px 8px calc(8px + env(safe-area-inset-bottom, 0px))',
      display: 'flex',
      zIndex: 40,
    }}>
      {NAV_ITEMS.map(({ tab, icon: Icon, label }) => {
        const isActive = activeTab === tab;
        const isWorkout = tab === 'workout';
        const hasActive = isWorkout && !!activeWorkout;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 12,
              background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              transition: 'all 0.2s',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}>
              <Icon
                size={20}
                color={isActive ? '#22c55e' : '#64748b'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {hasActive && (
                <span style={{
                  position: 'absolute',
                  top: 4, right: 4,
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  border: '1.5px solid #0f172a',
                  animation: 'pulse 2s infinite',
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#22c55e' : '#64748b',
              letterSpacing: '0.3px',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
