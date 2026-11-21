import { useEffect, useRef, useState } from 'react';
import { Link, useBeforeUnload, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { positionBounds, validateDraft } from '../../lib/projects';
import Icon from '../Icon';
import ConfirmDialog from './ConfirmDialog';
import ProjectMedia from './ProjectMedia';
import TechnologyPicker from './TechnologyPicker';

function makeDraft(project, projects) {
  const last = projects.at(-1);
  return { ...Object.fromEntries(['status', 'problem', 'solution', 'role', 'features', 'architecture', 'challenges', 'learning'].map(key => [key, project?.[key] || (key === 'status' ? '' : 'TODO: add ' + key + '.')])), gallery: (project?.screenshots || []).map(shot => shot.url + ' | ' + shot.alt).join('\n'), name: project?.name || '', summary: project?.summary || '', description: project?.description || '', tech: project?.tech || [], imageUrl: project?.imageUrl || '', githubUrl: project?.githubUrl || '', liveUrl: project?.liveUrl || '', position: project ? project.position || projects.indexOf(project) + 1 : (last?.orderLocked === 'last' ? Math.max(1, projects.length) : projects.length + 1) };
}

function Field({ label, name, form, onChange, error, hint, area = false, ...props }) {
  const Element = area ? 'textarea' : 'input';
  return <div className="editor-field"><label htmlFor={'editor-' + name}>{label}</label>{hint && <p className="field-hint" id={name + '-hint'}>{hint}</p>}<Element id={'editor-' + name} name={name} value={form[name]} onChange={event => onChange(name, event.target.value)} aria-invalid={!!error} aria-describedby={[hint && name + '-hint', error && name + '-error'].filter(Boolean).join(' ') || undefined} {...props} />{error && <p className="field-error" id={name + '-error'}>{error}</p>}</div>;
}

export default function ProjectEditor({ projects, api, onSaved, onUnauthorized }) {
  const { id } = useParams();
  const project = projects.find(p => p._id === id);
  const [form, setForm] = useState(() => makeDraft(project, projects));
  const [baseline, setBaseline] = useState(() => JSON.stringify(makeDraft(project, projects)));
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(form.imageUrl);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const bounds = positionBounds(projects, project);
  const dirty = JSON.stringify(form) !== baseline;
  const blocker = useBlocker(({ currentLocation, nextLocation }) => (dirty || busy) && (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search));
  useBeforeUnload(event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
  useEffect(() => { const timer = setTimeout(() => setPreviewUrl(form.imageUrl), 450); return () => clearTimeout(timer); }, [form.imageUrl]);
  useEffect(() => { if (saved) navigate('/admin/projects'); }, [saved, navigate]);
  const change = (name, value) => { setForm(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: undefined })); };
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateDraft(form, bounds);
    setErrors(nextErrors); setFailure('');
    if (Object.keys(nextErrors).length) { requestAnimationFrame(() => formRef.current.querySelector('[aria-invalid=true]')?.focus()); return; }
    setBusy(true);
    try {
      const payload = { ...form, name: form.name.trim(), summary: form.summary.trim(), description: form.description.trim(), position: Number(form.position), screenshots: form.gallery.split('\n').filter(line => line.trim()).map(line => { const [url, ...alt] = line.split(' | '); return { url: url.trim(), alt: alt.join(' | ').trim() }; }) };
      delete payload.gallery;
      await api(id ? '/' + encodeURIComponent(id) : '', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setBaseline(JSON.stringify(form));
      setSaved(true);
      onSaved(id ? 'Project updated. Your portfolio is up to date.' : 'Project created. It’s now in your portfolio.');
    } catch (error) {
      setFailure(error.status === 401 ? 'Access needs to be verified again. Your changes are still here.' : Object.keys(error.fields || {}).length ? 'Check the highlighted fields. Your changes are still here.' : 'We couldn’t confirm the save. Your changes are still here. Check the library before retrying to avoid duplicates.');
      setErrors(error.fields || {});
      if (Object.keys(error.fields || {}).length) requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid=true]')?.focus());
      if (error.status === 401) onUnauthorized();
    } finally { setBusy(false); }
  };
  if (id && !project) return <div className="library-empty"><h2>Project not found</h2><p>It may have been removed. Refresh the library to check.</p><Link className="button secondary" to="/admin/projects">Return to projects</Link></div>;
  const positionHint = project?.orderLocked ? 'This project is kept ' + project.orderLocked + ' in the portfolio.' : 'Choose a position between the pinned opening and closing projects. Other projects keep their relative order.';
  return <><div className="editor-breadcrumb"><Link to="/admin/projects"><Icon name="chevron-left" size={16} />Projects</Link><span>/</span><span>{id ? 'Edit project' : 'New project'}</span><span className={'draft-state' + (dirty ? ' unsaved' : '')}>{busy ? 'Saving…' : dirty ? 'Unsaved changes' : 'No unsaved changes'}</span></div>
    <form ref={formRef} className="project-editor" onSubmit={submit} noValidate>
      <div className="editor-main"><section className="editor-section"><div className="editor-section-heading"><span>01</span><div><h2>The essentials</h2><p>Introduce the project and the problem it solves.</p></div></div><fieldset disabled={busy}><Field label="Project name" name="name" form={form} onChange={change} error={errors.name} placeholder="A name worth remembering" maxLength={120} required /><Field label="Short summary" name="summary" form={form} onChange={change} error={errors.summary} hint="One clear sentence for the project card. Optional; your description is used when empty." placeholder="What did you build, and why does it matter?" maxLength={240} /><Field label="Full description" name="description" form={form} onChange={change} error={errors.description} hint="Explain the problem, your contribution, and the important engineering decisions." area rows={7} maxLength={10000} required /></fieldset></section>
      <section className="editor-section"><h2>Case study</h2><fieldset disabled={busy}>{[['status', 'Project status'], ['problem', 'The problem'], ['solution', 'The solution'], ['role', 'My role'], ['features', 'Key features'], ['architecture', 'Architecture'], ['challenges', 'Challenges'], ['learning', 'What I learned']].map(([name, label]) => <Field key={name} label={label} name={name} form={form} onChange={change} error={errors[name]} area rows={name === 'status' ? 1 : 4} maxLength={name === 'status' ? 100 : name === 'role' ? 1000 : 10000} />)}<Field label="Screenshot gallery" name="gallery" form={form} onChange={change} error={errors.screenshots || errors.gallery} area rows={5} hint="One screenshot per line: https://example.com/image.webp | Descriptive alt text. Maximum 12. Blank means coming soon." /></fieldset></section><section className="editor-section"><div className="editor-section-heading"><span>02</span><div><h2>The stack</h2><p>Give your technical work the right context.</p></div></div><TechnologyPicker value={form.tech} options={[...new Set(projects.flatMap(p => p.tech || []))]} onChange={tech => change('tech', tech)} error={errors.tech} disabled={busy} /></section>
      <section className="editor-section"><div className="editor-section-heading"><span>03</span><div><h2>Project links</h2><p>Only add destinations that are ready to visit.</p></div></div><fieldset disabled={busy} className="editor-link-fields"><Field label="GitHub repository" name="githubUrl" form={form} onChange={change} error={errors.githubUrl} type="url" placeholder="https://github.com/you/project" /><Field label="Live demo" name="liveUrl" form={form} onChange={change} error={errors.liveUrl} type="url" hint="Optional. Leave empty if no demo is available." placeholder="https://your-project.com" /></fieldset></section></div>
      <aside className="editor-aside"><section className="editor-section"><div className="editor-section-heading"><span>04</span><div><h2>Project preview</h2><p>Show the real thing, when it’s available.</p></div></div><ProjectMedia key={previewUrl} url={previewUrl} name={form.name || 'Your project'} /><Field label="Image URL" name="imageUrl" form={form} onChange={change} error={errors.imageUrl} type="url" disabled={busy} hint="A direct image URL. This editor supports links, not uploads." placeholder="https://example.com/screenshot.png" /><p className="field-hint">Missing or broken images fall back to labeled concept artwork.</p></section>
      <section className="editor-section"><div className="editor-section-heading"><span>05</span><div><h2>Portfolio placement</h2><p>Keep the project story in the right order.</p></div></div><Field label="Display position" name="position" form={form} onChange={change} error={errors.position} type="number" min={bounds.min} max={bounds.max} disabled={busy || !!project?.orderLocked} hint={positionHint} /><div className="placement-note"><Icon name="lock" size={15} /><p>Proactive Insurance first.<br />ARNav last.</p></div></section></aside>
      <div className="editor-savebar">{failure && <p role="alert" className="editor-save-error">{failure}</p>}<span>{dirty ? 'You have unsaved changes.' : id ? 'All changes are saved.' : 'Ready when you are.'}</span><div className="actions"><Link className="button secondary" to="/admin/projects">Cancel</Link><button type="submit" className="button primary" disabled={busy || saved}>{busy ? <><span className="admin-spinner" />Saving…</> : <><Icon name="check" size={18} />{id ? 'Save changes' : 'Create project'}</>}</button></div></div>
    </form>
    {blocker.state === 'blocked' && <ConfirmDialog title={busy ? 'Your save is in progress' : 'Leave without saving?'} confirm="Discard changes" cancel="Keep editing" onConfirm={() => blocker.proceed()} onCancel={() => blocker.reset()} allowConfirm={!busy}><p>{busy ? 'Wait for the save to finish before leaving this project.' : 'Your unsaved changes will be lost. You can stay here and keep working.'}</p></ConfirmDialog>}
  </>;
}
