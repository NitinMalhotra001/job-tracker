import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { jobsReducer } from '../reducer';
import { loadJobs, saveJobs } from '../storage';
import type { Job, JobInput, Status } from '../types';
import { makeId } from '../utils';

interface JobsContextValue {
  jobs: Job[];
  addJob: (input: JobInput) => void;
  updateJob: (id: string, changes: Partial<JobInput>) => void;
  deleteJob: (id: string) => void;
  moveJob: (id: string, status: Status) => void;
}

const JobsContext = createContext<JobsContextValue | null>(null);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, dispatch] = useReducer(jobsReducer, undefined, loadJobs);

  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  const addJob = useCallback((input: JobInput) => {
    dispatch({ type: 'add', job: { ...input, id: makeId(), createdAt: Date.now() } });
  }, []);

  const updateJob = useCallback((id: string, changes: Partial<JobInput>) => {
    dispatch({ type: 'update', id, changes });
  }, []);

  const deleteJob = useCallback((id: string) => {
    dispatch({ type: 'delete', id });
  }, []);

  const moveJob = useCallback((id: string, status: Status) => {
    dispatch({ type: 'move', id, status });
  }, []);

  const value = useMemo(
    () => ({ jobs, addJob, updateJob, deleteJob, moveJob }),
    [jobs, addJob, updateJob, deleteJob, moveJob],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs(): JobsContextValue {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used inside <JobsProvider>');
  return ctx;
}
