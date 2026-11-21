import { lazy, Suspense, useEffect, useState } from 'react';
import { createBrowserRouter, createMemoryRouter, RouterProvider, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Mentoring from './components/Mentoring';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/sections/Contact';
import ContentProvider from './components/ContentProvider';
import ErrorBoundary from './components/ErrorBoundary';
import RouteEffects from './components/RouteEffects';
import Skeleton from './components/ui/Skeleton';
import NotFound from './pages/NotFound';
import useTheme from './hooks/useTheme';
import './App.css';
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
function Home() {
  return <main id="main-content"><div className="container"><Hero /><About /><Projects /><Skills /><Education /><Mentoring /><Contact /></div></main>;
}
function Shell() {
  const [command, setCommand] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();
  const admin = location.pathname.startsWith('/admin');
  useEffect(() => {
    const handler = event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommand(value => !value); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return <div className="app-shell"><RouteEffects /><a className="skip-link" href="#main-content">Skip to content</a>{!admin && <Navbar onCommand={() => setCommand(true)} theme={theme} onTheme={toggleTheme} />}<ErrorBoundary key={location.pathname}><Suspense fallback={<main id="main-content" className="container route-loading"><Skeleton /></main>}><Routes><Route path="/" element={<Home />} /><Route path="/projects/:slug" element={<ProjectDetail />} /><Route path="/admin/*" element={<AdminPanel theme={theme} onTheme={toggleTheme} onCommand={() => setCommand(true)} />} /><Route path="*" element={<NotFound />} /></Routes></Suspense></ErrorBoundary>{!admin && <Footer />}{command && <Suspense fallback={<p className="toast" role="status">Opening menu…</p>}><CommandPalette open onClose={() => setCommand(false)} onTheme={toggleTheme} /></Suspense>}</div>;
}
const browserRouter = typeof document !== 'undefined' ? createBrowserRouter([{ path: '*', element: <Shell /> }]) : null;
export default function App({ url = '/', initialContent }) { const [router] = useState(() => browserRouter || createMemoryRouter([{ path: '*', element: <Shell /> }], { initialEntries: [url] })); return <ErrorBoundary><ContentProvider initialContent={initialContent}><RouterProvider router={router} /></ContentProvider></ErrorBoundary>; }
