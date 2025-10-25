import { useMemo } from 'react';
import { Target, Repeat, Workflow, Trash2, Archive, Gauge, CheckCircle, Flame } from 'lucide-react';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function HabitFooter({ item, onToggleHabitToday }) {
  const completions = item.habit?.completions || {};
  const today = getToday();
  const doneToday = !!completions[today];

  const streak = useMemo(() => {
    const has = (date) => !!completions[date];
    let s = 0;
    let d = new Date(today);
    while (has(d.toISOString().slice(0, 10))) {
      s += 1;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [completions, today]);

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={() => onToggleHabitToday(item.id)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
          doneToday ? 'bg-emerald-500 text-emerald-950 border-emerald-400' : 'bg-neutral-900/60 text-neutral-200 border-neutral-700 hover:border-neutral-500'
        }`}
      >
        <CheckCircle className="w-4 h-4" /> {doneToday ? 'Done today' : 'Mark today'}
      </button>
      <div className="flex items-center gap-2 text-sm text-neutral-300">
        <Flame className="w-4 h-4 text-orange-400" /> Streak {streak}
        <span className="opacity-60">•</span>
        <span>Target {item.habit?.frequencyPerWeek || 3}/wk</span>
      </div>
    </div>
  );
}

function RoutineBody({ item, onToggleRoutineStep }) {
  const steps = item.routine?.steps || [];
  const total = steps.length;
  const completed = steps.filter((s) => s.doneToday).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="mt-3">
      <div className="h-2 rounded-full bg-neutral-800">
        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 space-y-2 max-h-44 overflow-auto pr-1">
        {steps.map((s) => (
          <label key={s.id} className="flex items-center gap-3 select-none">
            <input
              type="checkbox"
              checked={!!s.doneToday}
              onChange={() => onToggleRoutineStep(item.id, s.id)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-sky-500 focus:ring-sky-500"
            />
            <span className={`text-sm ${s.doneToday ? 'line-through text-neutral-400' : ''}`}>{s.text}</span>
          </label>
        ))}
        {!steps.length && <p className="text-sm text-neutral-400">No steps added.</p>}
      </div>
    </div>
  );
}

function GoalBody({ item, onSetGoalProgress }) {
  const value = item.progress || 0;
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-300">Progress</span>
        <span className="text-neutral-200 font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-800 mt-2">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onSetGoalProgress(item.id, Number(e.target.value))}
        className="mt-3 w-full accent-emerald-500"
      />
    </div>
  );
}

function SystemBody({ item, onUpdateSystemMetric }) {
  const metrics = item.system?.metrics || [];
  return (
    <div className="mt-3 space-y-3">
      {metrics.map((m) => (
        <div key={m.id} className="flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Gauge className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-neutral-200 truncate" title={m.name}>{m.name}</span>
          </div>
          <input
            type="number"
            value={m.value}
            onChange={(e) => onUpdateSystemMetric(item.id, m.id, e.target.value)}
            className="ml-auto w-28 px-3 py-1.5 rounded-lg bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-right"
          />
        </div>
      ))}
      {!metrics.length && <p className="text-sm text-neutral-400">No metrics added.</p>}
    </div>
  );
}

export default function ItemCard({
  item,
  onSetGoalProgress,
  onToggleHabitToday,
  onToggleRoutineStep,
  onUpdateSystemMetric,
  onArchive,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {item.type === 'Goal' && <Target className="w-5 h-5 text-emerald-400" />}
          {item.type === 'Habit' && <Repeat className="w-5 h-5 text-orange-300" />}
          {item.type === 'Routine' && <Workflow className="w-5 h-5 text-sky-300" />}
          {item.type === 'System' && <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-400 to-violet-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-lg leading-tight">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-neutral-300 mt-1 whitespace-pre-line">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onArchive(item.id, true)}
                className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-950/60"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-950/60"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {item.type === 'Goal' && (
            <GoalBody item={item} onSetGoalProgress={onSetGoalProgress} />
          )}

          {item.type === 'Habit' && (
            <HabitFooter item={item} onToggleHabitToday={onToggleHabitToday} />
          )}

          {item.type === 'Routine' && (
            <RoutineBody item={item} onToggleRoutineStep={onToggleRoutineStep} />
          )}

          {item.type === 'System' && (
            <SystemBody item={item} onUpdateSystemMetric={onUpdateSystemMetric} />
          )}
        </div>
      </div>
    </div>
  );
}
