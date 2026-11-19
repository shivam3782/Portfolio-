import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Link, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Mentoring from './components/Mentoring';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import About from './components/About';
import useKonami from './hooks/useKonami';
import useSmoothScroll from './hooks/useSmoothScroll';
import useTheme from './hooks/useTheme';
import { toggleMotion, useMotionPaused } from './hooks/useReducedMotion';
import './App.css';
import './studio.css';

const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

function Home({ onCommand }) {
  return (
    <main id="main-content" className="container">
      <Hero /><Projects /><About onCommand={onCommand} /><Skills />
      <div className="career-grid"><Education /><Mentoring /></div>
      <Certifications />
    </main>
  );
}

function Shell() {
  const [command, setCommand] = useState(false);
  const [menu, setMenu] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const motionPaused = useMotionPaused();
  const close = useCallback(() => setCommand(false), []);
  const open = useCallback(() => setCommand(true), []);
  const activated = useKonami();
  const location = useLocation();
  const admin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  useSmoothScroll(command || menu);

  useEffect(() => {
    if (location.pathname === '/') return;
    const previousTitle = document.title;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.append(meta);
    document.title = (admin ? 'Portfolio studio' : 'Page not found') + ' | Shivam Sharma';
    return () => { meta.remove(); document.title = previousTitle; };
  }, [location.pathname, admin]);

  useEffect(() => {
    const handler = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        if (document.querySelector('dialog[open]:not(.command-dialog)')) return;
        event.preventDefault();
        setCommand(value => !value);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={'app-shell' + (activated ? ' retro-flash' : '')}>
      <Link className="skip-link" to={location.pathname + '#main-content'}>Skip to content</Link>
      {!admin && <><ScrollProgress /><Navbar onCommand={open} theme={theme} onTheme={toggleTheme} onMenu={setMenu} /></>}
      <div className="route-content" key={admin ? 'admin' : location.pathname}>
        <Suspense fallback={<main id="main-content" className="container service-state route-loading" role="status" aria-busy="true">Opening workspace…</main>}>
          <Routes location={location}>
            <Route path="/" element={<Home onCommand={open} />} />
            <Route path="/admin/*" element={<AdminPanel theme={theme} onTheme={toggleTheme} onCommand={open} />} />
            <Route path="*" element={<main id="main-content" className="container route-loading"><h1>Page not found.</h1><Link to="/" className="studio-button">Return home</Link></main>} />
          </Routes>
        </Suspense>
      </div>
      {!admin && <Footer />}
      {command && <Suspense fallback={<div className="cheat-toast" role="status">Opening commands…</div>}>
        <CommandPalette open={command} onClose={close} onTheme={toggleTheme} onMotion={toggleMotion} motionPaused={motionPaused} />
      </Suspense>}
      {activated && <div className="cheat-toast" role="status">CHEAT CODE ACTIVATED</div>}
    </div>
  );
}

const router = createBrowserRouter([{
  path: '*',
  element: <Shell />,
  errorElement: <main className="container route-loading"><h1>The page couldn’t open.</h1><p>Reload the portfolio to reconnect.</p><a className="studio-button" href="/">Reload portfolio</a></main>,
}]);
export default function App() {
  return <RouterProvider router={router} />;
}
