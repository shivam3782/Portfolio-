const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { serverConfig } = require('./lib/serverConfig');
function createApp() {
  const app = express();
  if (process.env.TRUST_PROXY_HOPS) app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
  app.use(helmet());
  app.use(cors(serverConfig().cors));
  app.use(express.json({ limit: '128kb' }));
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use('/api/projects/session', rateLimit({ windowMs: 15 * 60000, limit: 30, legacyHeaders: false }));
  app.get('/', (_req, res) => res.send('Hello from my backend!'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api', require('./routes/contentRoutes'));
  app.use((error, _req, res, _next) => res.status(error.status === 413 ? 413 : 400).json({ error: 'The request could not be processed.' }));
  return app;
}
module.exports = { createApp };
