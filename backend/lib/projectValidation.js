const fields = { name: 120, summary: 240, description: 10000, githubUrl: 2048, liveUrl: 2048, imageUrl: 2048, status: 100, problem: 10000, solution: 10000, role: 1000, features: 10000, architecture: 10000, challenges: 10000, learning: 10000 };

function validateProject(body, create = false) {
  const data = {}, errors = {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { data, errors: { name: 'Enter valid project information.' } };
  for (const [field, maximum] of Object.entries(fields)) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== 'string') { errors[field] = 'Enter text for this field.'; continue; }
      data[field] = body[field].trim();
      if (data[field].length > maximum) errors[field] = 'Use ' + maximum + ' characters or fewer.';
    }
  }
  for (const field of ['name', 'description']) if ((create || field in data) && !data[field]) errors[field] = field === 'name' ? 'Give this project a name.' : 'Describe what you built.';
  for (const field of ['githubUrl', 'liveUrl', 'imageUrl']) {
    if (!data[field]) continue;
    try {
      const url = new URL(data[field]);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch { errors[field] = 'Enter a complete https:// or http:// URL.'; }
  }
  if (body.tech !== undefined) {
    if (!Array.isArray(body.tech) || body.tech.length > 40 || body.tech.some(t => typeof t !== 'string' || !t.trim() || t.trim().length > 60)) errors.tech = 'Use up to 40 technology names, each 1–60 characters.';
    else data.tech = [...new Map(body.tech.map(t => [t.trim().toLowerCase(), t.trim()])).values()];
  }
  if (body.position !== undefined && (!Number.isInteger(body.position) || body.position < 1 || body.position > 10000)) errors.position = 'Enter a whole-number portfolio position.';
  if (body.screenshots !== undefined) {
    const { validUrl } = require('./profileValidation');
    if (!Array.isArray(body.screenshots) || body.screenshots.length > 12 || body.screenshots.some(item => !item || typeof item.url !== 'string' || item.url.length > 2048 || !validUrl(item.url) || typeof item.alt !== 'string' || !item.alt.trim() || item.alt.length > 240)) errors.screenshots = 'Use up to 12 screenshots with valid HTTP(S) URLs and descriptive alt text.';
    else data.screenshots = body.screenshots.map(({ url, alt }) => ({ url: url.trim(), alt: alt.trim() }));
  }
  return { data, errors };
}
module.exports = { validateProject };
