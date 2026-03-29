import { useState } from 'react';
import { Plus, Trash2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../store/useAppStore';
import { MacroRing } from '../shared/MacroRing';
import { DEFAULT_FOODS, MEAL_ICONS, MEAL_LABELS } from '../../data/foods';
import type { FoodEntry, MealType } from '../../types';

export function NutritionTab() {
  const { state, addFoodEntry, removeFoodEntry } = useStore();
  const { user, foodEntries } = state;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddFood, setShowAddFood] = useState<MealType | null>(null);

  const dayEntries = foodEntries.filter(e => e.date === selectedDate);

  const dayTotals = dayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.nutrition.calories,
      protein: acc.protein + e.nutrition.protein,
      carbs: acc.carbs + e.nutrition.carbs,
      fat: acc.fat + e.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  function navigateDate(dir: -1 | 1) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Date Navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigateDate(-1)}
          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '8px', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} color="#94a3b8" />
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
            {isToday ? 'Today' : formattedDate}
          </p>
          {!isToday && <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{formattedDate}</p>}
        </div>
        <button
          onClick={() => navigateDate(1)}
          disabled={isToday}
          style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '8px',
            cursor: isToday ? 'not-allowed' : 'pointer', opacity: isToday ? 0.4 : 1,
          }}
        >
          <ChevronRight size={16} color="#94a3b8" />
        </button>
      </div>

      {/* Calorie Overview */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <MacroRing
            calories={dayTotals.calories}
            calorieGoal={user.calorieGoal}
            protein={dayTotals.protein}
            proteinGoal={user.proteinGoal}
            carbs={dayTotals.carbs}
            carbsGoal={user.carbsGoal}
            fat={dayTotals.fat}
            fatGoal={user.fatGoal}
            size={130}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Protein', val: dayTotals.protein, goal: user.proteinGoal, color: '#60a5fa' },
                { label: 'Carbs', val: dayTotals.carbs, goal: user.carbsGoal, color: '#34d399' },
                { label: 'Fat', val: dayTotals.fat, goal: user.fatGoal, color: '#fb923c' },
              ].map(({ label, val, goal, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>
                      {Math.round(val)}g
                      <span style={{ color: '#475569', fontWeight: 400 }}> / {goal}g</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(val / (goal || 1) * 100, 100)}%`,
                        background: val > goal * 1.1 ? '#ef4444' : color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px solid #334155',
          display: 'flex', justifyContent: 'space-around', textAlign: 'center',
        }}>
          {[
            { label: 'Goal', value: user.calorieGoal, color: '#94a3b8' },
            { label: 'Eaten', value: Math.round(dayTotals.calories), color: '#22c55e' },
            { label: 'Remaining', value: Math.max(0, user.calorieGoal - Math.round(dayTotals.calories)), color: dayTotals.calories > user.calorieGoal ? '#ef4444' : '#60a5fa' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color }}>{value}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      {meals.map(meal => {
        const mealEntries = dayEntries.filter(e => e.mealType === meal);
        const mealCals = mealEntries.reduce((s, e) => s + e.nutrition.calories, 0);

        return (
          <div key={meal} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mealEntries.length > 0 ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{MEAL_ICONS[meal]}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                    {MEAL_LABELS[meal]}
                  </h3>
                  {mealCals > 0 && (
                    <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
                      {Math.round(mealCals)} kcal
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowAddFood(meal)}
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: '#334155', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} color="#22c55e" />
              </button>
            </div>

            {mealEntries.map(entry => (
              <div key={entry.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #334155',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{entry.foodName}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>
                    {entry.servings}x • P: {Math.round(entry.nutrition.protein)}g C: {Math.round(entry.nutrition.carbs)}g F: {Math.round(entry.nutrition.fat)}g
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                    {Math.round(entry.nutrition.calories)} kcal
                  </span>
                  <button
                    onClick={() => removeFoodEntry(entry.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={13} color="#64748b" />
                  </button>
                </div>
              </div>
            ))}

            {mealEntries.length === 0 && (
              <p style={{ margin: 0, fontSize: 12, color: '#475569', textAlign: 'center', padding: '8px 0' }}>
                No food logged yet
              </p>
            )}
          </div>
        );
      })}

      {/* Add Food Modal */}
      {showAddFood && (
        <AddFoodModal
          mealType={showAddFood}
          date={selectedDate}
          onClose={() => setShowAddFood(null)}
          onAdd={addFoodEntry}
        />
      )}
    </div>
  );
}

// ─── Add Food Modal ────────────────────────────────────────────────────────────

interface AddFoodModalProps {
  mealType: MealType;
  date: string;
  onClose: () => void;
  onAdd: (entry: FoodEntry) => void;
}

function AddFoodModal({ mealType, date, onClose, onAdd }: AddFoodModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof DEFAULT_FOODS[0] | null>(null);
  const [servings, setServings] = useState(1);

  const filtered = DEFAULT_FOODS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.brand?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  function handleAdd() {
    if (!selected) return;
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      foodId: selected.id,
      foodName: selected.name,
      mealType,
      servings,
      nutrition: {
        calories: selected.nutrition.calories * servings,
        protein: selected.nutrition.protein * servings,
        carbs: selected.nutrition.carbs * servings,
        fat: selected.nutrition.fat * servings,
        fiber: (selected.nutrition.fiber ?? 0) * servings,
      },
      date,
      time: new Date().toTimeString().slice(0, 5),
    };
    onAdd(entry);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="swipe-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
            Add to {MEAL_LABELS[mealType]}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {!selected ? (
          <>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search food..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
                autoFocus
              />
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {filtered.map(food => (
                <div
                  key={food.id}
                  onClick={() => setSelected(food)}
                  style={{
                    padding: '12px 8px', cursor: 'pointer',
                    borderBottom: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{food.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748b', marginTop: 1 }}>
                      {food.brand && <>{food.brand} • </>}
                      {food.servingSize}{food.servingUnit}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                      {food.nutrition.calories} kcal
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>
                      P{food.nutrition.protein}g C{food.nutrition.carbs}g F{food.nutrition.fat}g
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0', fontSize: 14 }}>
                  No foods found. Add custom foods with Premium!
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="animate-slide-up">
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ChevronLeft size={14} /> Back to search
            </button>

            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{selected.name}</h4>
              {selected.brand && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b' }}>{selected.brand}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
                {[
                  { label: 'Calories', value: Math.round(selected.nutrition.calories * servings), unit: 'kcal', color: '#f1f5f9' },
                  { label: 'Protein', value: Math.round(selected.nutrition.protein * servings), unit: 'g', color: '#60a5fa' },
                  { label: 'Carbs', value: Math.round(selected.nutrition.carbs * servings), unit: 'g', color: '#34d399' },
                  { label: 'Fat', value: Math.round(selected.nutrition.fat * servings), unit: 'g', color: '#fb923c' },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className="card-dark" style={{ padding: '8px 4px' }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color }}>{value}</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#64748b' }}>{unit}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#475569', marginTop: 2 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Servings ({selected.servingSize}{selected.servingUnit} per serving)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setServings(s => Math.max(0.5, s - 0.5))}
                  className="btn-secondary"
                  style={{ width: 40, height: 40, padding: 0, borderRadius: 12, flexShrink: 0 }}
                >
                  −
                </button>
                <input
                  type="number"
                  className="input-field"
                  value={servings}
                  onChange={e => setServings(Math.max(0.5, parseFloat(e.target.value) || 1))}
                  min="0.5"
                  step="0.5"
                  style={{ textAlign: 'center', fontWeight: 700, fontSize: 18 }}
                />
                <button
                  onClick={() => setServings(s => s + 0.5)}
                  className="btn-primary"
                  style={{ width: 40, height: 40, padding: 0, borderRadius: 12, flexShrink: 0 }}
                >
                  +
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleAdd} style={{ width: '100%' }}>
              <Plus size={16} />
              Add {Math.round(selected.nutrition.calories * servings)} kcal to {MEAL_LABELS[mealType]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
