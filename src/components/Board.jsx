import ItemCard from './ItemCard';

export default function Board({
  items,
  onSetGoalProgress,
  onToggleHabitToday,
  onToggleRoutineStep,
  onUpdateSystemMetric,
  onArchive,
  onDelete,
}) {
  if (!items.length) {
    return (
      <div className="h-full min-h-[360px] flex items-center justify-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/40">
        <div className="text-center">
          <p className="text-neutral-300">No tracks yet. Create one to get started.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onSetGoalProgress={onSetGoalProgress}
          onToggleHabitToday={onToggleHabitToday}
          onToggleRoutineStep={onToggleRoutineStep}
          onUpdateSystemMetric={onUpdateSystemMetric}
          onArchive={onArchive}
          onDelete={onDelete}
        />)
      )}
    </div>
  );
}
