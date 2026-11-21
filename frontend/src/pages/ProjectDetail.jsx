import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent, slugFor, visibleText } from '../lib/content';
import { safeUrl } from '../lib/api';
import ProjectPreview from '../components/ui/ProjectPreview';
import Modal from '../components/ui/Modal';
import NotFound from './NotFound';
function Screenshot({ shot, onOpen }) {
  const [failed, setFailed] = useState(false);
  return failed ? <p className="service-state">Screenshot unavailable.</p> : <button className="gallery-image" onClick={onOpen} aria-label={'Enlarge: ' + shot.alt}><img src={shot.url} alt={shot.alt} width="960" height="600" loading="lazy" onError={() => setFailed(true)} /></button>;
}
export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects } = useContent();
  const [selected, setSelected] = useState(null);
  const project = projects.find(item => slugFor(item) === slug);
  if (!project) return <NotFound />;
  const index = projects.indexOf(project);
  const gallery = (project.screenshots || []).filter(item => safeUrl(item.url));
  const next = projects[(index + 1) % projects.length];
  return <main id="main-content" className="container project-detail"><Link to="/#projects" className="back-link">← All projects</Link><p className="eyebrow">PROJECT {String(index + 1).padStart(2, '0')} / CASE STUDY</p><h1>{project.name}</h1><p className="detail-intro">{project.summary || project.description}</p><ul className="project-tech">{project.tech.map(item => <li key={item}>{item}</li>)}</ul><div className="actions">{safeUrl(project.githubUrl) && <a className="button primary" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View GitHub repository</a>}{safeUrl(project.liveUrl) && <a className="button secondary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live demo</a>}</div><ProjectPreview key={project._id} project={project} index={index} /><div className="case-grid">{[['problem', 'The problem'], ['solution', 'The solution'], ['role', 'My role'], ['features', 'Key features'], ['architecture', 'Architecture'], ['challenges', 'Engineering challenges'], ['learning', 'What I learned']].map(([field, title]) => <section key={field}><h2>{title}</h2><p className={!visibleText(project[field]) ? 'muted' : ''}>{visibleText(project[field]) ? project[field] : 'Detailed notes coming soon.'}</p></section>)}</div><section className="gallery-section"><h2>Inside the project</h2>{gallery.length ? <div className="screenshot-gallery">{gallery.map((shot, i) => <Screenshot key={shot.url} shot={shot} onOpen={() => setSelected(i)} />)}</div> : <p className="service-state">Screenshots are on their way. Explore the project description and available source code in the meantime.</p>}</section><Link to={'/projects/' + slugFor(next)} className="next-project"><span className="mono">NEXT IN THE COLLECTION</span><strong>{next.name}</strong></Link>{selected !== null && <Modal title="Project screenshot" onClose={() => setSelected(null)} className="lightbox"><img src={gallery[selected].url} alt={gallery[selected].alt} /><p>{gallery[selected].alt}</p><div className="actions"><button className="button secondary" onClick={() => setSelected((selected + gallery.length - 1) % gallery.length)}>Previous</button><span aria-live="polite">{selected + 1} / {gallery.length}</span><button className="button secondary" onClick={() => setSelected((selected + 1) % gallery.length)}>Next</button></div></Modal>}</main>;
}
