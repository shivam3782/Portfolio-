// Inspect emitted application assets; never print environment or secret values.
import { readdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";

async function filesAt(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? filesAt(path + "/" + entry.name)
          : path + "/" + entry.name,
      ),
    )
  ).flat();
}
const files = (await filesAt("dist")).filter((path) =>
  /\.(js|css|html)$/.test(path),
);
const text = (
  await Promise.all(files.map((path) => readFile(path, "utf8")))
).join("\n");
// React Router includes a bare dummy origin for URL parsing; it is not a fetch base.
// Reject loopback URLs that carry a port or an API path, including the former local API.
assert.ok(
  !/https?:\/\/(?:localhost(?:\.[\w.-]+)?|127(?:\.\d+){3}|0\.0\.0\.0|\[::1\])(?::\d+|\/api\b)/i.test(
    text,
  ),
  "Build contains a development API URL.",
);
for (const name of ["MONGO_URI", "ADMIN_KEY"]) {
  const value = process.env[name];
  if (value)
    assert.ok(
      !text.includes(value),
      "Build contains a backend-only secret value.",
    );
}
console.log(
  "PASS: emitted assets contain no development API endpoint or supplied backend-secret value.",
);
