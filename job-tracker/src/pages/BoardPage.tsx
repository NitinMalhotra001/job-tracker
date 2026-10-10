import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Column from '../components/Column';
import JobForm from '../components/JobForm';
import { useJobs } from '../context/JobsContext';
import { STATUSES, type Job, type JobInput, type SortKey } from '../types';
import { filterJobs, sortJobs } from '../utils';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest added' },
  { value: 'applied', label: 'Latest date' },
  { value: 'company', label: 'Company A-Z' },
];

const isSortKey = (v: string | null): v is SortKey => SORT_OPTIONS.some((o) => o.value === v);

type Editing = { mode: 'new' } | { mode: 'edit'; job: Job } | null;

export default function BoardPage() {
  const { jobs, addJob, updateJob, deleteJob, moveJob } = useJobs();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState<Editing>(null);

  // Search and sort live in the URL, so a filtered board can be bookmarked or shared.
  const query = params.get('q') ?? '';
  const sortParam = params.get('sort');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'newest';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => sortJobs(filterJobs(jobs, query), sort), [jobs, query, sort]);

  const handleSubmit = (input: JobInput) => {
    if (editing?.mode === 'edit') updateJob(editing.job.id, input);
    else addJob(input);
    setEditing(null);
  };

  const handleDelete = (job: Job) => {
    if (window.confirm(`Delete ${job.role} at ${job.company}?`)) deleteJob(job.id);
  };

  return (
    <main>
      <div className="toolbar">
        <input
          type="search"
          className="search"
          placeholder="Search company, role or location"
          aria-label="Search jobs"
          value={query}
          onChange={(e) => updateParam('q', e.target.value)}
        />
        <label className="sort">
          <span className="visually-hidden">Sort by</span>
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value === 'newest' ? '' : e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn primary" onClick={() => setEditing({ mode: 'new' })}>
          + Add job
        </button>
      </div>

      {jobs.length === 0 && (
        <p className="hint">No jobs yet. Add your first application to get started.</p>
      )}
      {jobs.length > 0 && visible.length === 0 && <p className="hint">No jobs match "{query}".</p>}

      <div className="board">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            jobs={visible.filter((j) => j.status === status)}
            onEdit={(job) => setEditing({ mode: 'edit', job })}
            onDelete={handleDelete}
            onMove={moveJob}
          />
        ))}
      </div>

      {editing && (
        <JobForm
          initial={editing.mode === 'edit' ? editing.job : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}
    </main>
  );
}
