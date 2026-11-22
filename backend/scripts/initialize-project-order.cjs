// Add only missing saved ranks, preserving content and the relative order of other projects.
require("dotenv").config({ quiet: true });
require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const Project = require("../models/Project");
const { presentProjects } = require("../lib/projectPresentation");

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });
  const records = presentProjects(await Project.find());
  if (!records.length)
    throw new Error("No projects found. No order was changed.");
  if (
    process.argv.includes("--apply") &&
    records.some((p) => !Number.isFinite(p.order))
  ) {
    await Project.bulkWrite(
      records.map((project, index) => ({
        updateOne: {
          filter: { _id: project._id },
          update: { $set: { order: index * 1000 } },
        },
      })),
    );
  }
  const saved = presentProjects(await Project.find());
  console.log(
    JSON.stringify(
      {
        applied: process.argv.includes("--apply"),
        order: saved.map((p) => ({
          name: p.name,
          position: p.position,
          order: p.order,
          orderLocked: p.orderLocked,
        })),
      },
      null,
      2,
    ),
  );
})()
  .catch(() => {
    console.error(
      "Project order initialization failed; check MongoDB connectivity.",
    );
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
