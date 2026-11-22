const defaults = require("../data/profile.json");
function validUrl(value, local = false) {
  if (local && /^\/(?!\/)[\w/.-]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
function validateProfile(body) {
  const data = {},
    errors = {};
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { data, errors: { form: "Enter a profile object." } };
  const textFields = [
    "name",
    "role",
    "tagline",
    "valueProposition",
    "availability",
    "location",
    "about",
    "lookingFor",
    "photoUrl",
    "email",
    "githubUrl",
    "linkedinUrl",
    "resumeUrl",
    "ogImage",
  ];
  for (const field of textFields) {
    if (typeof body[field] !== "string" || body[field].length > 5000)
      errors[field] = "Enter text, up to 5,000 characters.";
    else data[field] = body[field].trim();
  }
  for (const field of ["name", "role", "valueProposition", "email"])
    if (!data[field]) errors[field] = "This field is required.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email.";
  for (const field of [
    "photoUrl",
    "githubUrl",
    "linkedinUrl",
    "resumeUrl",
    "ogImage",
  ])
    if (
      data[field] &&
      !validUrl(
        data[field],
        ["resumeUrl", "ogImage", "photoUrl"].includes(field),
      )
    )
      errors[field] = "Use a safe HTTP(S) URL or supported local asset path.";
  const shapes = {
    stats: ["value", "label"],
    education: ["degree", "school", "years", "result"],
    aboutCards: ["title", "text"],
  };
  for (const [field, keys] of Object.entries(shapes)) {
    if (
      !Array.isArray(body[field]) ||
      body[field].length > 30 ||
      body[field].some(
        (item) =>
          !item ||
          keys.some(
            (key) => typeof item[key] !== "string" || item[key].length > 5000,
          ),
      )
    )
      errors[field] = "Enter a valid list of " + keys.join(", ") + " objects.";
    else
      data[field] = body[field].map((item) =>
        Object.fromEntries(keys.map((key) => [key, item[key].trim()])),
      );
  }
  for (const field of ["certifications", "leadership"]) {
    if (
      !Array.isArray(body[field]) ||
      body[field].length > 50 ||
      body[field].some((item) => typeof item !== "string" || item.length > 5000)
    )
      errors[field] = "Enter a list of text values.";
    else data[field] = body[field].map((item) => item.trim());
  }
  if (
    !body.skills ||
    typeof body.skills !== "object" ||
    Array.isArray(body.skills) ||
    Object.keys(body.skills).length > 20 ||
    Object.entries(body.skills).some(
      ([key, items]) =>
        key.length > 60 ||
        ["__proto__", "constructor", "prototype"].includes(key) ||
        !Array.isArray(items) ||
        items.length > 40 ||
        items.some((item) => typeof item !== "string" || item.length > 100),
    )
  )
    errors.skills = "Enter skill groups with lists of names.";
  else data.skills = body.skills;
  return { data, errors };
}
module.exports = { validateProfile, validUrl, defaults };
