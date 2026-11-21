import { safeUrl } from './api';

export function projectSummary(project) {
  if (project.summary?.trim()) return project.summary.trim();
  const description = project.description || '';
  const boundary = description.search(/\. (?=[A-Z])/);
  return boundary > 35 ? description.slice(0, boundary + 1) : description;
}

export function findProjects(projects, query = '', sort = 'portfolio') {
  const term = query.trim().toLocaleLowerCase();
  const visible = projects.filter(project => [project.name, project.summary, project.description, ...(project.tech || [])].join(' ').toLocaleLowerCase().includes(term));
  return sort === 'name' ? visible.sort((a, b) => a.name.localeCompare(b.name)) : visible;
}

export function projectMetrics(projects) {
  return { total: projects.length, missingImages: projects.filter(p => !safeUrl(p.imageUrl)).length, missingDemos: projects.filter(p => !safeUrl(p.liveUrl)).length };
}

export function positionBounds(projects, project) {
  const count = projects.length + (project ? 0 : 1);
  return project?.orderLocked ? { min: 1, max: count } : { min: projects[0]?.orderLocked === 'first' ? 2 : 1, max: Math.max(1, count - (projects.at(-1)?.orderLocked === 'last' ? 1 : 0)) };
}

export function validateDraft(form, bounds = { min: 1, max: 10000 }) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Give this project a name.';
  if (form.name.length > 120) errors.name = 'Use 120 characters or fewer.';
  if (form.summary.length > 240) errors.summary = 'Keep your summary under 240 characters.';
  if (!form.description.trim()) errors.description = 'Describe what you built.';
  if (form.description.length > 10000) errors.description = 'Use 10,000 characters or fewer.';
  if (form.tech.length > 40 || form.tech.some(t => !t.trim() || t.length > 60)) errors.tech = 'Use up to 40 technology names, each 1–60 characters.';
  for (const key of ['githubUrl', 'liveUrl', 'imageUrl']) if (form[key].trim() && !safeUrl(form[key].trim())) errors[key] = 'Enter a complete https:// or http:// URL.';
  if (!Number.isInteger(Number(form.position)) || Number(form.position) < bounds.min || Number(form.position) > bounds.max) errors.position = 'Choose a whole-number position from ' + bounds.min + ' to ' + bounds.max + '.';
  if (form.gallery) { const shots = form.gallery.split('\n').filter(line => line.trim()); if (shots.length > 12 || shots.some(line => { const [url, ...alt] = line.split(' | '); return !safeUrl(url.trim()) || !alt.join(' | ').trim() || alt.join(' | ').length > 240; })) errors.gallery = 'Use up to 12 lines: image URL | descriptive alt text.'; }
  return errors;
}
