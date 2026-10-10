import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { JobsProvider } from './context/JobsContext';
import { STORAGE_KEY } from './storage';

const renderApp = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <JobsProvider>
        <App />
      </JobsProvider>
    </MemoryRouter>,
  );

// Start every test from an empty board so counts are predictable.
const startEmpty = () => localStorage.setItem(STORAGE_KEY, '[]');

describe('Job Tracker app', () => {
  it('shows sample jobs on first visit', () => {
    renderApp();
    expect(screen.getByText('Acme Tech')).toBeInTheDocument();
  });

  it('shows validation errors and does not add a job when required fields are empty', async () => {
    startEmpty();
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add job' }));
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    expect(screen.getByText('Company is required')).toBeInTheDocument();
    expect(screen.getByText('Role is required')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('rejects an invalid job link', async () => {
    startEmpty();
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add job' }));
    await user.type(screen.getByLabelText('Company *'), 'Acme');
    await user.type(screen.getByLabelText('Role *'), 'React Dev');
    await user.type(screen.getByLabelText('Job link'), 'not-a-link');
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    expect(screen.getByText(/Enter a full link/)).toBeInTheDocument();
  });

  it('adds a job into the chosen column and saves it to localStorage', async () => {
    startEmpty();
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add job' }));
    await user.type(screen.getByLabelText('Company *'), 'Initech');
    await user.type(screen.getByLabelText('Role *'), 'React Developer');
    await user.selectOptions(screen.getByLabelText('Status'), 'interview');
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    const column = screen.getByRole('region', { name: 'Interview column' });
    expect(within(column).getByText('Initech')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Initech');
  });

  it('moves a job between columns with the status select', async () => {
    startEmpty();
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '+ Add job' }));
    await user.type(screen.getByLabelText('Company *'), 'Globex');
    await user.type(screen.getByLabelText('Role *'), 'UI Engineer');
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    await user.selectOptions(screen.getByLabelText('Move Globex to'), 'offer');

    const offer = screen.getByRole('region', { name: 'Offer column' });
    expect(within(offer).getByText('Globex')).toBeInTheDocument();
  });

  it('filters jobs with the search box', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Search jobs'), 'northwind');

    expect(screen.getByText('Northwind Labs')).toBeInTheDocument();
    expect(screen.queryByText('Acme Tech')).not.toBeInTheDocument();
  });

  it('shows stats on the stats page', () => {
    startEmpty();
    renderApp('/stats');
    expect(screen.getByText('Your progress')).toBeInTheDocument();
    expect(screen.getByText('Total tracked')).toBeInTheDocument();
  });
});
