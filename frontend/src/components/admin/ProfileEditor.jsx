import { useEffect, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
const labels = { name: 'Name', role: 'Role', tagline: 'Tagline', valueProposition: 'One-line value proposition', availability: 'Availability', location: 'Location', about: 'About story', lookingFor: 'What you are looking for', photoUrl: 'Photo URL', email: 'Contact email', githubUrl: 'GitHub URL', linkedinUrl: 'LinkedIn URL', resumeUrl: 'Resume PDF URL', ogImage: 'Open Graph image URL' };
const groups = { stats: 'Player stats: value, label', aboutCards: 'About cards: title, text', skills: 'Skills grouped by category', education: 'Education: degree, school, years, result', leadership: 'Leadership highlights', certifications: 'Certifications' };
export default function ProfileEditor({ api, onUnauthorized }) {
  const [form, setForm] = useState(null), [baseline, setBaseline] = useState(''), [error, setError] = useState(''), [errors, setErrors] = useState({}), [busy, setBusy] = useState(false), [notice, setNotice] = useState(''), [attempt, setAttempt] = useState(0);
  const dirty = form && JSON.stringify(form) !== baseline;
  const blocker = useBlocker(() => !!dirty || busy);
  useBeforeUnload(event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
  useEffect(() => {
    let active = true;
    api('/profile').then(data => { if (!active) return; const next = { ...data }; for (const key of Object.keys(groups)) next[key] = JSON.stringify(data[key], null, 2); setForm(next); setBaseline(JSON.stringify(next)); setError(''); }).catch(() => { if (active) setError('Could not load your profile.'); });
    return () => { active = false; };
  }, [api, attempt]);
  const save = async event => {
    event.preventDefault(); setError(''); setNotice(''); setErrors({});
    const payload = { ...form };
    for (const key of Object.keys(groups)) { try { payload[key] = JSON.parse(form[key]); } catch { setErrors({ [key]: 'Enter valid JSON. Your text is kept.' }); document.getElementById('profile-' + key)?.focus(); return; } }
    setBusy(true);
    try { await api('/profile', { method: 'PUT', body: JSON.stringify(payload) }); setBaseline(JSON.stringify(form)); setNotice('Profile saved. Reload the public site to see changes. Rebuild to refresh search and social previews.'); }
    catch (failure) { setErrors(failure.fields || {}); setError('Could not save. Your draft is kept.'); if (failure.status === 401) onUnauthorized(); }
    finally { setBusy(false); }
  };
  if (!form) return <div role="status">{error || 'Loading profile…'}{error && <button className="button secondary" onClick={() => setAttempt(value => value + 1)}>Retry</button>}</div>;
  return <><form className="profile-editor" onSubmit={save} noValidate><p>All public profile content lives here. Blank optional fields hide their links. Use your verified information only.</p><fieldset disabled={busy}>{Object.entries(labels).map(([key, label]) => <div className="field" key={key}><label htmlFor={'profile-' + key}>{label}</label><textarea id={'profile-' + key} rows={['about', 'valueProposition'].includes(key) ? 3 : 1} value={form[key]} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? 'profile-error-' + key : undefined} />{errors[key] && <p className="field-error" id={'profile-error-' + key}>{errors[key]}</p>}</div>)}<p>Resume: replace the existing public PDF at the same path, or paste a stable HTTPS PDF URL. Images support local public paths or HTTPS URLs.</p>{Object.entries(groups).map(([key, label]) => <details key={key} open={!!errors[key]}><summary>{label}</summary><label className="sr-only" htmlFor={'profile-' + key}>{label} JSON</label><textarea id={'profile-' + key} rows={10} spellCheck={false} value={form[key]} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} aria-invalid={!!errors[key]} /><p className="field-hint">Edit the structured JSON list. Keep field names. Empty arrays hide unfilled categories.</p>{errors[key] && <p className="field-error">{errors[key]}</p>}</details>)}</fieldset>{error && <p role="alert" className="field-error">{error}</p>}<p role="status">{notice}</p><button className="button primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></form>{blocker.state === 'blocked' && <ConfirmDialog title="Leave without saving?" confirm="Discard changes" cancel="Keep editing" allowConfirm={!busy} onConfirm={() => blocker.proceed()} onCancel={() => blocker.reset()}><p>{busy ? 'Wait for the save to finish.' : 'Your profile has unsaved changes.'}</p></ConfirmDialog>}</>;
}
