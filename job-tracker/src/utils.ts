import type { Job, SortKey } from './types';

export function filterJobs(jobs: Job[], query: string): Job[] {
  const q = query.trim().toLowerCase();
  if (!q) return jobs;
  return jobs.filter((job) =>
    [job.company, job.role, job.location].some((field) => field.toLowerCase().includes(q)),
  );
}

export function sortJobs(jobs: Job[], sort: SortKey): Job[] {
  const copy = [...jobs];
  switch (sort) {
    case 'company':
      return copy.sort((a, b) => a.company.localeCompare(b.company));
    case 'applied':
      return copy.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
    case 'newest':
    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
