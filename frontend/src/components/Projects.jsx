import { useState } from "react";
import { useContent } from "../lib/content";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";
import { findProjects } from "../lib/projects";
export default function Projects() {
  const { projects, status, retry } = useContent();
  const [query, setQuery] = useState("");
  const visible = findProjects(projects, query);
  return (
    <section id="projects" className="section projects-section">
      <SectionHeading
        number="02"
        title="Select your next adventure"
        tag="Selected projects"
      >
        Real problems. Thoughtful builds. A look at the ideas I’ve taken from
        curiosity to code.
      </SectionHeading>
      <div className="project-toolbar">
        <span className="mono">
          {String(projects.length).padStart(2, "0")} PROJECTS IN THE COLLECTION
        </span>
        <label className="project-search">
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection…"
          />
        </label>
      </div>
      {status === "cached" && (
        <p className="cache-note" role="status">
          Showing saved portfolio content.{" "}
          <button onClick={retry}>Retry live update</button>
        </p>
      )}
      <div className="project-gallery">
        {visible.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            index={projects.indexOf(project)}
            featured={projects.indexOf(project) === 0}
          />
        ))}
      </div>
      {!visible.length && (
        <div className="service-state">
          <h3>No matching projects.</h3>
          <button className="button secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
