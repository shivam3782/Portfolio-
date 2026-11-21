import { useEffect, useState } from 'react';
export default function Inbox({ api, onUnauthorized }) {
  const [messages, setMessages] = useState(null), [error, setError] = useState(''), [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    api('/messages').then(data => { if (active) { setMessages(data); setError(''); } }).catch(failure => { if (active) { setError('Inbox could not be loaded. Retry or verify access.'); if (failure.status === 401) onUnauthorized(); } });
    return () => { active = false; };
  }, [api, attempt, onUnauthorized]);
  return <section><h2>Contact inbox</h2><p>Latest 100 messages, stored privately in MongoDB. Reply using the sender’s email.</p><button className="button secondary" onClick={() => setAttempt(value => value + 1)}>Refresh inbox</button>{error && <p role="alert">{error}</p>}{!messages && !error && <p role="status">Loading messages…</p>}{messages?.length === 0 && <p>No messages yet.</p>}{messages?.map(message => <article className="inbox-message" key={message._id}><h3>{message.name}</h3><a href={'mailto:' + message.email}>{message.email}</a><p><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time></p><p>{message.message}</p></article>)}</section>;
}
