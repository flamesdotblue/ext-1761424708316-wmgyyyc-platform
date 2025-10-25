export function calculateStreak(datesSet) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (datesSet.has(key)) streak++;
    else break;
  }
  return streak;
}

export function isoDate(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}
