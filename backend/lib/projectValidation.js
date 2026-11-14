const fields = { name: 120, summary: 240, description: 10000, githubUrl: 2048, liveUrl: 2048, imageUrl: 2048 };

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
  return { data, errors };
}
module.exports = { validateProject };
