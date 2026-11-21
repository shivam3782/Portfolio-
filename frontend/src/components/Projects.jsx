import { useEffect, useState } from 'react';
import { links } from '../data/content';
import { projectRequest } from '../lib/api';
import { findProjects } from '../lib/projects';
import ProjectCard from './ProjectCard';
import Icon from './Icon';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('');
  const [view, setView] = useState('Gallery');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const delay = setTimeout(() => setStatus('slow'), 4000);
    const timeout = setTimeout(() => controller.abort(), 65000);
    function clearTimers() {
      clearTimeout(delay);
      clearTimeout(timeout);
    }
    projectRequest('', { signal: controller.signal }).then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid project list');
      if (active) { setProjects(data); setStatus('ready'); }
    }).catch(() => {
      if (active) setStatus('error');
    }).finally(clearTimers);
    return () => { active = false; clearTimers(); controller.abort(); };
  }, [attempt]);

  const technologies = [...new Set(projects.flatMap(p => p.tech || []))].sort((a, b) => a.localeCompare(b));
  const visible = findProjects(projects, query).filter(p => !technology || p.tech?.includes(technology));
  function clearFilters() { setQuery(''); setTechnology(''); }

  return (
    <section id="projects" className="studio-section projects-section" aria-labelledby="work-title" aria-busy={status === 'loading' || status === 'slow'}>
      <div className="work-heading">
        <h2 id="work-title" className="studio-heading">Selected <em>work.</em></h2>
        {status === 'ready' && projects.length > 0 && <div className="view-switch" role="group" aria-label="Project display">
          {['Gallery', 'Index'].map(item => <button key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}
        </div>}
      </div>
      {(status === 'loading' || status === 'slow') && <>
        <p className="loading-note" role="status">{status === 'slow' ? 'The project service is waking up. Your projects will appear here shortly.' : 'Loading projects…'}</p>
        <div className="skeleton-grid" aria-hidden="true"><div /><div /></div>
      </>}
      {status === 'error' && <div className="service-state" role="alert">
        <h3>Projects couldn’t load.</h3><p>Try again or browse the source repositories.</p>
        <div className="studio-actions"><button className="studio-button" onClick={() => { setStatus('loading'); setAttempt(n => n + 1); }}>Retry connection</button><a className="studio-button" href={links.github} target="_blank" rel="noreferrer">GitHub</a></div>
      </div>}
      {status === 'ready' && <>
        {projects.length > 0 && <div className="work-controls">
          <div className="public-project-search"><Icon name="search" size={17} /><label className="sr-only" htmlFor="public-project-search">Search projects</label><input id="public-project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects…" /></div>
          <label className="tech-select"><span className="sr-only">Filter by technology</span><select value={technology} onChange={event => setTechnology(event.target.value)}><option value="">All technologies</option>{technologies.map(t => <option key={t}>{t}</option>)}</select></label>
          <span className="result-count" role="status">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</span>
        </div>}
        {visible.length > 0 ? <div className={'project-gallery' + (view === 'Index' ? ' index-view' : '')}>
          {visible.map(project => <ProjectCard key={project._id} project={project} index={projects.indexOf(project)} featured={project === projects[0]} compact={view === 'Index'} />)}
        </div> : <div className="service-state">
          <h3>{projects.length ? 'No matching projects.' : 'The project library is being updated.'}</h3>
          {projects.length ? <button className="studio-button" onClick={clearFilters}>Clear filters</button> : <p>Please check back for published work.</p>}
        </div>}
      </>}
    </section>
  );
}
