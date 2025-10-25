import { useState } from 'react';
import { Plus, Workflow, Repeat, Target } from 'lucide-react';

const TYPES = ['Goal', 'Habit', 'Routine', 'System'];

export default function AddItemForm({ onAdd }) {
  const [type, setType] = useState('Goal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Habit
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(3);

  // Routine
  const [routineInput, setRoutineInput] = useState('');
  const routineSteps = routineInput
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // System
  const [metricsInput, setMetricsInput] = useState('');
  const metrics = metricsInput
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const reset = () => {
    setTitle('');
    setDescription('');
    setFrequencyPerWeek(3);
    setRoutineInput('');
    setMetricsInput('');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = { type, title: title.trim(), description: description.trim() };
    if (type === 'Habit') payload.frequencyPerWeek = frequencyPerWeek;
    if (type === 'Routine') payload.steps = routineSteps;
    if (type === 'System') payload.metrics = metrics;
    onAdd(payload);
    reset();
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-3">Create a new track</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-2 rounded-xl border text-sm ${
                type === t ? 'bg-white text-neutral-900 border-white' : 'bg-neutral-950/60 border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {t === 'Goal' && <Target className="w-4 h-4" />} {t === 'Habit' && <Repeat className="w-4 h-4" />} {t === 'Routine' && (
                  <Workflow className="w-4 h-4" />
                )}{' '}
                {t === 'System' && <span className="inline-block w-4 h-4 rounded-sm bg-gradient-to-tr from-sky-400 to-violet-400" />}
                {t}
              </span>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Title</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Launch a startup, run a marathon, etc."
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-xl bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[72px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this matters and how you'll approach it"
          />
        </div>

        {type === 'Habit' && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Target times per week</label>
            <input
              type="number"
              min={1}
              max={7}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={frequencyPerWeek}
              onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
            />
          </div>
        )}

        {type === 'Routine' && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Steps (one per line)</label>
            <textarea
              className="w-full px-3 py-2 rounded-xl bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[96px]"
              value={routineInput}
              onChange={(e) => setRoutineInput(e.target.value)}
              placeholder={"Wake at 6am\nHydrate\nWorkout\nPlan day"}
            />
          </div>
        )}

        {type === 'System' && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Metrics to track (one per line)</label>
            <textarea
              className="w-full px-3 py-2 rounded-xl bg-neutral-950/60 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[96px]"
              value={metricsInput}
              onChange={(e) => setMetricsInput(e.target.value)}
              placeholder={"Deep work hours\nProtein grams\nRevenue ($)"}
            />
          </div>
        )}

        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-900 font-medium hover:bg-neutral-200 transition">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>
    </div>
  );
}
