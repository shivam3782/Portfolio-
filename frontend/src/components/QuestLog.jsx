import { useState, useEffect } from "react";

function QuestLog() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="font-pixel text-[#5fb8a8] p-8">LOADING QUEST LOG...</p>
    );
  if (error)
    return <p className="font-pixel text-red-400 p-8">ERROR: {error}</p>;

  return (
    <div className="min-h-screen bg-[#1a1435] p-8">
      <h2 className="font-pixel text-[#e8935a] text-xl mb-8">QUEST LOG</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-[#2d2547] border-2 border-[#5fb8a8] rounded-lg p-5"
          >
            <h3 className="font-pixel text-sm text-[#f4e8c1] mb-3">
              {project.name}
            </h3>
            <p className="text-[#f4f4f0] text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-[#e8935a] text-[#1a1435] px-2 py-1 rounded font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-[#5fb8a8] underline text-sm"
              >
                View on GitHub →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestLog;
