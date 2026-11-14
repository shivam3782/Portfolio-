import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Link, Route, Routes, useLocation } from 'react-router-dom';
import { motion, MotionConfig } from 'motion/react';
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
import Mascot from './components/Mascot';
import EngineeringScene from './components/EngineeringScene';
import useCompactLayout from './hooks/useCompactLayout';
import useKonami from './hooks/useKonami';
import useSmoothScroll from './hooks/useSmoothScroll';
import useTheme from './hooks/useTheme';
import useReducedMotion, { toggleMotion, useMotionPaused } from './hooks/useReducedMotion';
import './App.css';
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
function Home() {
  const compact = useCompactLayout();
  return <main id="main-content" className="container"><Hero compact={compact} /><Projects />{compact && <div className="mobile-workbench"><EngineeringScene /></div>}<About /><Skills /><Education /><Mentoring /><Certifications /></main>;
}
function Shell() {
  const [command, setCommand] = useState(false),
    [menu, setMenu] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const reduced = useReducedMotion(), motionPaused = useMotionPaused();
  const close = useCallback(() => setCommand(false), []),
    activated = useKonami(),
    location = useLocation();
  const admin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  useSmoothScroll(command || menu);
  useEffect(() => {
    const handler = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommand(value => !value);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return <MotionConfig reducedMotion={reduced ? "always" : "never"}><div className={`app-shell ${activated ? 'retro-flash' : ''}`}><Link className="skip-link" to={`${location.pathname}#main-content`}>Skip to content</Link>{!admin && <><ScrollProgress /><Navbar onCommand={() => setCommand(true)} theme={theme} onTheme={toggleTheme} onMenu={setMenu} /></>}<motion.div key={admin ? 'admin' : location.pathname} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: .16
        }}><Suspense fallback={<main id="main-content" className="container service-state route-loading" role="status" aria-busy="true">Opening admin…</main>}><Routes location={location}><Route path="/" element={<Home />} /><Route path="/admin/*" element={<AdminPanel theme={theme} onTheme={toggleTheme} onCommand={() => setCommand(true)} />} /><Route path="*" element={<main id="main-content" className="container section"><h1>Page not found.</h1><Link to="/" className="button primary">Return home ↗</Link></main>} /></Routes></Suspense></motion.div>{!admin && <><Footer /><Mascot onCommand={() => setCommand(true)} /></>}{command && <Suspense fallback={<div className="cheat-toast" role="status">Opening commands...</div>}><CommandPalette open={command} onClose={close} onTheme={toggleTheme} onMotion={toggleMotion} motionPaused={motionPaused} /></Suspense>}{activated && <div className="cheat-toast" role="status">CHEAT CODE ACTIVATED</div>}</div></MotionConfig>;
}
const router = createBrowserRouter([{ path: '*', element: <Shell /> }]);
export default function App() {
  return <RouterProvider router={router} />;
}
