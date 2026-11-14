import { useEffect, useState } from 'react';
import { projectRequest } from '../lib/api';
import ProjectCard from './ProjectCard';
import SectionHeading from './SectionHeading';
import { findProjects } from '../lib/projects';
import Icon from './Icon';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 45000);
    projectRequest('', { signal: controller.signal }).then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid response');
      if (active) { setProjects(data); setStatus('ready'); }
    }).catch(() => { if (active) setStatus('error'); }).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  const visible = findProjects(projects, query);
  return <section id="projects" className="section projects-section">
    <SectionHeading number="01" title="Ideas, engineered" tag="Selected work">Web, mobile and machine learning. A closer look at what I build and how I think.</SectionHeading>
    {status === 'loading' && <><p className="loading-note" role="status"><i />Connecting to the project library. The first request may take a moment.</p><div className="skeleton-grid" aria-hidden="true"><div /><div /></div></>}
    {status === 'error' && <div className="service-state" role="alert"><p className="label">Project library unavailable</p><h3>The work is worth a closer look.</h3><p>The project service couldn’t be reached. Retry, or explore my repositories on GitHub.</p><div className="actions"><button className="button secondary" onClick={() => { setStatus('loading'); setAttempt(v => v + 1); }}>Retry connection ↻</button><a className="button secondary" href="https://github.com/shivam3782" target="_blank" rel="noreferrer">Explore GitHub ↗</a></div></div>}
    {status === 'ready' && <><div className="project-toolbar"><p className="mono">{String(visible.length).padStart(2, '0')} PROJECT{visible.length === 1 ? '' : 'S'} / IN THE LIBRARY</p><div className="public-project-search"><Icon name="search" size={17} /><label className="sr-only" htmlFor="public-project-search">Search projects</label><input id="public-project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects…" /></div></div>
      <p role="status" className="sr-only">{visible.length} projects shown</p>
      {visible.length ? <div className="project-gallery">{visible.map(project => <ProjectCard key={project._id} project={project} index={projects.indexOf(project)} featured={projects.indexOf(project) === 0} />)}</div> : <div className="service-state"><h3>{projects.length ? 'No matching projects.' : 'The project library is being updated.'}</h3><p>{projects.length ? 'Try a project name, description, or technology.' : 'Please check back for published work.'}</p>{query && <button className="button secondary" onClick={() => setQuery('')}>Clear search</button>}</div>}
    </>}
  </section>;
}

