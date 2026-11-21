import { Link } from 'react-router-dom';
import { safeUrl } from '../lib/api';
import { slugFor, visibleText } from '../lib/content';
import ProjectPreview from './ui/ProjectPreview';
import { projectSummary } from '../lib/projects';
export default function ProjectCard({ project, index = 0, featured = false }) {
  const github = safeUrl(project.githubUrl), live = safeUrl(project.liveUrl);
  const slug = slugFor(project);
  return <article className={'project-card' + (featured ? ' featured-project' : '')}><div className="project-cover-link"><ProjectPreview project={project} index={index} /></div><div className="project-body"><p className="project-index mono">{String(index + 1).padStart(2, '0')} / {featured ? 'FEATURED BUILD' : 'PROJECT'}{visibleText(project.status) && <span className="badge">{project.status}</span>}</p><h3><Link to={'/projects/' + slug}>{project.name}</Link></h3><p className="project-summary">{projectSummary(project)}</p><ul className="project-tech" aria-label="Technologies">{(project.tech || []).map(tech => <li key={tech}>{tech}</li>)}</ul><div className="project-links"><Link className="case-link" to={'/projects/' + slug}>Case study<span className="sr-only">: {project.name}</span><span aria-hidden="true"> +</span></Link>{github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only">: {project.name}</span></a>}{live && <a href={live} target="_blank" rel="noopener noreferrer">Live demo<span className="sr-only">: {project.name}</span></a>}</div></div></article>;
}
