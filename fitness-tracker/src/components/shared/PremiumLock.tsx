import { Lock, Sparkles } from 'lucide-react';

interface PremiumLockProps {
  onUpgrade: () => void;
  message?: string;
}

export function PremiumLock({ onUpgrade, message = 'This feature is available with FitTrack Premium' }: PremiumLockProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '28px 20px', gap: 12, textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock size={22} color="white" />
      </div>
      <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, maxWidth: 240 }}>{message}</p>
      <button
        className="btn-primary"
        onClick={onUpgrade}
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', padding: '10px 20px' }}
      >
        <Sparkles size={15} />
        Upgrade to Premium
      </button>
    </div>
  );
}

interface FeatureBadgeProps {
  isPremium?: boolean;
}

export function FeatureBadge({ isPremium = true }: FeatureBadgeProps) {
  if (!isPremium) return <span className="badge-free">Free</span>;
  return (
    <span className="badge-premium" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Sparkles size={8} />
      Pro
    </span>
  );
}
