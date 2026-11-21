import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { links, profile } from '../data/content';
import EngineeringScene from './EngineeringScene';
import Icon from './Icon';

export default function Hero() {
  const workbench = useRef(null);
  return (
    <section id="home" className="studio-hero" aria-labelledby="hero-title">
      <div className="studio-intro">
        <p className="studio-status"><i aria-hidden="true" />Open to opportunities</p>
        <h1 id="hero-title">Shivam <br /><em>Sharma.</em></h1>
        <p className="studio-bio">{profile.introduction}</p>
        <div className="studio-actions">
          <Link className="studio-button solid" to="/#projects">View projects <Icon name="arrow" size={17} /></Link>
          <a className="studio-button" href={links.cv} download>Résumé <Icon name="down" size={16} /></a>
        </div>
      </div>
      <figure className="studio-exhibit">
        <img src="/workbench.webp" width="1000" height="1000" fetchPriority="high" alt="An illustrated orange computer and pocket-sized robot on a sunlit drafting desk." />
        <figcaption>
          <span>The workbench</span>
          <button onClick={() => workbench.current.showModal()} aria-haspopup="dialog">Explore scene <Icon name="plus" size={17} /></button>
        </figcaption>
      </figure>
      <dialog ref={workbench} className="studio-dialog" aria-label="Interactive workbench">
        <div className="studio-dialog-bar"><strong>The interactive workbench</strong><button autoFocus onClick={() => workbench.current.close()}>Close ×</button></div>
        <EngineeringScene />
      </dialog>
    </section>
  );
}
