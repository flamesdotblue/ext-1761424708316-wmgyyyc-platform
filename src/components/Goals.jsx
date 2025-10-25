import { useState } from 'react';

function GoalForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [horizon, setHorizon] = useState('10-year');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      why: why.trim(),
      horizon,
      createdAt: Date.now(),
      progress: 0,
      systems: [],
    });
    setTitle('');
    setWhy('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-slate-300 mb-1">Impossible Goal</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Win a Nobel Prize, Build a unicorn, Summit Everest..." className="w-full rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-1">Why it matters</label>
        <textarea value={why} onChange={(e)=>setWhy(e.target.value)} rows={3} placeholder="Because..." className="w-full rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-300">Time horizon</label>
        <select value={horizon} onChange={(e)=>setHorizon(e.target.value)} className="rounded-md bg-slate-900/60 border border-slate-800 px-2 py-1 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option>10-year</option>
          <option>5-year</option>
          <option>3-year</option>
          <option>1-year</option>
        </select>
        <button type="submit" className="ml-auto inline-flex items-center gap-2 rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold px-3 py-1.5 transition">
          Add Goal
        </button>
      </div>
    </form>
  );
}

function GoalList({ goals, onUpdate, onRemove, onSelect, selectedId }) {
  return (
    <ul className="divide-y divide-slate-800 rounded-md border border-slate-800 overflow-hidden">
      {goals.length === 0 && (
        <li className="p-6 text-slate-400">No goals yet. Add your first impossible goal above.</li>
      )}
      {goals.map((g) => (
        <li key={g.id} className={`p-4 md:p-5 bg-slate-900/40 ${selectedId===g.id?'ring-1 ring-cyan-500/50':''}`}>
          <div className="flex items-start gap-4">
            <button onClick={()=>onSelect(g.id)} className="text-left flex-1">
              <h3 className="font-bold text-slate-100">{g.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{g.why}</p>
              <div className="mt-3">
                <div className="h-2 w-full rounded bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{width: `${g.progress||0}%`}} />
                </div>
                <div className="mt-1 text-xs text-slate-400">Progress: {g.progress||0}% • Horizon: {g.horizon}</div>
              </div>
            </button>
            <div className="flex flex-col gap-2">
              <button onClick={()=>onUpdate(g.id, {progress: Math.min(100, (g.progress||0)+5)})} className="text-xs rounded bg-slate-800 hover:bg-slate-700 px-2 py-1">+5%</button>
              <button onClick={()=>onRemove(g.id)} className="text-xs rounded bg-red-600/80 hover:bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Goals({ goals, setGoals, systems, selectedGoalId, setSelectedGoalId }) {
  const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <GoalForm onAdd={(g)=>setGoals(prev=>[g,...prev])} />
      </div>
      <div className="md:col-span-2">
        <GoalList
          goals={goals}
          selectedId={selectedGoalId}
          onSelect={setSelectedGoalId}
          onRemove={(id)=>setGoals(prev=>prev.filter(g=>g.id!==id))}
          onUpdate={(id, patch)=>setGoals(prev=>prev.map(g=>g.id===id?{...g, ...patch}:g))}
        />

        {selectedGoal && (
          <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedGoal.title}</h3>
                <p className="text-slate-400 text-sm">{selectedGoal.why}</p>
              </div>
              <button onClick={()=>setSelectedGoalId(null)} className="text-xs rounded bg-slate-800 hover:bg-slate-700 px-2 py-1">Close</button>
            </div>
            <div className="mt-4 grid gap-3">
              <label className="text-sm text-slate-300">Systems linked to this goal</label>
              <div className="grid gap-2">
                {(selectedGoal.systems||[]).map(id => {
                  const s = systems.find(x=>x.id===id);
                  return <div key={id} className="text-sm text-slate-300">• {s ? s.title : id}</div>
                })}
              </div>
              <div className="flex gap-2">
                <select id="link-system" className="flex-1 rounded-md bg-slate-900/60 border border-slate-800 px-2 py-1 text-slate-100">
                  {systems.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <button onClick={()=>{
                  const id = document.getElementById('link-system').value;
                  setGoals(prev => prev.map(g => g.id===selectedGoal.id ? { ...g, systems: Array.from(new Set([...(g.systems||[]), id])) } : g));
                }} className="rounded bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold px-3 py-1.5">Link System</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
