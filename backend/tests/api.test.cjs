const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const { createApp } = require("../app");
const defaults = require("../../shared/profile.json");
const Message = require("../models/Message");
let mongo, app;
before(async () => {
  process.env.ADMIN_KEY = "isolated-test-key";
  process.env.ANALYTICS_ENABLED = "true";
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {
    dbName: "portfolio_redesign_tests",
  });
  app = createApp();
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
const admin = (req) => req.set("x-admin-key", "isolated-test-key");
test("profile defaults are read-only until an authenticated save", async () => {
  const response = await request(app).get("/api/profile");
  assert.equal(response.status, 200);
  assert.equal(response.body.name, defaults.name);
  assert.equal(await mongoose.model("Profile").countDocuments(), 0);
  assert.equal(
    (await request(app).put("/api/profile").send(defaults)).status,
    401,
  );
  assert.equal(
    (
      await admin(request(app).put("/api/profile")).send({
        ...defaults,
        name: "QA owner",
      })
    ).status,
    200,
  );
  assert.equal((await request(app).get("/api/profile")).body.name, "QA owner");
});
test("profile validates nested fields and rejects unsafe asset URLs", async () => {
  const response = await admin(request(app).put("/api/profile")).send({
    ...defaults,
    resumeUrl: "javascript:alert(1)",
    stats: [{ value: 4 }],
    skills: { Frontend: "React" },
  });
  assert.equal(response.status, 400);
  for (const key of ["resumeUrl", "stats", "skills"])
    assert.ok(response.body.errors[key]);
});
test("project CRUD retains legacy fields and round-trips case studies and screenshot alt text", async () => {
  const payload = {
    name: "QA project",
    description: "Isolated database only",
    tech: ["React"],
    problem: "A real problem",
    screenshots: [
      { url: "https://example.com/shot.webp", alt: "Project dashboard" },
    ],
  };
  assert.equal(
    (await request(app).post("/api/projects").send(payload)).status,
    401,
  );
  const created = await admin(request(app).post("/api/projects")).send(payload);
  assert.equal(created.status, 201);
  const id = created.body._id;
  const updated = await admin(request(app).put("/api/projects/" + id)).send({
    solution: "A tested solution",
    status: "Prototype",
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.description, payload.description);
  assert.equal(updated.body.screenshots[0].alt, "Project dashboard");
  const invalid = await admin(request(app).put("/api/projects/" + id)).send({
    screenshots: [{ url: "data:image/png,bad", alt: "" }],
  });
  assert.equal(invalid.status, 400);
  assert.equal(
    (await admin(request(app).delete("/api/projects/" + id))).status,
    200,
  );
});
test("contact validates and rejects honeypots without saving", async () => {
  assert.equal(
    (
      await request(app)
        .post("/api/contact")
        .send({ name: "", email: "bad", message: "short" })
    ).status,
    400,
  );
  assert.equal(
    (
      await request(app).post("/api/contact").send({
        website: "spam",
        name: "Bot",
        email: "bot@example.com",
        message: "Long enough message",
      })
    ).status,
    400,
  );
  assert.equal(await Message.countDocuments(), 0);
});
test("contact success means durable delivery to the authenticated inbox", async () => {
  const payload = {
    name: "QA sender",
    email: "test@example.com",
    message: "<script>alert(1)</script> remains plain text.",
  };
  const sent = await request(app).post("/api/contact").send(payload);
  assert.equal(sent.status, 201);
  assert.equal(await Message.countDocuments(), 1);
  assert.equal((await request(app).get("/api/messages")).status, 401);
  const inbox = await admin(request(app).get("/api/messages"));
  assert.equal(inbox.status, 200);
  assert.equal(inbox.body[0].message, payload.message);
});
test("contact limits abuse with HTTP 429", async () => {
  let status;
  for (let i = 0; i < 6; i++)
    status = (await request(app).post("/api/contact").send({})).status;
  assert.equal(status, 429);
});
test("secure headers, exact CORS and payload limits are enforced", async () => {
  const response = await request(app)
    .get("/api/profile")
    .set("Origin", "https://evil.example");
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["access-control-allow-origin"], undefined);
  assert.equal(response.headers["cache-control"], "no-store");
  const allowed = await request(app)
    .get("/api/profile")
    .set("Origin", "https://www.shivam-sharma.me");
  assert.equal(
    allowed.headers["access-control-allow-origin"],
    "https://www.shivam-sharma.me",
  );
  assert.equal(
    (
      await request(app)
        .post("/api/contact")
        .send({ message: "x".repeat(150000) })
    ).status,
    413,
  );
});
test("optional analytics only persist an aggregate count", async () => {
  assert.equal((await request(app).post("/api/events/resume")).status, 204);
  const record = await mongoose
    .model("Counter")
    .findOne({ key: "resume" })
    .lean();
  assert.equal(record.count, 1);
  assert.deepEqual(Object.keys(record).sort(), ["__v", "_id", "count", "key"]);
});
