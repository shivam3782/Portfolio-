import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sections } from "../data/content";
import { useContent, slugFor, assetUrl } from "../lib/content";
import { safeUrl } from "../lib/api";
import Modal from "./ui/Modal";
export default function CommandPalette({ open, onClose, onTheme }) {
  const { profile, projects } = useContent();
  const [query, setQuery] = useState(""),
    [notice, setNotice] = useState("");
  const ref = useRef(null),
    navigate = useNavigate();
  if (!open) return null;
  const commands = [
    { label: "Toggle color theme", action: onTheme },
    { label: "Go to Home", path: "/#home" },
    ...sections.map(([id, label]) => ({
      label: `Go to ${label}`,
      path: "/#" + id,
    })),
    ...projects.map((project) => ({
      label: project.name,
      path: "/projects/" + slugFor(project),
    })),
    {
      label: "Download resume",
      href: assetUrl(profile.resumeUrl),
      download: true,
    },
    {
      label: "Copy email",
      action: async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setNotice("Email copied.");
        } catch {
          setNotice("Email: " + profile.email);
        }
      },
      stay: true,
    },
    { label: "Email Shivam", href: "mailto:" + profile.email },
    { label: "Open GitHub", href: safeUrl(profile.githubUrl) },
    { label: "Open LinkedIn", href: safeUrl(profile.linkedinUrl) },
  ].filter(
    (command) =>
      (command.href || command.path || command.action) &&
      command.label.toLowerCase().includes(query.toLowerCase()),
  );
  const keys = (event) => {
    const buttons = [
      ...ref.current.querySelectorAll(
        ".command-results button, .command-results a",
      ),
    ];
    const current = buttons.indexOf(document.activeElement);
    if (["ArrowDown", "ArrowUp"].includes(event.key) && buttons.length) {
      event.preventDefault();
      buttons[
        event.key === "ArrowDown"
          ? (current + 1) % buttons.length
          : (current <= 0 ? buttons.length : current) - 1
      ].focus();
    }
    if (event.key === "Enter" && event.target.id === "command-search") {
      event.preventDefault();
      buttons[0]?.click();
    }
  };
  return (
    <Modal title="Game menu" onClose={onClose} className="command-dialog">
      <div ref={ref} onKeyDown={keys}>
        <label className="sr-only" htmlFor="command-search">
          Search commands
        </label>
        <input
          autoFocus
          id="command-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a section, project or action…"
          autoComplete="off"
        />
        <div className="command-results">
          {commands.map((command) =>
            command.href ? (
              <a
                key={command.label}
                href={command.href}
                download={command.download || undefined}
                target={command.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={onClose}
              >
                {command.label}
              </a>
            ) : (
              <button
                key={command.label}
                onClick={() => {
                  if (command.path) navigate(command.path);
                  else command.action();
                  if (!command.stay) onClose();
                }}
              >
                {command.label}
                <span aria-hidden="true">↵</span>
              </button>
            ),
          )}
          {!commands.length && <p>No matching commands.</p>}
        </div>
        <p className="command-hint">↑ ↓ Navigate · Enter Select · Esc Close</p>
        <p role="status">{notice}</p>
      </div>
    </Modal>
  );
}
