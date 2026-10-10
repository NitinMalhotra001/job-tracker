import type { Job, JobInput, Status } from './types';

export type Action =
  | { type: 'add'; job: Job }
  | { type: 'update'; id: string; changes: Partial<JobInput> }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; status: Status };

export function jobsReducer(state: Job[], action: Action): Job[] {
  switch (action.type) {
    case 'add':
      return [action.job, ...state];
    case 'update':
      return state.map((job) => (job.id === action.id ? { ...job, ...action.changes } : job));
    case 'delete':
      return state.filter((job) => job.id !== action.id);
    case 'move':
      return state.map((job) => (job.id === action.id ? { ...job, status: action.status } : job));
    default:
      return state;
  }
}
