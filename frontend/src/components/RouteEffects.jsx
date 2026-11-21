import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useContent, slugFor, assetUrl } from "../lib/content";
export default function RouteEffects() {
  const location = useLocation();
  const { profile, projects } = useContent();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (document.querySelector("dialog[open]")) return;
      const target = location.hash
        ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
        : document.getElementById("main-content");
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        if (location.hash)
          target.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        else window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);
  useEffect(() => {
    const project = projects.find(
      (p) => location.pathname === "/projects/" + slugFor(p),
    );
    const title = project
      ? `${project.name} | ${profile.name}`
      : location.pathname.startsWith("/admin")
        ? `Portfolio console | ${profile.name}`
        : location.pathname === "/"
          ? `${profile.name} | Software Engineer`
          : `Page not found | ${profile.name}`;
    document.title = title;
    const description =
      project?.summary || project?.description || profile.valueProposition;
    const canonical =
      (import.meta.env.VITE_SITE_URL || "https://www.shivam-sharma.me").replace(
        /\/$/,
        "",
      ) + location.pathname;
    for (const [selector, value] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', canonical],
      [
        'meta[property="og:image"]',
        new URL(assetUrl(profile.ogImage) || "/og-image.png", canonical).href,
      ],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ])
      document.querySelector(selector)?.setAttribute("content", value);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
  }, [location.pathname, profile, projects]);
  return null;
}
