const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from my portfolio!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/projects", (req, res) => {
  res.json([
    {
      id: 1,
      name: "ARNav",
      tech: ["Flutter", "Unity3D", "ARCore", "Firebase"],
    },
    { id: 2, name: "CultivateConnect", tech: ["Python", "Flask", "MongoDB"] },
  ]);
});
