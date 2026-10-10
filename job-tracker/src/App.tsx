import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BoardPage from './pages/BoardPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<BoardPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<main><p className="hint">Page not found.</p></main>} />
      </Routes>
    </>
  );
}
