import { describe, expect, it } from 'vitest';
import { jobsReducer } from './reducer';
import type { Job } from './types';

const makeJob = (overrides: Partial<Job> = {}): Job => ({
  id: 'a',
  company: 'Acme',
  role: 'Frontend Developer',
  location: '',
  link: '',
  salary: '',
  notes: '',
  status: 'applied',
  appliedDate: '2026-10-01',
  createdAt: 1,
  ...overrides,
});

describe('jobsReducer', () => {
  it('adds a job at the top of the list', () => {
    const existing = makeJob({ id: 'a' });
    const added = makeJob({ id: 'b', company: 'Globex' });
    const result = jobsReducer([existing], { type: 'add', job: added });
    expect(result.map((j) => j.id)).toEqual(['b', 'a']);
  });

  it('updates only the matching job', () => {
    const result = jobsReducer([makeJob({ id: 'a' }), makeJob({ id: 'b' })], {
      type: 'update',
      id: 'b',
      changes: { company: 'Initech' },
    });
    expect(result[0].company).toBe('Acme');
    expect(result[1].company).toBe('Initech');
  });

  it('deletes a job', () => {
    const result = jobsReducer([makeJob({ id: 'a' }), makeJob({ id: 'b' })], { type: 'delete', id: 'a' });
    expect(result.map((j) => j.id)).toEqual(['b']);
  });

  it('moves a job to a new status without touching others', () => {
    const result = jobsReducer([makeJob({ id: 'a' }), makeJob({ id: 'b' })], {
      type: 'move',
      id: 'a',
      status: 'interview',
    });
    expect(result[0].status).toBe('interview');
    expect(result[1].status).toBe('applied');
  });

  it('does not mutate the previous state', () => {
    const state = [makeJob({ id: 'a' })];
    jobsReducer(state, { type: 'move', id: 'a', status: 'offer' });
    expect(state[0].status).toBe('applied');
  });
});
