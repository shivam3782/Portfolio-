import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { projectRequest, contentRequest } from '../lib/api';
import Icon from './Icon';
import ProjectLibrary from './admin/ProjectLibrary';
import ProjectEditor from './admin/ProjectEditor';
import ConfirmDialog from './admin/ConfirmDialog';
import './admin/admin.css';
import ProfileEditor from './admin/ProfileEditor';
import Inbox from './admin/Inbox';

function AccessForm({ onAccess, compact = false }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault();
    if (busy || !value.trim()) return;
    setBusy(true); setError('');
    try {
      const session = await projectRequest('/session', { headers: { 'x-admin-key': value }, signal: AbortSignal.timeout(15000) });
      if (!session.authenticated) throw new Error();
      onAccess(value);
      setValue('');
    } catch (failure) { setError(failure.status === 401 ? 'That key wasn’t accepted. Please try again.' : 'The console couldn’t be reached. Check the backend connection and retry.'); }
    finally { setBusy(false); }
  };
  return <form className="console-access-form" onSubmit={submit}><span className="access-icon"><Icon name="lock" size={23} /></span><p className="section-label">PRIVATE WORKSPACE</p><h1>{compact ? 'Verify your access' : 'Welcome back, Shivam.'}</h1><p>{compact ? 'Your project changes are still here. Verify your key to continue.' : 'A little care behind every project. Sign in to manage your portfolio.'}</p><label htmlFor={compact ? 'verify-admin-key' : 'admin-key'}>Admin key</label><input id={compact ? 'verify-admin-key' : 'admin-key'} type="password" autoComplete="off" autoFocus required value={value} onChange={event => setValue(event.target.value)} disabled={busy} placeholder="Enter your private key" />{error && <p className="field-error" role="alert">{error}</p>}<button className="button primary" type="submit" disabled={busy}>{busy ? <><span className="admin-spinner" />Verifying…</> : <>Open workspace<Icon name="arrow" size={18} /></>}</button><p className="access-footnote"><Icon name="lock" size={13} />Server-verified. Your key stays in memory.</p></form>;
}

function AccessDialog({ onAccess, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement, dialog = ref.current; dialog.showModal(); return () => { dialog.close(); if (previous?.isConnected) previous.focus(); }; }, []);
  return <dialog ref={ref} className="admin-confirm reauth-dialog" aria-label="Verify admin access" onCancel={event => { event.preventDefault(); onClose(); }}><button className="reauth-close" aria-label="Close access verification" onClick={onClose}>×</button><AccessForm compact onAccess={onAccess} /></dialog>;
}

function LockConsole({ onLock }) {
  const navigate = useNavigate();
  useEffect(() => { onLock(); navigate('/admin', { replace: true }); }, [onLock, navigate]);
  return null;
}

