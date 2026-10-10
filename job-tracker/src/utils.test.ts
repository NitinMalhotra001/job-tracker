import { describe, expect, it } from 'vitest';
import type { Job } from './types';
import { filterJobs, isValidUrl, sortJobs } from './utils';

const job = (overrides: Partial<Job>): Job => ({
  id: 'x',
  company: 'Acme',
  role: 'Frontend Developer',
  location: 'Remote',
  link: '',
  salary: '',
  notes: '',
  status: 'applied',
  appliedDate: '2026-10-01',
  createdAt: 1,
  ...overrides,
});

describe('filterJobs', () => {
  const jobs = [
    job({ id: '1', company: 'Acme', role: 'React Developer', location: 'Noida' }),
    job({ id: '2', company: 'Globex', role: 'UI Engineer', location: 'Pune' }),
  ];

  it('returns everything for an empty query', () => {
    expect(filterJobs(jobs, '  ')).toHaveLength(2);
  });

  it('matches company, role and location case-insensitively', () => {
    expect(filterJobs(jobs, 'ACME').map((j) => j.id)).toEqual(['1']);
    expect(filterJobs(jobs, 'ui eng').map((j) => j.id)).toEqual(['2']);
    expect(filterJobs(jobs, 'pune').map((j) => j.id)).toEqual(['2']);
  });
});

describe('sortJobs', () => {
  const jobs = [
    job({ id: '1', company: 'Beta', createdAt: 1, appliedDate: '2026-10-03' }),
    job({ id: '2', company: 'Alpha', createdAt: 3, appliedDate: '2026-10-01' }),
    job({ id: '3', company: 'Gamma', createdAt: 2, appliedDate: '2026-10-05' }),
  ];

  it('sorts by newest added', () => {
    expect(sortJobs(jobs, 'newest').map((j) => j.id)).toEqual(['2', '3', '1']);
  });

  it('sorts by company name', () => {
    expect(sortJobs(jobs, 'company').map((j) => j.company)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('sorts by latest date', () => {
    expect(sortJobs(jobs, 'applied').map((j) => j.id)).toEqual(['3', '1', '2']);
  });

  it('does not change the original array', () => {
    const ids = jobs.map((j) => j.id);
    sortJobs(jobs, 'company');
    expect(jobs.map((j) => j.id)).toEqual(ids);
  });
});

describe('isValidUrl', () => {
  it('accepts http and https links only', () => {
    expect(isValidUrl('https://example.com/jobs/1')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('example.com')).toBe(false);
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });
});
