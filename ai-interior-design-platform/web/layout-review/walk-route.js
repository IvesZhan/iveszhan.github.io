import { getLayoutBounds } from "./scene.js";

const GRID_STEP_M = 0.11;
const MAX_GRID_CELLS = 36_000;
const NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const UNVISITED = -2;
const BLOCKED = -3;

function smoothRoute(start, points, canTraverse) {
  const route = [];
  let from = start;
  for (let next = 0; next < points.length;) {
    let last = Math.min(next + 17, points.length - 1);
    while (last > next && !canTraverse(from, points[last])) last -= 1;
    from = points[last];
    route.push(from);
    next = last + 1;
  }
  return route;
}

export function planWalkRoute(scene, navigation, start, end) {
  const { canOccupy, canTraverse } = navigation;
  if (!canOccupy(start) || !canOccupy(end)) return null;
  if (canTraverse(start, end)) return [end];

  const { minX, maxX, minZ, maxZ } = getLayoutBounds(scene);
  const step = Math.max(GRID_STEP_M, Math.sqrt((maxX - minX + 1) * (maxZ - minZ + 1) / MAX_GRID_CELLS));
  const width = 1 + Math.ceil((maxX - minX) / step);
  const depth = 1 + Math.ceil((maxZ - minZ) / step);
  const pointAt = (column, row) => [minX + column * step, minZ + row * step];
  const parents = new Int32Array(width * depth).fill(UNVISITED);
  const queue = [];

  function enqueue(column, row, parent, from) {
    if (column < 0 || column >= width || row < 0 || row >= depth) return;
    const index = row * width + column;
    if (parents[index] !== UNVISITED) return;
    const point = pointAt(column, row);
    if (!canOccupy(point)) { parents[index] = BLOCKED; return; }
    if (!canTraverse(from, point)) return;
    parents[index] = parent;
    queue.push(index);
  }

  const nearColumn = Math.round((start[0] - minX) / step);
  const nearRow = Math.round((start[1] - minZ) / step);
  for (let dz = -1; dz <= 1; dz += 1) {
    for (let dx = -1; dx <= 1; dx += 1) enqueue(nearColumn + dx, nearRow + dz, -1, start);
  }

  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    const column = index % width;
    const row = Math.floor(index / width);
    const from = pointAt(column, row);
    if (Math.hypot(end[0] - from[0], end[1] - from[1]) <= step * 1.65 && canTraverse(from, end)) {
      const points = [end];
      for (let previous = index; previous >= 0; previous = parents[previous]) {
        points.push(pointAt(previous % width, Math.floor(previous / width)));
      }
      return smoothRoute(start, points.reverse(), canTraverse);
    }
    for (const [dx, dz] of NEIGHBORS) enqueue(column + dx, row + dz, index, from);
  }
  return null;
}
