import { certifications } from '../data/content';
import Icon from './Icon';

export default function Certifications() {
  return (
    <section id="proof" className="studio-section">
      <h2 className="studio-heading">Certifications</h2>
      <ul className="credential-grid">
        {certifications.map(item => <li key={item}><Icon name="award" size={22} /><span>{item}</span></li>)}
      </ul>
    </section>
  );
}
