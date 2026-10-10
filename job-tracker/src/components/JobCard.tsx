import { STATUSES, STATUS_LABELS, type Job, type Status } from '../types';
import { formatDate } from '../utils';

interface Props {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onMove: (id: string, status: Status) => void;
}

export default function JobCard({ job, onEdit, onDelete, onMove }: Props) {
  return (
    <article
      className="card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', job.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      aria-label={`${job.role} at ${job.company}`}
    >
      <div className="card-top">
        <h3>{job.company}</h3>
        <span className="date">{formatDate(job.appliedDate)}</span>
      </div>
      <p className="role">{job.role}</p>
      {job.location && <p className="meta">{job.location}</p>}
      {job.salary && <p className="meta">{job.salary}</p>}
      {job.notes && <p className="notes">{job.notes}</p>}

      <div className="card-bottom">
        <label className="visually-hidden" htmlFor={`status-${job.id}`}>
          Move {job.company} to
        </label>
        <select
          id={`status-${job.id}`}
          value={job.status}
          onChange={(e) => onMove(job.id, e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <div className="card-buttons">
          {job.link && (
            <a href={job.link} target="_blank" rel="noreferrer noopener" className="link-btn">
              Open
            </a>
          )}
          <button type="button" className="link-btn" onClick={() => onEdit(job)}>
            Edit
          </button>
          <button type="button" className="link-btn danger" onClick={() => onDelete(job)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
