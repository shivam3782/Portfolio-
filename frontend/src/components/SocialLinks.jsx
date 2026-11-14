import { links } from '../data/content';
import Icon from './Icon';
export default function SocialLinks({
  buttons = false
}) {
  return <div className={buttons ? 'actions contact-actions' : 'social-links'}>{[['github', 'View GitHub', 'GitHub'], ['linkedin', 'LinkedIn', 'LinkedIn — Shivam Sharma'], ['mail', 'Email Me', 'Email Shivam']].map(([icon, label, accessible]) => {
      const href = icon === 'mail' ? links.email : links[icon];
      return href ? <a key={icon} className={buttons ? 'button secondary' : 'icon-button'} href={href} target={icon === 'mail' ? undefined : '_blank'} rel="noreferrer" aria-label={accessible}><Icon name={icon} />{buttons && label}</a> : <button key={icon} className={buttons ? 'button secondary' : 'icon-button'} disabled aria-label="LinkedIn — profile URL not supplied" title="LinkedIn — profile URL not supplied"><Icon name={icon} />{buttons ? 'LinkedIn (URL needed)' : null}</button>;
    })}{buttons && <a className="button secondary" href={links.cv} download><Icon name="down" />Download CV</a>}</div>;
}
