export function createRealtimeDesignSummary(design, layout, brief) {
  if (design?.schema !== "realtime-design/v1") return null;

  const groups = [
    ["已落实", "applied", design.applied],
    ["待确认", "review", design.needsReview],
  ].map(([title, state, entries]) => ({
    title,
    state,
    entries: Array.isArray(entries) ? entries.filter((entry) => typeof entry?.description === "string" && entry.description.trim()) : [],
  })).filter(({ entries }) => entries.length);
  if (!groups.length) return null;

  const rooms = new Map((layout?.rooms || []).map(({ id, name }) => [id, name]));
  const panel = document.createElement("details");
  panel.className = "realtime-design-summary";
  panel.open = groups.some(({ state }) => state === "review");

  const summary = document.createElement("summary");
  const heading = document.createElement("span");
  heading.textContent = "设计要求";
  const statuses = document.createElement("span");
  statuses.className = "realtime-design-statuses";
  summary.append(heading, statuses);

  const sections = document.createElement("div");
  sections.className = "realtime-design-sections";
  for (const { title, state, entries } of groups) {
    const status = document.createElement("span");
    status.dataset.state = state;
    status.textContent = `${title} ${entries.length} 项`;
    statuses.append(status);

    const section = document.createElement("section");
    section.dataset.state = state;
    const category = document.createElement("h3");
    category.textContent = title;
    const list = document.createElement("ul");
    for (const { description, roomId } of entries) {
      const row = document.createElement("li");
      const roomName = rooms.get(roomId);
      if (roomName) {
        const room = document.createElement("span");
        room.className = "realtime-design-room";
        room.textContent = roomName;
        row.append(room);
      }
      const text = document.createElement("span");
      text.textContent = description;
      row.append(text);
      list.append(row);
    }
    section.append(category, list);
    sections.append(section);
  }
  panel.append(summary, sections);
  if (typeof brief === "string" && brief.trim()) {
    const original = document.createElement("details");
    const label = document.createElement("summary");
    label.textContent = "原始设计想法";
    const source = document.createElement("p");
    source.className = "realtime-brief";
    source.textContent = brief;
    original.append(label, source);
    panel.append(original);
  }
  return panel;
}
