import { useContent, assetUrl } from "../../lib/content";
import { contentRequest } from "../../lib/api";
export default function ResumeLink({
  className = "button secondary",
  children = "Download resume",
  onClick,
}) {
  const { profile } = useContent();
  const url = assetUrl(profile.resumeUrl);
  if (!url) return null;
  return (
    <a
      className={className}
      href={url}
      download
      onClick={() => {
        onClick?.();
        if (import.meta.env.VITE_ANALYTICS_ENABLED === "true")
          contentRequest("/events/resume", {
            method: "POST",
            keepalive: true,
          }).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
