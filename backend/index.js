require('dotenv').config({ quiet: true });
const dns = require('node:dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { serverConfig } = require('./lib/serverConfig');
const projectRoutes = require('./routes/projectRoutes');

async function start() {
  if (!process.env.MONGO_URI || !process.env.ADMIN_KEY) throw new Error('Backend environment is incomplete.');
  const config = serverConfig();
  if (config.dnsServers.length) dns.setServers(config.dnsServers);
  const app = express();
  app.use(cors(config.cors));
  app.use(express.json());
  // Project data and access verification must never be cached by a frontend reverse proxy.
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.get('/', (_req, res) => res.send('Hello from my backend!'));
  app.use('/api/projects', projectRoutes);

  // Do not advertise readiness before the database is available.
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  app.listen(config.port, '0.0.0.0', () => console.log('Backend ready; MongoDB connected; listening on port ' + config.port));
}

start().catch(async () => {
  console.error('Backend startup failed. Check required environment variables, PORT/CORS settings and MongoDB network/DNS access.');
  await mongoose.disconnect();
  process.exitCode = 1;
});
