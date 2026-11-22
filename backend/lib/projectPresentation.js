function plain(record) {
  return typeof record.toObject === "function"
    ? record.toObject()
    : { ...record };
}

function orderLock(project) {
  if (
    /github\.com\/shivam3782\/proactive_insurance\/?$/i.test(
      project.githubUrl || "",
    ) ||
    /proactive.*insurance/i.test(project.name)
  )
    return "first";
  if (/^arnav$/i.test(project.name)) return "last";
  return null;
}

function sortProjects(records) {
  return records.map(plain).sort((a, b) => {
    const priority = (p) =>
      orderLock(p) === "first" ? -1 : orderLock(p) === "last" ? 1 : 0;
    const boundary = priority(a) - priority(b);
    if (boundary) return boundary;
    const aRank = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER;
    const bRank = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER;
    return (
      aRank - bRank ||
      new Date(a.createdAt || 0) - new Date(b.createdAt || 0) ||
      String(a._id).localeCompare(String(b._id))
    );
  });
}

function presentProjects(records) {
  return sortProjects(records).map((record, index) => ({
    ...record,
    position: index + 1,
    orderLocked: orderLock(record),
  }));
}

// Move only the edited record. Neighbor ranks keep other projects in their saved relative order.
function rankForPosition(records, project, position) {
  const ordered = presentProjects(records);
  const existing = ordered.find((p) => String(p._id) === String(project._id));
  if (orderLock(project))
    return orderLock(project) === "first" ? -1000000 : 1000000;
  if (position === undefined && Number.isFinite(existing?.order))
    return existing.order;
  const remaining = ordered.filter(
    (p) => String(p._id) !== String(project._id),
  );
  const minimum = remaining[0]?.orderLocked === "first" ? 1 : 0;
  const maximum =
    remaining.at(-1)?.orderLocked === "last"
      ? remaining.length - 1
      : remaining.length;
  const desired = position === undefined ? maximum : position - 1;
  const index = Math.max(minimum, Math.min(maximum, desired));
  const rank = (i) =>
    Number.isFinite(remaining[i]?.order) ? remaining[i].order : i * 1000;
  const previous = index > 0 ? rank(index - 1) : null;
  const next = index < remaining.length ? rank(index) : null;
  return previous === null
    ? (next ?? 1000) - 1000
    : next === null
      ? previous + 1000
      : previous + (next - previous) / 2;
}

module.exports = { orderLock, sortProjects, presentProjects, rankForPosition };
