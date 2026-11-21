import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/content";
import ResumeLink from "./ui/ResumeLink";
import SocialLinks from "./SocialLinks";
const RetroScene = lazy(() => import("./sections/RetroScene"));
function StaticScene() {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet="/scene-mobile-dark.webp" />
      <img
        className="static-scene"
        src="/scene-desktop-dark.webp"
        width="1000"
        height="1000"
        fetchPriority="high"
        alt="An isometric retro computer displaying a pixel mountain landscape and Ready to build"
      />
    </picture>
  );
}
export default function Hero() {
  const { profile } = useContent();
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    const smallScreen = matchMedia("(max-width: 767px)");
    const reset = () => {
      if (smallScreen.matches) setInteractive(false);
    };
    smallScreen.addEventListener("change", reset);
    return () => smallScreen.removeEventListener("change", reset);
  }, []);
  const activate = (event) => {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)")
        .matches ||
      navigator.connection?.saveData ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      document.documentElement.dataset.effects === "off"
    )
      return;
    setInteractive(true);
  };
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">PLAYER ONE / {profile.role}</span>
        {profile.availability && (
          <span className="availability">
            <i />
            {profile.availability}
          </span>
        )}
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-intro">Hello, world. I’m</p>
          <h1 id="hero-title">
            {profile.name.split(" ")[0]}
            <br />
            <span>
              {profile.name.split(" ").slice(1).join(" ")}
              <span className="pixel-dot">.</span>
            </span>
          </h1>
          <p className="hero-role">{profile.tagline}</p>
          <p className="hero-statement">{profile.valueProposition}</p>
          <div className="actions">
            <Link to="/#projects" className="button primary">
              <span aria-hidden="true">▶</span> View projects
            </Link>
            <ResumeLink />
          </div>
          <SocialLinks />
        </div>
        <div className="scene-shell" onPointerEnter={activate}>
          <div className="scene-tag">
            <span className="mono">Developer Mode</span>
            <span>Always exploring.</span>
          </div>
          {interactive ? (
            <Suspense fallback={<StaticScene />}>
              <RetroScene />
            </Suspense>
          ) : (
            <StaticScene />
          )}
          <span className="scene-coordinate mono">⌘ / A LITTLE CURIOSITY</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="mono">
          BUILD. LEARN. <span className="accent">LEVEL UP.</span>
        </span>
        <span>{profile.location}</span>
        <Link to="/#about">
          Scroll to explore <span aria-hidden="true">↓</span>
        </Link>
      </div>
    </section>
  );
}
