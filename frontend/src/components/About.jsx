import { useState } from "react";
import { useContent, assetUrl } from "../lib/content";
import SectionHeading from "./SectionHeading";
export default function About() {
  const { profile } = useContent();
  const [failed, setFailed] = useState(false);
  return (
    <section id="about" className="section">
      <SectionHeading
        number="01"
        title="Curiosity is my default"
        tag="About me"
      />
      <div className="about-layout">
        <div className="player-card">
          <div className="portrait">
            {assetUrl(profile.photoUrl) && !failed ? (
              <img
                src={assetUrl(profile.photoUrl)}
                alt={profile.name}
                width="480"
                height="480"
                loading="lazy"
                onError={() => setFailed(true)}
              />
            ) : (
              <>
                <span className="pixel-avatar" aria-hidden="true">
                  s/
                </span>
                <span className="mono">THE PERSON BEHIND THE CODE</span>
              </>
            )}
          </div>
          <div className="player-card-caption">
            <strong>{profile.name}</strong>
            <span>{profile.location}</span>
          </div>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            A builder’s mindset.
            <br />
            <span className="muted">A learner’s curiosity.</span>
          </p>
          <p>{profile.about}</p>
          <p className="looking-for">{profile.lookingFor}</p>
          <div className="player-stats">
            {profile.stats?.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="practice-grid">
        {profile.aboutCards?.map((item, index) => (
          <article key={item.title}>
            <span className="practice-symbol" aria-hidden="true">
              {["</>", "✦", "+"][index % 3]}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
