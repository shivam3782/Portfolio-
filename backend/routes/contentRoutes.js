const express = require("express");
const { rateLimit } = require("express-rate-limit");
const Profile = require("../models/Profile");
const Message = require("../models/Message");
const checkAdmin = require("../middleware/checkAdmin");
const { validateProfile, defaults } = require("../lib/profileValidation");
const router = express.Router();
router.get("/profile", async (_req, res) => {
  try {
    const profile = await Profile.findOne({ key: "owner" });
    res.json({ ...defaults, ...profile?.content });
  } catch {
    res.status(503).json({ error: "Profile service unavailable." });
  }
});
router.put("/profile", checkAdmin, async (req, res) => {
  const { data, errors } = validateProfile(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  try {
    await Profile.findOneAndUpdate(
      { key: "owner" },
      { $set: { content: data } },
      { upsert: true, runValidators: true },
    );
    res.json(data);
  } catch {
    res.status(503).json({ error: "Profile could not be saved." });
  }
});
const contactLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again in 15 minutes." },
});
router.post("/contact", contactLimit, async (req, res) => {
  const body = req.body || {};
  if (body.website)
    return res.status(400).json({ error: "Message could not be accepted." });
  const errors = {};
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.length > 100
  )
    errors.name = "Enter your name (up to 100 characters).";
  if (
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  )
    errors.email = "Enter a valid email address.";
  if (
    typeof body.message !== "string" ||
    body.message.trim().length < 10 ||
    body.message.length > 5000
  )
    errors.message = "Use 10–5,000 characters.";
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  try {
    await Message.create({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    });
    res
      .status(201)
      .json({ message: "Message delivered to Shivam’s private inbox." });
  } catch {
    res.status(503).json({
      error: "Message could not be delivered. Please email directly or retry.",
    });
  }
});
router.get("/messages", checkAdmin, async (_req, res) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }).limit(100));
  } catch {
    res.status(503).json({ error: "Inbox unavailable." });
  }
});
// Aggregate only: no IP, cookie, user agent or referrer is persisted.
const Counter = require("mongoose").model(
  "Counter",
  new (require("mongoose").Schema)({
    key: { type: String, unique: true },
    count: { type: Number, default: 0 },
  }),
);
router.post(
  "/events/resume",
  rateLimit({ windowMs: 60000, limit: 30, legacyHeaders: false }),
  async (_req, res) => {
    if (process.env.ANALYTICS_ENABLED !== "true") return res.sendStatus(204);
    try {
      await Counter.updateOne(
        { key: "resume" },
        { $inc: { count: 1 } },
        { upsert: true },
      );
      res.sendStatus(204);
    } catch {
      res.sendStatus(503);
    }
  },
);
module.exports = router;
