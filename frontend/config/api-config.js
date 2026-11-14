// Shared by Vite's build guard and the public request helper. No secrets belong here.
export function resolveApiOrigin(value = '', production = false) {
  const input = value.trim();
  if (!input || input === '/') return '';
  let url;
  try { url = new URL(input); } catch { throw new Error('VITE_API_URL must be an HTTP(S) origin, or empty for same-origin /api requests.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('VITE_API_URL must contain only an HTTP(S) origin, without credentials, query, fragment or /api suffix.');
  }
  const host = url.hostname.replace(/\.$/, '').toLowerCase();
  const loopback = host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0' || /^127\./.test(host) || host === '[::1]' || /^\[::ffff:7f/i.test(host);
  if (production && (url.protocol !== 'https:' || loopback)) throw new Error('Production VITE_API_URL must be a public HTTPS origin, or empty for the configured same-origin proxy.');
  return url.origin;
}
