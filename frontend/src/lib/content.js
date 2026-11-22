import { createContext, useContext } from "react";
import profile from "../data/profile.json";
import snapshot from "../data/projects.snapshot.json";
export const projectOrder = [
  "Proactive Insurance Policy Guardian",
  "The HangMan Game",
  "KrushiPal",
  "CultivateConnect",
  "ARNav",
];
export const slugFor = (project) =>
  project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function orderProjects(projects) {
  const rank = (p) => {
    const index = projectOrder.indexOf(p.name);
    return index < 0 ? 99 : index;
  };
  return [...projects].sort((a, b) => rank(a) - rank(b));
}
export const defaultContent = {
  profile,
  projects: orderProjects(snapshot),
  status: "loading",
  retry() {},
};
export const ContentContext = createContext(defaultContent);
export const useContent = () => useContext(ContentContext);
export function assetUrl(value) {
  if (typeof value !== "string") return null;
  if (/^\/(?!\/)[\w/.-]+$/.test(value)) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export const visibleText = (value) =>
  typeof value === "string" && value.trim() && !/^TODO:/i.test(value.trim());
