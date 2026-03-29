import { AppStoreProvider, useStore } from './store/useAppStore';
import { Header } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WorkoutTab } from './components/Workout/WorkoutTab';
import { NutritionTab } from './components/Nutrition/NutritionTab';
import { ProgressTab } from './components/Progress/ProgressTab';
import { ProfileTab } from './components/Profile/ProfileTab';
import './index.css';

function AppContent() {
  const { state } = useStore();
  const { activeTab } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#0f172a' }}>
      <Header />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'workout' && <WorkoutTab />}
        {activeTab === 'nutrition' && <NutritionTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <AppContent />
    </AppStoreProvider>
  );
}
