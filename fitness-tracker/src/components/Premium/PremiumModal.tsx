import { X, Check, Sparkles, Crown, Zap, BarChart3, Lock, Users, Download, Dumbbell } from 'lucide-react';
import { useStore } from '../../store/useAppStore';

interface PremiumModalProps {
  onClose: () => void;
}

const FEATURES = [
  { icon: BarChart3, label: 'Advanced analytics & strength charts', color: '#60a5fa' },
  { icon: Dumbbell, label: 'Custom workout program builder', color: '#34d399' },
  { icon: Zap, label: 'AI-powered workout suggestions', color: '#fbbf24' },
  { icon: Users, label: 'Body measurements tracker', color: '#fb923c' },
  { icon: Crown, label: 'Full workout history (unlimited)', color: '#a78bfa' },
  { icon: Download, label: 'Export data (CSV & PDF)', color: '#22c55e' },
  { icon: Lock, label: 'Custom exercises & food database', color: '#f87171' },
  { icon: Sparkles, label: 'Calorie cycling & meal plans', color: '#06b6d4' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '€4.99',
    period: '/month',
    savings: null,
    popular: false,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '€39.99',
    period: '/year',
    savings: 'Save 33%',
    popular: true,
  },
  {
    id: 'lifetime',
    label: 'Lifetime',
    price: '€79.99',
    period: 'one time',
    savings: 'Best value',
    popular: false,
  },
];

export function PremiumModal({ onClose }: PremiumModalProps) {
  const { activatePremium } = useStore();

  function handlePurchase(_planId: string) {
    // In a real app, this would integrate with a payment provider (Stripe, RevenueCat, etc.)
    activatePremium();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ paddingBottom: 32 }}>
        <div className="swipe-handle" />

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: 24,
          background: 'linear-gradient(135deg, #7c3aed22, #0ea5e922)',
          margin: '-20px -20px 24px',
          padding: '24px 20px',
          borderRadius: '12px 12px 0 0',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: 16, top: 16,
              background: '#334155', border: 'none', borderRadius: 8,
              width: 30, height: 30, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} color="#94a3b8" />
          </button>

          <div style={{
            width: 60, height: 60, borderRadius: 20,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
          }}>
            <Crown size={28} color="white" />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>
            FitTrack <span style={{ color: '#a78bfa' }}>Premium</span>
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
            Unlock your full potential
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {FEATURES.map(({ icon: Icon, label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: `${color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={15} color={color} />
              </div>
              <span style={{ fontSize: 14, color: '#e2e8f0' }}>{label}</span>
              <Check size={14} color="#22c55e" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => handlePurchase(plan.id)}
              style={{
                width: '100%',
                background: plan.popular ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#1e293b',
                border: plan.popular ? '1px solid #7c3aed' : '1px solid #334155',
                borderRadius: 14,
                padding: '14px 18px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -1, right: 12,
                  background: '#fbbf24', color: '#000',
                  fontSize: 10, fontWeight: 800,
                  padding: '3px 10px', borderRadius: '0 0 8px 8px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  Most Popular
                </div>
              )}
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'white' }}>{plan.label}</p>
                {plan.savings && (
                  <p style={{ margin: 0, fontSize: 11, color: plan.popular ? '#c4b5fd' : '#22c55e', marginTop: 2 }}>
                    {plan.savings}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{plan.price}</span>
                <span style={{ fontSize: 12, color: plan.popular ? '#c4b5fd' : '#64748b', marginLeft: 4 }}>{plan.period}</span>
              </div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 11, color: '#475569', textAlign: 'center', margin: 0 }}>
          Cancel anytime • Secure payment • 7-day free trial
        </p>
      </div>
    </div>
  );
}
