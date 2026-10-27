export const calculateProgress = (completed: number, total: number): number => {
  if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  const safeCompleted = Math.min(Math.max(completed, 0), total);

  return Math.round((safeCompleted / total) * 100);
};