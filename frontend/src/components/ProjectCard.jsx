import { useState } from 'react';
import { safeUrl } from '../lib/api';
import Icon from './Icon';
import ProjectIllustration from './ProjectIllustration';
import { projectSummary } from '../lib/projects';

export default function ProjectCard({ project, index, featured = false, compact = false }) {
  const [failedImage, setFailedImage] = useState(null);
  const image = safeUrl(project.imageUrl);
  const github = safeUrl(project.githubUrl);
  const live = safeUrl(project.liveUrl);
  const description = project.description || '';
  const boundary = description.search(/\. (?=[A-Z])/);
  const summary = projectSummary(project);
  const details = project.summary?.trim() ? description : boundary > 35 ? description.slice(boundary + 2) : '';
  return <article className={'project-card' + (featured ? ' featured-project' : '')}>
    {!compact && <div className="project-art">{image && image !== failedImage ? <img src={image} alt={project.name + ' project preview'} loading="lazy" decoding="async" width="960" height="570" onError={() => setFailedImage(image)} /> : <ProjectIllustration name={project.name} />}</div>}
    <div className="project-body">
      <p className="project-index mono">{featured ? 'Featured project' : 'Project ' + (index + 1)}</p>
      <h3>{project.name}</h3><p className="project-summary">{summary}</p>
      <ul className="project-tech" aria-label="Technologies">{(project.tech || []).map(t => <li key={t}>{t}</li>)}</ul>
      {details && <details className="project-details"><summary>Engineering notes<span aria-hidden="true">+</span></summary><p>{details}</p></details>}
      {(github || live) && <div className="project-links">{github && <a href={github} target="_blank" rel="noreferrer"><Icon name="github" size={18} />View source<Icon name="arrow" size={16} /><span className="sr-only"> for {project.name}</span></a>}{live && <a href={live} target="_blank" rel="noreferrer">Live project<Icon name="arrow" size={18} /><span className="sr-only">: {project.name}</span></a>}</div>}
    </div>
  </article>;
}

