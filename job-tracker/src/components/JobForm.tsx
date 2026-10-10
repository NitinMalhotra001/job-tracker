import { useEffect, useRef, useState, type FormEvent } from 'react';
import { STATUSES, STATUS_LABELS, type Job, type JobInput, type Status } from '../types';
import { isValidUrl } from '../utils';

interface Props {
  /** Pass a job to edit it; leave empty to add a new one. */
  initial?: Job;
  onSubmit: (input: JobInput) => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'company' | 'role' | 'link', string>>;

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function JobForm({ initial, onSubmit, onCancel }: Props) {
  const [company, setCompany] = useState(initial?.company ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [link, setLink] = useState(initial?.link ?? '');
  const [salary, setSalary] = useState(initial?.salary ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [status, setStatus] = useState<Status>(initial?.status ?? 'applied');
  const [appliedDate, setAppliedDate] = useState(initial?.appliedDate ?? todayISO());
  const [errors, setErrors] = useState<Errors>({});

  const companyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    companyRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!company.trim()) next.company = 'Company is required';
    if (!role.trim()) next.role = 'Role is required';
    if (link.trim() && !isValidUrl(link.trim())) next.link = 'Enter a full link starting with http:// or https://';
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      link: link.trim(),
      salary: salary.trim(),
      notes: notes.trim(),
      status,
      appliedDate,
    });
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="job-form-title">
        <h2 id="job-form-title">{initial ? 'Edit job' : 'Add job'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="company">Company *</label>
            <input
              id="company"
              ref={companyRef}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? 'company-error' : undefined}
            />
            {errors.company && (
              <p className="error" id="company-error" role="alert">
                {errors.company}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="role">Role *</label>
            <input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? 'role-error' : undefined}
            />
            {errors.role && (
              <p className="error" id="role-error" role="alert">
                {errors.role}
              </p>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="salary">Salary (optional)</label>
              <input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 4-6 LPA" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="link">Job link</label>
            <input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://"
              aria-invalid={Boolean(errors.link)}
              aria-describedby={errors.link ? 'link-error' : undefined}
            />
            {errors.link && (
              <p className="error" id="link-error" role="alert">
                {errors.link}
              </p>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="appliedDate">Date</label>
              <input id="appliedDate" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {initial ? 'Save changes' : 'Add job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
