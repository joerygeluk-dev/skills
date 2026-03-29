interface MacroRingProps {
  calories: number;
  calorieGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
  size?: number;
}

export function MacroRing({
  calories, calorieGoal,
  protein, proteinGoal,
  carbs, carbsGoal,
  fat, fatGoal,
  size = 140,
}: MacroRingProps) {
  const r = (size / 2) - 12;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(calories / (calorieGoal || 1), 1);
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={r} className="ring-track" />
        <circle
          cx={center} cy={center} r={r}
          className="ring-fill"
          stroke={pct >= 1 ? '#ef4444' : '#22c55e'}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>
          {Math.round(calories)}
        </span>
        <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          / {calorieGoal} kcal
        </span>
      </div>
      {/* Macro dots */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {[
          { color: '#60a5fa', val: protein, goal: proteinGoal, label: 'P' },
          { color: '#34d399', val: carbs, goal: carbsGoal, label: 'C' },
          { color: '#fb923c', val: fat, goal: fatGoal, label: 'F' },
        ].map(({ color, val, goal, label }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 28, height: 4, borderRadius: 2, background: '#1e293b', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(val / (goal || 1) * 100, 100)}%`,
                height: '100%', borderRadius: 2,
                background: color,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{ fontSize: 10, color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
