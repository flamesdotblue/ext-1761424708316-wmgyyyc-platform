import { useState } from 'react';

function RoutineItem({ item, onToggle, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded border border-slate-800 bg-slate-900/50">
      <input type="checkbox" checked={!!item.done} onChange={()=>onToggle(item.id)} className="h-4 w-4" />
      <div className="flex-1">
        <div className="text-slate-100 font-medium">{item.title}</div>
        {item.when && <div className="text-xs text-slate-500">{item.when}</div>}
      </div>
      <button onClick={()=>onRemove(item.id)} className="text-xs rounded bg-red-600/80 hover:bg-red-500 text-white px-2 py-1">Remove</button>
    </div>
  );
}

export default function RoutinePlanner({ routines, setRoutines }) {
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');

  const add = (e) => {
    e && e.preventDefault();
    if (!title.trim()) return;
    setRoutines(prev => [...prev, { id: crypto.randomUUID(), title: title.trim(), when: when.trim(), done: false }]);
    setTitle('');
    setWhen('');
  };

  const toggle = (id) => setRoutines(prev => prev.map(r => r.id===id ? { ...r, done: !r.done } : r));
  const remove = (id) => setRoutines(prev => prev.filter(r => r.id!==id));
  const clearDone = () => setRoutines(prev => prev.filter(r => !r.done));

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Design morning routine..." className="flex-1 min-w-[200px] rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input value={when} onChange={e=>setWhen(e.target.value)} placeholder="06:30 daily" className="w-[180px] rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold px-3 py-2">Add</button>
        <button type="button" onClick={clearDone} className="rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-3 py-2">Clear Done</button>
      </form>

      <div className="grid gap-3">
        {routines.length === 0 && <div className="text-slate-400">No routines yet. Add a few to design your day.</div>}
        {routines.map(r => (
          <RoutineItem key={r.id} item={r} onToggle={toggle} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}
