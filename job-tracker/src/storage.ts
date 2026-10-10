import { STATUSES, type Job } from './types';

export const STORAGE_KEY = 'job-tracker:v1';

const today = new Date().toISOString().slice(0, 10);

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/** Shown the first time the app loads, so the board is not empty. */
export const SAMPLE_JOBS: Job[] = [
  {
    id: 'sample-1',
    company: 'Acme Tech',
    role: 'Frontend Developer (React)',
    location: 'Bengaluru, Remote',
    link: '',
    salary: '',
    notes: 'Referral from a college senior. Prepare React hooks and CSS layout questions.',
    status: 'interview',
    appliedDate: daysAgo(6),
    createdAt: Date.now() - 6 * 86400000,
  },
  {
    id: 'sample-2',
    company: 'Northwind Labs',
    role: 'Junior UI Engineer',
    location: 'Noida',
    link: '',
    salary: '',
    notes: '',
    status: 'applied',
    appliedDate: daysAgo(3),
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'sample-3',
    company: 'Globex',
    role: 'React Intern',
    location: 'Pune',
    link: '',
    salary: '',
    notes: 'Waiting for the careers page to open applications.',
    status: 'wishlist',
    appliedDate: today,
    createdAt: Date.now() - 86400000,
  },
];

const isJob = (value: unknown): value is Job => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.company === 'string' &&
    typeof v.role === 'string' &&
    typeof v.status === 'string' &&
    (STATUSES as readonly string[]).includes(v.status)
  );
};

export function loadJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return SAMPLE_JOBS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isJob) : [];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working in memory.
  }
}
