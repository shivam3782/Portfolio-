const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const checkAdmin = require('../middleware/checkAdmin');
const { presentProjects, rankForPosition } = require('../lib/projectPresentation');
const { validateProject } = require('../lib/projectValidation');

router.get('/session', checkAdmin, (req, res) => res.json({ authenticated: true }));

router.get('/', async (req, res) => {
  try { res.json(presentProjects(await Project.find())); }
  catch { res.status(503).json({ error: 'The project library is temporarily unavailable.' }); }
});

router.post('/', checkAdmin, async (req, res) => {
  const { data, errors } = validateProject(req.body, true);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Check the highlighted fields.', errors });
  try {
    const projects = await Project.find();
    data.order = rankForPosition(projects, data, req.body.position);
    const saved = await new Project(data).save();
    res.status(201).json(saved);
  } catch { res.status(400).json({ error: 'The project could not be saved. Your form can be retried.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch { res.status(400).json({ error: 'Invalid project identifier.' }); }
});

router.put('/:id', checkAdmin, async (req, res) => {
  const { data, errors } = validateProject(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Check the highlighted fields.', errors });
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    const projects = await Project.find();
    const current = typeof existing.toObject === 'function' ? existing.toObject() : existing;
    data.order = rankForPosition(projects, { ...current, ...data }, req.body.position);
    const updated = await Project.findByIdAndUpdate(req.params.id, { $set: data }, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch { res.status(400).json({ error: 'The project could not be updated. Your form has been kept.' }); }
});

router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch { res.status(400).json({ error: 'The project could not be deleted.' }); }
});

module.exports = router;
