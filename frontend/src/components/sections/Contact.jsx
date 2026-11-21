import { useRef, useState } from 'react';
import { useContent } from '../../lib/content';
import { contentRequest } from '../../lib/api';
import { validateContact } from '../../lib/contact';
import SectionHeading from '../SectionHeading';
import SocialLinks from '../SocialLinks';
export default function Contact() {
  const { profile } = useContent();
  const [values, setValues] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({}), [state, setState] = useState('idle'), [note, setNote] = useState(''), [copy, setCopy] = useState('');
  const ref = useRef(null);
  const submit = async event => {
    event.preventDefault();
    if (state === 'sending') return;
    const invalid = validateContact(values);
    setErrors(invalid); setNote('');
    if (Object.keys(invalid).length) { requestAnimationFrame(() => ref.current?.querySelector('[aria-invalid=true]')?.focus()); return; }
    setState('sending');
    try { const result = await contentRequest('/contact', { method: 'POST', body: JSON.stringify(values) }); setState('success'); setNote(result.message); setValues({ name: '', email: '', message: '', website: '' }); }
    catch (error) { setState('error'); setErrors(error.fields || {}); setNote(error.message); }
  };
  return <section id="contact" className="section contact-section"><SectionHeading number="06" tag="Start a conversation" title="Good work starts with hello" /><div className="contact-grid"><div className="contact-copy"><span className="contact-pixel" aria-hidden="true">✉</span><h3>Have a role, an idea,<br />or a good question?</h3><p>I’d love to hear about it. Let’s build something useful.</p><a className="email-link" href={'mailto:' + profile.email}>{profile.email}</a><button className="copy-email" onClick={async () => { try { await navigator.clipboard.writeText(profile.email); setCopy('Email copied.'); } catch { setCopy('Select the email address above to copy it.'); } }}>Copy email</button><span className="copy-status" role="status">{copy}</span><SocialLinks /><p className="privacy-note">Your message goes to my private inbox. Your details are only used to reply.</p></div><form ref={ref} onSubmit={submit} noValidate className="contact-form"><div className="form-window-bar mono"><span>NEW MESSAGE</span><span aria-hidden="true">_ □ ×</span></div><div className="form-fields">{[['name', 'Your name', 'text', 'Alex Morgan'], ['email', 'Email address', 'email', 'you@example.com'], ['message', 'What’s on your mind?', 'textarea', 'Tell me a little about it…']].map(([name, label, type, placeholder]) => { const Tag = type === 'textarea' ? 'textarea' : 'input'; return <div className="field" key={name}><label htmlFor={'contact-' + name}>{label}</label><Tag id={'contact-' + name} name={name} type={type === 'textarea' ? undefined : type} autoComplete={name === 'message' ? undefined : name} rows={type === 'textarea' ? 5 : undefined} maxLength={name === 'message' ? 5000 : name === 'name' ? 100 : 254} value={values[name]} placeholder={placeholder} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? name + '-contact-error' : undefined} onChange={event => { setValues(current => ({ ...current, [name]: event.target.value })); setErrors(current => ({ ...current, [name]: undefined })); }} />{errors[name] && <p className="field-error" id={name + '-contact-error'}>{errors[name]}</p>}</div>; })}<div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => setValues(current => ({ ...current, website: event.target.value }))} /></div><button type="submit" className="button primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Press start. Say hello.'}</button><div className={'form-result ' + state} role={state === 'error' ? 'alert' : 'status'}>{note}</div></div></form></div></section>;
}
