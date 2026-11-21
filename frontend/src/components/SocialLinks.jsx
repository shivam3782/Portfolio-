import { useContent } from "../lib/content";
import { safeUrl } from "../lib/api";
import Icon from "./Icon";
export default function SocialLinks() {
  const { profile } = useContent();
  return (
    <div className="social-links">
      {[
        ["github", "GitHub", safeUrl(profile.githubUrl)],
        ["linkedin", "LinkedIn", safeUrl(profile.linkedinUrl)],
        ["mail", "Email", profile.email ? "mailto:" + profile.email : null],
      ].map(
        ([icon, label, href]) =>
          href && (
            <a
              key={icon}
              href={href}
              target={icon === "mail" ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <Icon name={icon} size={18} />
              {label}
            </a>
          ),
      )}
    </div>
  );
}
