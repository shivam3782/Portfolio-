const productionOrigins = [
  'https://shivam-sharma.me',
  'https://www.shivam-sharma.me',
  'https://portfolio-seven-pearl-51.vercel.app'
];

function serverConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port.');
  const defaults = [...productionOrigins, ...(production ? [] : ['http://localhost:5173'])];
  const origins = env.CORS_ORIGINS?.trim() ? env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean) : defaults;
  for (const origin of origins) {
    let url;
    try { url = new URL(origin); } catch { throw new Error('CORS_ORIGINS must contain exact HTTP(S) origins.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin || url.username || url.password) throw new Error('CORS_ORIGINS cannot contain wildcards, paths or credentials.');
  }
  const dnsServers = env.DNS_SERVERS?.trim() ? env.DNS_SERVERS.split(',').map(value => value.trim()).filter(Boolean) : production ? [] : ['8.8.8.8', '8.8.4.4'];
  return {
    port, dnsServers,
    cors: {
      origin(origin, callback) { callback(null, !origin || origins.includes(origin)); },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-admin-key'],
      optionsSuccessStatus: 204
    }
  };
}

module.exports = { serverConfig };
