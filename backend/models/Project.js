const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String, maxlength: 240, default: "" },
  order: { type: Number, index: true },
  tech: [String],
  githubUrl: String,
  liveUrl: String,
  imageUrl: String,
  status: { type: String, default: "" },
  problem: { type: String, default: "TODO: add the problem statement." },
  solution: { type: String, default: "TODO: add the solution." },
  role: { type: String, default: "TODO: add your role." },
  features: { type: String, default: "TODO: add key features." },
  architecture: { type: String, default: "TODO: add architecture notes." },
  challenges: { type: String, default: "TODO: add engineering challenges." },
  learning: { type: String, default: "TODO: add what you learned." },
  screenshots: [{ url: String, alt: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
