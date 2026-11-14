const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String, maxlength: 240, default: '' },
  order: { type: Number, index: true },
  tech: [String],
  githubUrl: String,
  liveUrl: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
