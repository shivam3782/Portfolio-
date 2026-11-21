require("dotenv").config({ quiet: true });
const dns = require("node:dns");
const mongoose = require("mongoose");
const { serverConfig } = require("./lib/serverConfig");
const { createApp } = require("./app");

async function start() {
  if (!process.env.MONGO_URI || !process.env.ADMIN_KEY)
    throw new Error("Backend environment is incomplete.");
  const config = serverConfig();
  if (config.dnsServers.length) dns.setServers(config.dnsServers);
  const app = createApp();

  // Do not advertise readiness before the database is available.
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });
  app.listen(config.port, "0.0.0.0", () =>
    console.log(
      "Backend ready; MongoDB connected; listening on port " + config.port,
    ),
  );
}

start().catch(async () => {
  console.error(
    "Backend startup failed. Check required environment variables, PORT/CORS settings and MongoDB network/DNS access.",
  );
  await mongoose.disconnect();
  process.exitCode = 1;
});
