const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = 3000;

app.use(express.json()); // lets Express parse JSON request bodies into req.body

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello from my backend!");
});

app.use("/api/blogs", blogRoutes); // any request to /api/blogs goes to our router
app.use("/api/projects", projectRoutes); // any request to /api/projects goes to our router

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
