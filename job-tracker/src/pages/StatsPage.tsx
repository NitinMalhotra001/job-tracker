import { useJobs } from '../context/JobsContext';
import { STATUSES, STATUS_LABELS } from '../types';

const percent = (part: number, whole: number) => (whole === 0 ? 0 : Math.round((part / whole) * 100));

export default function StatsPage() {
  const { jobs } = useJobs();

  const counts = Object.fromEntries(STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length])) as Record<
    (typeof STATUSES)[number],
    number
  >;

  // Everything except the wishlist has actually been applied to.
  const applied = jobs.length - counts.wishlist;
  const interviewed = counts.interview + counts.offer;
  const max = Math.max(1, ...Object.values(counts));

  return (
    <main>
      <h2 className="page-title">Your progress</h2>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-value">{jobs.length}</span>
          <span className="stat-label">Total tracked</span>
        </div>
        <div className="stat">
          <span className="stat-value">{applied}</span>
          <span className="stat-label">Applications sent</span>
        </div>
        <div className="stat">
          <span className="stat-value">{percent(interviewed, applied)}%</span>
          <span className="stat-label">Reached interview or offer</span>
        </div>
        <div className="stat">
          <span className="stat-value">{counts.offer}</span>
          <span className="stat-label">Offers</span>
        </div>
      </div>

      <section className="panel" aria-label="Jobs by status">
        <h3>Jobs by status</h3>
        <ul className="bars">
          {STATUSES.map((s) => (
            <li key={s}>
              <span className="bar-label">{STATUS_LABELS[s]}</span>
              <span className="bar-track">
                <span className={`bar-fill ${s}`} style={{ width: `${(counts[s] / max) * 100}%` }} />
              </span>
              <span className="bar-count">{counts[s]}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
