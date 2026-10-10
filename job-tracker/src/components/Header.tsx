import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <h1>Job Tracker</h1>
      <nav aria-label="Main">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
          Board
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
          Stats
        </NavLink>
      </nav>
    </header>
  );
}
