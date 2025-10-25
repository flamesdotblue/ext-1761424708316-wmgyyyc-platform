import { useMemo } from 'react';
import Hero from './components/Hero';
import Goals from './components/Goals';
import HabitBoard from './components/HabitBoard';
import RoutinePlanner from './components/RoutinePlanner';
import SystemMap from './components/SystemMap';
import { useLocalStorage } from './hooks/useLocalStorage';

function Section({ title, subtitle, children, actions }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function App() {
  const [goals, setGoals] = useLocalStorage('ib_goals', []);
  const [habits, setHabits] = useLocalStorage('ib_habits', []);
  const [routines, setRoutines] = useLocalStorage('ib_routines', []);
  const [systems, setSystems] = useLocalStorage('ib_systems', []);

  const [tab, setTab] = useLocalStorage('ib_tab', 'Dashboard');
  const [selectedGoalId, setSelectedGoalId] = useLocalStorage('ib_selected_goal', null);

  const selectedGoal = useMemo(() => goals.find(g => g.id===selectedGoalId) || null, [goals, selectedGoalId]);

  const exportAll = () => {
    const data = { goals, habits, routines, systems, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'impossible-tracker.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importAll = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setGoals(data.goals || []);
        setHabits(data.habits || []);
        setRoutines(data.routines || []);
        setSystems(data.systems || []);
      } catch (e) { alert('Invalid file'); }
    };
    reader.readAsText(file);
  };

  const tabs = ['Dashboard','Goals','Habits','Routines','Systems'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <Hero />

        <div className="flex items-center justify-between border border-slate-800 rounded-lg p-1 bg-slate-950/60 sticky top-2 z-20 backdrop-blur">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)} className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition ${tab===t ? 'bg-cyan-500/90 text-black' : 'text-slate-300 hover:bg-slate-800'}`}>{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportAll} className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm">Export</button>
            <label className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm cursor-pointer">
              Import<input type="file" className="hidden" accept="application/json" onChange={(e)=>e.target.files[0] && importAll(e.target.files[0])} />
            </label>
          </div>
        </div>

        {tab==='Dashboard' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Section title="Your Impossible Goals" subtitle="North Star outcomes you’re working toward">
              <Goals goals={goals} setGoals={setGoals} systems={systems} selectedGoalId={selectedGoalId} setSelectedGoalId={setSelectedGoalId} />
            </Section>

            <Section title="Habits" subtitle="Daily actions that compound">
              <HabitBoard habits={habits} setHabits={setHabits} />
            </Section>

            <Section title="Routines" subtitle="Sequenced activities that structure your day">
              <RoutinePlanner routines={routines} setRoutines={setRoutines} />
            </Section>

            <Section title="Systems" subtitle="Reusable processes that make results reliable">
              <SystemMap systems={systems} setSystems={setSystems} />
            </Section>
          </div>
        )}

        {tab==='Goals' && (
          <Section title="Impossible Goals" subtitle="Define and track your moonshots">
            <Goals goals={goals} setGoals={setGoals} systems={systems} selectedGoalId={selectedGoalId} setSelectedGoalId={setSelectedGoalId} />
          </Section>
        )}

        {tab==='Habits' && (
          <Section title="Habit Tracker" subtitle="Mark off days and build streaks">
            <HabitBoard habits={habits} setHabits={setHabits} />
          </Section>
        )}

        {tab==='Routines' && (
          <Section title="Routine Planner" subtitle="Orchestrate blocks into a repeatable flow">
            <RoutinePlanner routines={routines} setRoutines={setRoutines} />
          </Section>
        )}

        {tab==='Systems' && (
          <Section title="Systems Graph" subtitle="Create and connect the engines that drive results">
            <SystemMap systems={systems} setSystems={setSystems} />
          </Section>
        )}

        <footer className="py-8 text-center text-xs text-slate-500">Made with ❤️ — Your best self, systematized.</footer>
      </div>
    </div>
  );
}
