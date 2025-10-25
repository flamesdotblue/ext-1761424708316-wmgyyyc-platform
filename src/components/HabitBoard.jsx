import { useMemo } from 'react';
import { calculateStreak, isoDate } from '../hooks/useStreaks';

export default function HabitBoard({ habits, setHabits }) {
  const todayKey = isoDate();

  const toggle = (id, dateKey) => {
    setHabits((prev) => prev.map(h => h.id===id ? {
      ...h,
      done: new Set(h.done).has(dateKey)
        ? Array.from(new Set(h.done)).filter(k=>k!==dateKey)
        : [...Array.from(new Set(h.done)), dateKey]
    } : h));
  };

  const addHabit = () => {
    const name = prompt('New habit name');
    if (!name) return;
    setHabits(prev => [...prev, { id: crypto.randomUUID(), name, cadence: 'daily', done: [] }]);
  };

  const remove = (id) => setHabits(prev => prev.filter(h => h.id!==id));

  const days = useMemo(() => {
    const arr = [];
    const d = new Date();
    for (let i=29; i>=0; i--) {
      const x = new Date(d);
      x.setDate(d.getDate()-i);
      arr.push({ key: x.toISOString().slice(0,10), label: x.toLocaleDateString(undefined,{ month:'short', day:'numeric'}) });
    }
    return arr;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">Habits</h3>
        <button onClick={addHabit} className="rounded bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold px-3 py-1.5">Add Habit</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-slate-400 font-medium p-2">Habit</th>
              {days.map(d => (
                <th key={d.key} className="text-slate-500 font-medium p-2 min-w-[40px]">{d.label}</th>
              ))}
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {habits.map(h => {
              const doneSet = new Set(h.done);
              const streak = calculateStreak(doneSet);
              return (
                <tr key={h.id} className="border-t border-slate-800">
                  <td className="p-2">
                    <div className="font-medium text-slate-100">{h.name}</div>
                    <div className="text-xs text-slate-500">Streak: {streak} • Cadence: {h.cadence}</div>
                  </td>
                  {days.map(d => {
                    const active = doneSet.has(d.key);
                    return (
                      <td key={d.key} className="p-1 text-center">
                        <button
                          onClick={() => toggle(h.id, d.key)}
                          className={`h-7 w-7 rounded grid place-content-center mx-auto transition border ${active ? 'bg-cyan-500/90 text-black border-cyan-400' : 'bg-slate-900/50 text-slate-600 border-slate-800 hover:border-slate-700'}`}
                          title={d.key}
                        >
                          {active ? '✓' : ''}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-2 text-right">
                    <button onClick={()=>remove(h.id)} className="text-xs rounded bg-red-600/80 hover:bg-red-500 text-white px-2 py-1">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-slate-500">Tip: Click today ({todayKey}) to log progress.</div>
    </div>
  );
}
