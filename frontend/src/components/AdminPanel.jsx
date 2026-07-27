import { useState, useEffect } from "react";

function AdminPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tech: "",
    githubUrl: "",
  });

  const fetchProjects = () => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  };

  useEffect(() => {
    if (authenticated) fetchProjects();
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthenticated(true);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", tech: "", githubUrl: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      tech: form.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl,
    };

    const url = editingId
      ? `http://localhost:3000/api/projects/${editingId}`
      : "http://localhost:3000/api/projects";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      alert("Wrong admin key");
      setAuthenticated(false);
      return;
    }

    resetForm();
    fetchProjects();
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      tech: project.tech.join(", "),
      githubUrl: project.githubUrl || "",
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (res.status === 401) {
      alert("Wrong admin key");
      setAuthenticated(false);
      return;
    }
    fetchProjects();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1a1435] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-[#2d2547] border-2 border-[#e8935a] rounded-lg p-8 w-full max-w-sm"
        >
          <h2 className="font-pixel text-[#e8935a] text-sm mb-6">
            ENTER ADMIN KEY
          </h2>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full bg-[#1a1435] border-2 border-[#5fb8a8] rounded p-2 text-[#f4f4f0] mb-4"
            placeholder="Admin key"
          />
          <button
            type="submit"
            className="w-full bg-[#e8935a] text-[#1a1435] font-pixel text-xs py-3 rounded"
          >
            ENTER
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1435] p-8">
      <h2 className="font-pixel text-[#e8935a] text-xl mb-8">ADMIN PANEL</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#2d2547] border-2 border-[#e8935a] rounded-lg p-6 mb-8 max-w-xl"
      >
        <h3 className="font-pixel text-xs text-[#5fb8a8] mb-4">
          {editingId ? "EDIT PROJECT" : "NEW PROJECT"}
        </h3>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="w-full bg-[#1a1435] border border-[#5fb8a8] rounded p-2 text-[#f4f4f0] mb-3"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full bg-[#1a1435] border border-[#5fb8a8] rounded p-2 text-[#f4f4f0] mb-3"
          required
        />
        <input
          value={form.tech}
          onChange={(e) => setForm({ ...form, tech: e.target.value })}
          placeholder="Tech (comma-separated: React, Node.js)"
          className="w-full bg-[#1a1435] border border-[#5fb8a8] rounded p-2 text-[#f4f4f0] mb-3"
        />
        <input
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          placeholder="GitHub URL"
          className="w-full bg-[#1a1435] border border-[#5fb8a8] rounded p-2 text-[#f4f4f0] mb-4"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-[#e8935a] text-[#1a1435] font-pixel text-xs px-6 py-3 rounded"
          >
            {editingId ? "UPDATE" : "CREATE"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#5fb8a8] text-[#1a1435] font-pixel text-xs px-6 py-3 rounded"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-[#2d2547] border-2 border-[#5fb8a8] rounded-lg p-4 flex justify-between items-center"
          >
            <span className="text-[#f4f4f0]">{p.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-[#e8935a] text-[#1a1435] px-4 py-2 rounded font-pixel text-xs"
              >
                EDIT
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-4 py-2 rounded font-pixel text-xs"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
