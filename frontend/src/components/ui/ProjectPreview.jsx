import { useState } from "react";
import { safeUrl } from "../../lib/api";
export default function ProjectPreview({ project, index = 0 }) {
  const [failed, setFailed] = useState(false);
  const image = safeUrl(project.imageUrl);
  if (image && !failed)
    return (
      <div className="project-art">
        <img
          src={image}
          alt={`${project.name} screenshot`}
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  const symbol = ["▤", "?", "✳", "▥", "⌖"][index % 5];
  return (
    <div className={`project-art placeholder-art art-${index % 5}`}>
      <span className="art-caption mono">
        WORK IN FOCUS / {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mini-cartridge" aria-hidden="true">
        <div className="cartridge-ridges" />
        <div className="cartridge-label">
          <span>{symbol}</span>
          <b>
            {
              ["POLICY GUARDIAN", "HANGMAN", "KRUSHIPAL", "CULTIVATE", "ARNAV"][
                index % 5
              ]
            }
          </b>
        </div>
        <div className="cartridge-contacts" />
      </div>
      <span className="preview-placeholder-label">Screenshot coming soon</span>
    </div>
  );
}
