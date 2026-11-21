import { skills } from '../data/content';
import Icon from './Icon';

const icons = { Languages: 'code', Frontend: 'overview', Backend: 'folder', Databases: 'database', 'ML/AI': 'spark', Tools: 'bolt' };

export default function Skills() {
  return (
    <section id="skills" className="studio-section" aria-labelledby="skills-title">
      <h2 id="skills-title" className="studio-heading">Technical toolkit</h2>
      <div className="toolkit-grid">
        {Object.entries(skills).map(([group, items]) => (
          <article key={group}>
            <Icon name={icons[group]} size={23} />
            <h3>{group}</h3>
            <p>{items.join(' · ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