export default function AdminPanel({ theme, onTheme, onCommand }) {
  const [entered, setEntered] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadedAt, setLoadedAt] = useState(null);
  const [needsAccess, setNeedsAccess] = useState(false);
  const [verify, setVerify] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const key = useRef('');
  const loadController = useRef(null);
  const location = useLocation();
  const api = useCallback((path = '', options = {}) => projectRequest(path, {
    ...options, signal: options.signal || AbortSignal.timeout(30000),
    headers: { 'Content-Type': 'application/json', 'x-admin-key': key.current, ...options.headers }
  }), []);
  const contentApi = useCallback((path, options = {}) => contentRequest(path, { ...options, headers: { 'x-admin-key': key.current, ...options.headers } }), []);
  const load = useCallback(async () => {
    loadController.current?.abort();
    const controller = new AbortController();
    loadController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 45000);
    setLoading(true); setError('');
    try {
      const data = await projectRequest('', { signal: controller.signal });
      if (!Array.isArray(data)) throw new Error();
      if (!controller.signal.aborted) { setProjects(data); setLoadedAt(new Date()); }
    } catch {
      if (loadController.current === controller) setError('The project library couldn’t be refreshed. Your existing view is kept. Try again in a moment.');
    } finally {
      clearTimeout(timeout);
      if (loadController.current === controller) { setLoading(false); loadController.current = null; }
    }
  }, []);
  useEffect(() => () => { loadController.current?.abort(); loadController.current = null; }, []);
  useEffect(() => () => { key.current = ''; }, []);
  const access = value => { key.current = value; if (!entered) load(); setEntered(true); setNeedsAccess(false); setVerify(false); };
  const lock = useCallback(() => { loadController.current?.abort(); loadController.current = null; key.current = ''; setEntered(false); setProjects([]); setLoadedAt(null); setMessage(''); setError(''); setNeedsAccess(false); setVerify(false); }, []);
  const unauthorized = useCallback(() => { setNeedsAccess(true); setVerify(true); }, []);
  const saved = note => { setMessage(note); load(); };
  const remove = async () => {
    if (deleteBusy) return;
    setDeleteBusy(true); setDeleteError('');
    try {
      await api('/' + encodeURIComponent(deleting._id), { method: 'DELETE' });
      setProjects(current => current.filter(p => p._id !== deleting._id));
      setMessage('Project deleted from your portfolio.'); setDeleting(null); load();
    } catch (failure) {
      setDeleteError(failure.status === 401 ? 'Access needs to be verified before this project can be deleted.' : 'The deletion could not be confirmed. Refresh the library before retrying.');
      if (failure.status === 401) { setNeedsAccess(true); setDeleting(null); setVerify(true); }
    } finally { setDeleteBusy(false); }
  };
  const editor = /\/projects\/(?:new|[^/]+\/edit)\/?$/.test(location.pathname);
  const projectPage = location.pathname.startsWith('/admin/projects');
  const title = editor ? location.pathname.endsWith('/new') ? 'A new piece of work' : 'Refine your project' : projectPage ? 'Your projects' : 'Workspace overview';
  const description = editor ? 'Make the story as considered as the code.' : projectPage ? 'Find it, refine it, share it.' : 'Good work deserves a well-kept home.';
  const tools = <div className="admin-header-tools"><button className="admin-icon-button" aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'} onClick={onTheme}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button><button className="admin-command-button" aria-label="Open command palette" onClick={onCommand}><kbd>Ctrl K</kbd></button></div>;

  if (location.pathname === '/admin/lock') return <LockConsole onLock={lock} />;
  if (!entered) return <main id="main-content" className="console-login"><div className="console-login-brand"><Link className="wordmark" to="/"><span className="wordmark-symbol">s/</span>Shivam<span className="logo-dot">.</span></Link><div><p className="section-label">THE WORK BEHIND THE WORK</p><h2>A considered space<br />for the things<br /><span>you build.</span></h2><p>Projects, stories and the details that make them yours.</p><div className="login-grid-art" aria-hidden="true"><Icon name="code" size={66} /><span>BUILD · REFINE · SHARE</span></div></div><Link className="admin-text-button" to="/">Back to portfolio<Icon name="arrow" size={17} /></Link></div><div className="console-login-content">{tools}<AccessForm onAccess={access} /><span className="login-copyright">Shivam Sharma / Portfolio console</span></div></main>;

  return <main id="main-content" className="admin-workspace"><aside className="admin-sidebar"><Link to="/admin" className="wordmark"><span className="wordmark-symbol">s/</span>Shivam<span className="logo-dot">.</span></Link><div className="workspace-label"><span className="workspace-avatar">SS</span><div><strong>Portfolio console</strong><span>Personal workspace</span></div></div><p className="sidebar-caption">WORKSPACE</p><nav aria-label="Admin navigation"><NavLink end to="/admin" className="admin-nav-item"><Icon name="overview" size={19} />Overview</NavLink><NavLink to="/admin/projects" className="admin-nav-item"><Icon name="folder" size={19} />Projects<span>{projects.length}</span></NavLink><NavLink to="/admin/profile" className="admin-nav-item">Profile &amp; content</NavLink><NavLink to="/admin/inbox" className="admin-nav-item">Contact inbox</NavLink><Link to="/" className="admin-nav-item"><Icon name="external" size={18} />View portfolio</Link></nav><div className="sidebar-bottom"><div className="sidebar-note"><span className={'connection-dot' + (loadedAt ? ' connected' : '')} /><span>{loading ? 'Syncing library…' : loadedAt ? 'Library synchronized' : 'Awaiting connection'}</span></div><Link className="admin-nav-item" to="/admin/lock"><Icon name="lock" size={18} />Lock console</Link><span className="sidebar-version">A little curiosity. Well organized.</span></div></aside>
    <div className="admin-work-area"><div className="admin-topbar"><p>Workspace<span>/</span><b>{editor ? 'Project editor' : projectPage ? 'Projects' : 'Overview'}</b></p><div><Link to="/" className="admin-portfolio-link">View portfolio<Icon name="external" size={14} /></Link>{tools}</div></div>
      <div className="admin-content"><header className="admin-page-heading"><div><p className="section-label">YOUR WORK, THOUGHTFULLY MANAGED</p><h1>{title}<span className="accent">.</span></h1><p>{description}</p></div>{!editor && <Link className="button primary" to="/admin/projects/new"><Icon name="plus" size={18} />New project</Link>}</header>
        {message && <div className="admin-notice success" role="status"><Icon name="check" size={18} /><span>{message}</span><button aria-label="Dismiss notification" onClick={() => setMessage('')}>×</button></div>}
        {error && <div className="admin-notice error" role="alert"><Icon name="alert" size={18} /><span>{error}</span><button onClick={load} disabled={loading}>Retry</button></div>}
        {needsAccess && <div className="admin-notice error" role="alert"><Icon name="lock" size={18} /><span>Your changes are kept. Verify access before saving.</span><button onClick={() => setVerify(true)}>Verify access</button></div>}
        {loading && !loadedAt ? <div className="library-loading" role="status"><span className="admin-spinner" />Opening your workspace…</div> : error && !loadedAt ? <div className="library-empty"><h2>Let’s reconnect the library</h2><p>Your project data is safe. Refresh when the service is available.</p><button className="button secondary" onClick={load}>Refresh library</button></div> : <Routes><Route path="profile" element={<ProfileEditor api={contentApi} onUnauthorized={unauthorized} />} /><Route path="inbox" element={<Inbox api={contentApi} onUnauthorized={unauthorized} />} /><Route index element={<ProjectLibrary projects={projects} loading={loading} loadedAt={loadedAt} onRefresh={load} onDelete={project => { setDeleting(project); setDeleteError(''); }} overview />} /><Route path="projects" element={<ProjectLibrary projects={projects} loading={loading} loadedAt={loadedAt} onRefresh={load} onDelete={project => { setDeleting(project); setDeleteError(''); }} />} /><Route path="projects/new" element={<ProjectEditor key={location.pathname} projects={projects} api={api} onSaved={saved} onUnauthorized={unauthorized} />} /><Route path="projects/:id/edit" element={<ProjectEditor key={location.pathname} projects={projects} api={api} onSaved={saved} onUnauthorized={unauthorized} />} /><Route path="lock" element={<LockConsole onLock={lock} />} /><Route path="*" element={<div className="library-empty"><h2>Workspace page not found</h2><Link to="/admin/projects" className="button secondary">Return to projects</Link></div>} /></Routes>}
      </div><div className="admin-workspace-footer"><span>Made for the work that matters.</span><span>SHIVAM / CONSOLE</span></div>
    </div>
    {deleting && <ConfirmDialog title={'Delete ' + deleting.name + '?'} danger confirm="Delete project" busy={deleteBusy} error={deleteError} onConfirm={remove} onCancel={() => setDeleting(null)}><p>This removes the project from your portfolio. This action cannot be undone.</p></ConfirmDialog>}
    {verify && <AccessDialog onAccess={access} onClose={() => setVerify(false)} />}
  </main>;
}
