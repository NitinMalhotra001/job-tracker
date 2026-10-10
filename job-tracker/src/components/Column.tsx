import { useState } from 'react';
import { STATUS_LABELS, type Job, type Status } from '../types';
import JobCard from './JobCard';

interface Props {
  status: Status;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onMove: (id: string, status: Status) => void;
}

export default function Column({ status, jobs, onEdit, onDelete, onMove }: Props) {
  const [isOver, setIsOver] = useState(false);

  return (
    <section
      className={`column ${isOver ? 'over' : ''}`}
      aria-label={`${STATUS_LABELS[status]} column`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onMove(id, status);
      }}
    >
      <header className="column-header">
        <h2>{STATUS_LABELS[status]}</h2>
        <span className="count" aria-label={`${jobs.length} jobs`}>
          {jobs.length}
        </span>
      </header>
      <div className="column-body">
        {jobs.length === 0 ? (
          <p className="empty">Drop a job here</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />)
        )}
      </div>
    </section>
  );
}
