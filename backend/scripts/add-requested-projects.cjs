// Requested portfolio content update. Uses existing authenticated API; no schema changes.
// Run from backend: node scripts/add-requested-projects.cjs --apply
require("dotenv").config({ quiet: true });

const base =
  (process.env.API_ORIGIN || "http://localhost:3000").replace(/\/$/, "") +
  "/api/projects";
const insurance = {
  name: "Proactive Insurance Policy Guardian",
  description:
    "An AI assistant that makes insurance policy PDFs easier to understand through natural-language questions. Flask parses documents with PyPDF2, SentenceTransformers embeds text passages, and FAISS retrieves relevant context for answer generation through the Hugging Face Inference API. Built for the DSW Hackathon Challenge as an educational project.",
  tech: [
    "Python",
    "Flask",
    "SentenceTransformers",
    "FAISS",
    "PyPDF2",
    "Hugging Face",
  ],
  githubUrl: "https://github.com/shivam3782/proactive_insurance",
  liveUrl: "",
  imageUrl: "",
};

async function request(path = "", options = {}) {
  const response = await fetch(base + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": process.env.ADMIN_KEY,
      ...options.headers,
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("Project API returned " + response.status);
  return response.json();
}

(async () => {
  if (!process.argv.includes("--apply")) {
    console.log(
      "Plan: attach the requested KrushiPal source URL and add Proactive Insurance if absent. Use --apply to save.",
    );
    return;
  }
  if (!process.env.ADMIN_KEY)
    throw new Error("Admin access is not configured.");
  const records = await request();
  const existingKrushi = records.filter(
    (p) => p.name.toLowerCase() === "krushipal",
  );
  const existingInsurance = records.filter(
    (p) =>
      p.githubUrl === insurance.githubUrl ||
      /proactive.*insurance/i.test(p.name),
  );
  if (existingKrushi.length !== 1 || existingInsurance.length > 1)
    throw new Error(
      "Unexpected duplicate or missing project; review the library first.",
    );
  const krushi = await request("/" + existingKrushi[0]._id, {
    method: "PUT",
    body: JSON.stringify({
      githubUrl: "https://github.com/shivam3782/KrushiPal",
    }),
  });
  console.log(
    JSON.stringify({
      action: "Updated source link",
      name: krushi.name,
      githubUrl: krushi.githubUrl,
    }),
  );
  if (!existingInsurance.length) {
    const added = await request("", {
      method: "POST",
      body: JSON.stringify(insurance),
    });
    console.log(
      JSON.stringify({
        action: "Added verified project",
        name: added.name,
        githubUrl: added.githubUrl,
      }),
    );
  } else {
    console.log(
      JSON.stringify({
        action: "Already present; preserved existing content",
        name: existingInsurance[0].name,
      }),
    );
  }
  const saved = await request();
  if (saved.filter((p) => p.githubUrl === insurance.githubUrl).length !== 1)
    throw new Error("Insurance save could not be verified.");
  console.log(
    JSON.stringify({ count: saved.length, names: saved.map((p) => p.name) }),
  );
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
