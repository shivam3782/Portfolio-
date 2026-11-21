import { useState } from 'react';
import { Link } from 'react-router-dom';
import { safeUrl } from '../../lib/api';
import { findProjects, projectMetrics, projectSummary } from '../../lib/projects';
import Icon from '../Icon';
import ProjectMedia from './ProjectMedia';

export default function ProjectLibrary({ projects, loading, onRefresh, onDelete, overview = false, loadedAt }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('portfolio');
  const [assetFilter, setMissing] = useState('');
  const missing = overview ? assetFilter : '';
  const visible = findProjects(projects, query, sort).filter(project => !missing || !safeUrl(project[missing]));
  const filtered = Boolean(missing || query);
  function resetFilters() { setMissing(''); setQuery(''); }
  const metrics = projectMetrics(projects);
  return <>
    {overview && <div className="dashboard-metrics" aria-label="Project overview">{[
      ['folder', 'Total projects', metrics.total, '', 'Show all projects'],
      ['image', 'Missing preview images', metrics.missingImages, 'imageUrl', 'Show projects using concept art'],
      ['external', 'Missing demo links', metrics.missingDemos, 'liveUrl', 'Show projects without demos']
    ].map(([icon, label, count, field, note]) => <button key={label} type="button" className="dashboard-metric" aria-pressed={missing === field} onClick={() => { setQuery(''); setMissing(field); }}><div><span>{label}</span><Icon name={icon} size={18} /></div><strong>{loading ? '—' : count}</strong><p>{note}</p></button>)}</div>}
    <section className="library-panel" aria-labelledby="library-title"><div className="library-heading"><div><h2 id="library-title">Project library<span>{projects.length}</span></h2><p>{missing === 'imageUrl' ? 'Showing projects without a preview image.' : missing === 'liveUrl' ? 'Showing projects without a live demo.' : 'Published projects in portfolio order.'}</p></div><button className="admin-text-button" onClick={onRefresh} disabled={loading}><Icon name="refresh" size={16} />Refresh</button></div>
      <div className="library-controls"><div className="admin-search"><Icon name="search" size={18} /><label className="sr-only" htmlFor="admin-project-search">Search projects</label><input id="admin-project-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects…" type="search" /><kbd aria-hidden="true">⌕</kbd></div><label className="library-sort">Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="portfolio">Portfolio order</option><option value="name">Name A–Z</option></select></label></div>
      <p className="sr-only" role="status">{loading ? 'Loading projects.' : visible.length + ' projects found.'}</p>
      {loading && !projects.length ? <div className="library-loading" role="status"><span className="admin-spinner" />Loading your project library…</div> : visible.length ? <table className="project-management-table"><caption className="sr-only">Your projects. Search and display sorting do not change saved portfolio order.</caption><thead><tr><th scope="col">Project</th><th scope="col">Technologies</th><th scope="col">Preview</th><th scope="col">Position</th><th scope="col" className="actions-column">Actions</th></tr></thead><tbody>{visible.map(project => <tr key={project._id}>
        <td className="project-cell"><div><ProjectMedia key={(project.imageUrl || '') + project._id} url={project.imageUrl} name={project.name} compact /><div className="project-cell-copy"><Link to={'/admin/projects/' + project._id + '/edit'}>{project.name}</Link><p>{projectSummary(project)}</p></div></div></td>
        <td data-label="Technologies"><div className="table-technologies">{(project.tech || []).slice(0, 2).map(t => <span key={t}>{t}</span>)}{project.tech?.length > 2 && <span title={project.tech.slice(2).join(', ')}>+{project.tech.length - 2}<span className="sr-only">: {project.tech.slice(2).join(', ')}</span></span>}{!project.tech?.length && <span className="muted">Not added</span>}</div></td>
        <td data-label="Preview"><span className={'preview-status' + (safeUrl(project.imageUrl) ? ' has-preview' : '')}><i />{safeUrl(project.imageUrl) ? 'Image added' : 'Concept art'}</span></td>
        <td data-label="Position"><span className="table-position">{String(project.position ?? projects.indexOf(project) + 1).padStart(2, '0')}{project.orderLocked && <Icon name="lock" size={12} />}</span></td>
        <td className="table-actions"><Link className="row-edit" to={'/admin/projects/' + project._id + '/edit'}><Icon name="edit" size={15} />Edit<span className="sr-only"> {project.name}</span></Link><button className="row-delete" aria-label={'Delete ' + project.name} onClick={() => onDelete(project)}><Icon name="trash" size={17} /></button></td>
      </tr>)}</tbody></table> : <div className="library-empty"><Icon name={filtered ? 'search' : 'folder'} size={32} /><h3>{filtered ? 'No projects found' : 'Your next project starts here'}</h3><p>{filtered ? 'Try changing the search or asset filter.' : 'Add your first project to start building the library.'}</p>{filtered ? <button className="button secondary" onClick={resetFilters}>Clear filters</button> : <Link className="button primary" to="/admin/projects/new">+ New project</Link>}</div>}
      <div className="library-footer"><span>{visible.length} of {projects.length} projects</span><span>{loadedAt ? 'Synced at ' + new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(loadedAt) : 'Awaiting project data'}</span></div>
    </section><div className="admin-order-note"><Icon name="lock" size={15} /><p>Proactive Insurance opens the portfolio. ARNav closes it.<span> Edit any other project to change its saved position.</span></p></div>
  </>;
}
