import { useState } from 'react';

function Node({ node, onLink, onRemove }) {
  return (
    <div className="p-3 rounded border border-slate-800 bg-slate-900/50">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-cyan-400" />
        <div className="font-medium text-slate-100 flex-1">{node.title}</div>
        <button onClick={() => onRemove(node.id)} className="text-xs rounded bg-red-600/80 hover:bg-red-500 text-white px-2 py-1">Delete</button>
      </div>
      {node.description && <p className="text-xs text-slate-400 mt-1">{node.description}</p>}
      <div className="mt-2">
        <label className="text-xs text-slate-400">Link to node ID</label>
        <div className="flex gap-2 mt-1">
          <input id={`link-${node.id}`} className="flex-1 rounded-md bg-slate-900/60 border border-slate-800 px-2 py-1 text-slate-100" placeholder="Paste target node id" />
          <button onClick={() => {
            const target = document.getElementById(`link-${node.id}`).value.trim();
            if (target) onLink(node.id, target);
          }} className="text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-100 px-2 py-1">Link</button>
        </div>
      </div>
      {node.links?.length > 0 && (
        <div className="text-xs text-slate-400 mt-2">Links: {node.links.join(', ')}</div>
      )}
    </div>
  );
}

export default function SystemMap({ systems, setSystems }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const add = (e) => {
    e && e.preventDefault();
    if (!title.trim()) return;
    setSystems(prev => [...prev, { id: crypto.randomUUID(), title: title.trim(), description: desc.trim(), links: [] }]);
    setTitle('');
    setDesc('');
  };
  const link = (fromId, toId) => setSystems(prev => prev.map(n => n.id===fromId ? { ...n, links: Array.from(new Set([...(n.links||[]), toId])) } : n));
  const remove = (id) => setSystems(prev => prev.filter(n => n.id!==id));

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid md:grid-cols-3 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="System: Research Engine, Hiring machine..." className="rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What it does / how it works" className="rounded-md bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="rounded-md bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold px-3 py-2">Add System</button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {systems.length === 0 && <div className="text-slate-400">No systems yet. Add a few and link them to design your operating model.</div>}
        {systems.map(n => (
          <Node key={n.id} node={n} onLink={link} onRemove={remove} />
        ))}
      </div>
      <div className="text-xs text-slate-500">Tip: Use node IDs to reference and link systems. This is a simple adjacency list you can export later.</div>
    </div>
  );
}
