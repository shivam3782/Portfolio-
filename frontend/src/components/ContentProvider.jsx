import { useCallback, useEffect, useState } from "react";
import { ContentContext, defaultContent, orderProjects } from "../lib/content";
import { contentRequest, projectRequest } from "../lib/api";
function initial(content) {
  if (content) return content;
  try {
    const seed = document.getElementById("portfolio-data");
    if (seed) return JSON.parse(seed.textContent);
  } catch {
    /* Static snapshot is optional in development. */
  }
  return defaultContent;
}
export default function ContentProvider({ children, initialContent }) {
  const [content, setContent] = useState(() => initial(initialContent));
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let cached;
    try {
      const saved = JSON.parse(localStorage.getItem("portfolio-content-v1"));
      if (
        saved?.profile?.name &&
        Array.isArray(saved.profile.education) &&
        Array.isArray(saved.projects) &&
        saved.projects.every(
          (p) => typeof p.name === "string" && Array.isArray(p.tech),
        )
      )
        cached = saved;
    } catch {
      /* Bundled content remains available. */
    }
    const timeout = setTimeout(() => controller.abort(), 8000);
    Promise.allSettled([
      contentRequest("/profile", { signal: controller.signal }),
      projectRequest("", { signal: controller.signal }),
    ])
      .then(([profileResult, projectsResult]) => {
        if (!active) return;
        const profile =
          profileResult.status === "fulfilled" &&
          profileResult.value?.name &&
          Array.isArray(profileResult.value.education) &&
          profileResult.value.skills
            ? profileResult.value
            : null;
        const projects =
          projectsResult.status === "fulfilled" &&
          Array.isArray(projectsResult.value) &&
          projectsResult.value.every(
            (p) => typeof p.name === "string" && Array.isArray(p.tech),
          )
            ? orderProjects(projectsResult.value)
            : null;
        setContent((current) => {
          const next = {
            profile: profile || cached?.profile || current.profile,
            projects: projects || cached?.projects || current.projects,
          };
          try {
            localStorage.setItem("portfolio-content-v1", JSON.stringify(next));
          } catch {
            /* Private browsing and full storage retain the bundled fallback. */
          }
          return next;
        });
        setStatus(profile && projects ? "ready" : "cached");
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [attempt]);
  return (
    <ContentContext.Provider value={{ ...content, status, retry }}>
      {children}
    </ContentContext.Provider>
  );
}
