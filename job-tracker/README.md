# Job Tracker

A Kanban-style board for tracking job applications. Drag cards between Wishlist, Applied, Interview, Offer and Rejected, search and sort them, and see your progress on a stats page. Everything is saved in your browser (localStorage), so there is no backend or sign-up.

**Live demo:** _add your Vercel or Netlify link here_

![Job Tracker board](./screenshot.png)
_Add a screenshot of the board here after you run the app._

## Features

- Drag and drop cards between columns, or use the status dropdown on each card (works with a keyboard and on touch screens)
- Add, edit and delete jobs with form validation (required fields, valid http/https links)
- Search by company, role or location, and sort by newest, latest date or company name
- Search and sort are stored in the URL, so a filtered board can be bookmarked (`/?q=react&sort=company`)
- Stats page: total tracked, applications sent, interview rate, offers and a bar chart by status
- Data persists across reloads and survives corrupt or blocked storage without crashing
- Responsive layout, light and dark mode, labelled form fields and visible keyboard focus

## Tech stack

React 18, TypeScript, React Router 6, Context API with `useReducer`, Vite, Vitest and React Testing Library.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # run the test suite
npm run build      # type-check and build for production
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/   Header, Column, JobCard, JobForm
  context/      JobsContext (state shared across pages)
  pages/        BoardPage, StatsPage
  reducer.ts    Pure reducer: add, update, delete, move
  storage.ts    localStorage load and save, with sample data on first visit
  utils.ts      Filtering, sorting, date formatting, URL validation
```

## Design decisions

- **Reducer in its own file.** State changes are pure functions, so they are easy to test without rendering anything.
- **Native HTML5 drag and drop** instead of a library, to keep the bundle small (about 58 kB gzipped). The status dropdown on every card is the accessible alternative to dragging.
- **Search and sort in the URL** with `useSearchParams`, so the state survives refresh and can be shared.
- **Defensive storage.** Saved data is validated when loaded, and a failed write (full or blocked storage) does not break the app.

## Deploy

Push to GitHub, then import the repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Both are configured already (`vercel.json` and `public/_redirects` handle client-side routes), and the defaults of `npm run build` and the `dist` folder work as they are.

## Ideas to extend it

- Sign in with Firebase or Supabase and store jobs per user
- Reorder cards within a column
- Interview dates with reminders
- Export and import jobs as CSV
- Reorder columns or add custom statuses
