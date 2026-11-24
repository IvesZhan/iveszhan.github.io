import { containsPoint } from "./scene.js";

const EPSILON = 0.00001;
const MAX_STEP_UP_M = 0.075;
const DOOR_LEAF_THICKNESS_M = 0.045;
const OUTSIDE = Symbol("outside the walkable floor");

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const length = ([x, z]) => Math.hypot(x, z);
const offset = ([x, z], [dx, dz], distance) => [x + dx * distance, z + dz * distance];
const isPoint = (point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite);

function axes(start, end) {
  const span = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const along = [(end[0] - start[0]) / span, (end[1] - start[1]) / span];
  return { span, along, across: [-along[1], along[0]] };
}

function rectangle(center, along, span, depth) {
  const [cos, sin] = along;
  return {
    center, along, halfSpan: span / 2, halfDepth: depth / 2,
    reachX: (Math.abs(cos) * span + Math.abs(sin) * depth) / 2,
    reachZ: (Math.abs(sin) * span + Math.abs(cos) * depth) / 2,
  };
}

function segmentRectangle(start, end, depth) {
  const { along, span } = axes(start, end);
  return rectangle(offset(start, along, span / 2), along, span, depth);
}

function circleCollision(box, point, radius) {
  const dx = point[0] - box.center[0];
  const dz = point[1] - box.center[1];
  if (Math.abs(dx) >= box.reachX + radius || Math.abs(dz) >= box.reachZ + radius) return null;

  const [cos, sin] = box.along;
  const x = dx * cos + dz * sin;
  const z = -dx * sin + dz * cos;
  const outsideX = x - clamp(x, -box.halfSpan, box.halfSpan);
  const outsideZ = z - clamp(z, -box.halfDepth, box.halfDepth);
  const distance = Math.hypot(outsideX, outsideZ);
  if (distance >= radius) return null;
  if (distance > EPSILON) {
    return [(outsideX * cos - outsideZ * sin) / distance, (outsideX * sin + outsideZ * cos) / distance];
  }
  // A centre inside a collider can occur after editing or with a very small radius.
  if (box.halfSpan - Math.abs(x) < box.halfDepth - Math.abs(z)) {
    return x < 0 ? [-cos, -sin] : [cos, sin];
  }
  return z < 0 ? [sin, -cos] : [-sin, cos];
}

function roomBounds(room) {
  const xs = room.polygon.map(([x]) => x);
  const zs = room.polygon.map(([, z]) => z);
  return { room, minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs) };
}

function inRoom([x, z], bounds) {
  return x >= bounds.minX && x <= bounds.maxX && z >= bounds.minZ && z <= bounds.maxZ &&
    containsPoint([x, z], bounds.room.polygon);
}

function walkableCut(opening, wall, direction, bodyHeight) {
  if (opening.excludedReason || opening.kind === "window" || opening.sillM > MAX_STEP_UP_M ||
      opening.sillM + opening.heightM < bodyHeight) return null;

  const [cos, sin] = direction.along;
  const points = opening.segment.map(([x, z]) => {
    const dx = x - wall.start[0];
    const dz = z - wall.start[1];
    return [dx * cos + dz * sin, -dx * sin + dz * cos];
  });
  const wallTolerance = wall.thicknessM / 2 + 0.035;
  if (points.some(([along, across]) => Math.abs(across) > wallTolerance ||
      along < -wallTolerance || along > direction.span + wallTolerance)) return null;

  const [first, second] = points.map(([along]) => along);
  if (Math.abs(first - second) < length([
    opening.segment[0][0] - opening.segment[1][0], opening.segment[0][1] - opening.segment[1][1],
  ]) * 0.9) return null;
  const jamb = opening.frameThicknessM ?? 0;
  const start = clamp(Math.min(first, second), 0, direction.span) + jamb;
  const end = clamp(Math.max(first, second), 0, direction.span) - jamb;
  return end - start > EPSILON ? { opening, start, end, reversed: first > second } : null;
}

function hingedDoor(cut, start, end, across) {
  const { opening, reversed } = cut;
  if (opening.kind !== "door" || opening.doorType !== "hinged" ||
      !["start", "end"].includes(opening.hinge) || !isPoint(opening.swingSide)) return null;
  const side = opening.swingSide[0] * across[0] + opening.swingSide[1] * across[1];
  if (Math.abs(side) <= EPSILON) return null;
  const hingeAtStart = (opening.hinge === "start") !== reversed;
  const hinge = hingeAtStart ? start : end;
  const closedEnd = hingeAtStart ? end : start;
  const openEnd = offset(hinge, across, (cut.end - cut.start) * Math.sign(side));
  function leaf(tip) {
    return {
      openingId: opening.id, start: hinge, end: tip, thicknessM: DOOR_LEAF_THICKNESS_M,
      heightM: opening.heightM, sillM: opening.sillM,
    };
  }
  return { open: true, opened: leaf(openEnd), closed: leaf(closedEnd),
    openedBox: segmentRectangle(hinge, openEnd, DOOR_LEAF_THICKNESS_M),
    closedBox: segmentRectangle(hinge, closedEnd, DOOR_LEAF_THICKNESS_M) };
}

export function createWalkNavigation(scene, options = {}) {
  const { radius: requestedRadius, eyeHeight, includeDoorLeaves = false } = options;
  const radius = Number.isFinite(requestedRadius) && requestedRadius > 0 ? Math.max(0.04, requestedRadius) : 0.18;
  const bodyHeight = (Number.isFinite(eyeHeight) && eyeHeight > 0 ? eyeHeight : 1.56) + 0.12;
  const rooms = scene.rooms.filter((room) => !room.excludeFromRoutes).map(roomBounds);
  const roomIds = new Set(rooms.map(({ room }) => room.id));
  const obstacles = [];
  const bridges = [];
  const doors = new Map();
  const openingsByWall = new Map();
  let entrance = null;

  for (const opening of scene.openings) {
    if (opening.wallId === null) {
      if (opening.kind === "window" && !opening.excludedReason) obstacles.push(segmentRectangle(...opening.segment, 0.03));
      continue;
    }
    if (!openingsByWall.has(opening.wallId)) openingsByWall.set(opening.wallId, []);
    openingsByWall.get(opening.wallId).push(opening);
  }

  for (const wall of scene.walls) {
    const direction = axes(wall.start, wall.end);
    const { span, along, across } = direction;
    const cuts = (openingsByWall.get(wall.id) || []).map((opening) => walkableCut(opening, wall, direction, bodyHeight))
      .filter(Boolean).sort((a, b) => a.start - b.start);
    function wallSection(start, end) {
      if (end - start > EPSILON) {
        const midpoint = offset(wall.start, along, (start + end) / 2);
        obstacles.push(rectangle(midpoint, along, end - start, wall.thicknessM));
      }
    }
    let cursor = 0;
    for (const cut of cuts) {
      wallSection(cursor, cut.start);
      cursor = Math.max(cursor, cut.end);
      const midpoint = offset(wall.start, along, (cut.start + cut.end) / 2);
      const halfDepth = wall.thicknessM / 2 + radius + 0.12;
      const insideRooms = cut.opening.roomIds.filter((roomId) => roomIds.has(roomId));
      if (insideRooms.length > 1) {
        // A measured floor can stop at a wall face on each side of a doorway.
        bridges.push(rectangle(midpoint, along, cut.end - cut.start, halfDepth * 2));
      }
      if (cut.opening.id === scene.entranceId) entrance = { midpoint, across, halfDepth, insideRooms };
      if (includeDoorLeaves) {
        const door = hingedDoor(cut, offset(wall.start, along, cut.start), offset(wall.start, along, cut.end), across);
        if (door) doors.set(cut.opening.id, door);
      }
    }
    wallSection(cursor, span);
  }

  for (const item of scene.items) {
    if (item.bottomM >= bodyHeight || item.bottomM + item.heightM <= MAX_STEP_UP_M) continue;
    obstacles.push(rectangle(item.center, [Math.cos(item.rotationRad), Math.sin(item.rotationRad)], item.widthM, item.depthM));
  }

  const perimeter = Array.from({ length: 8 }, (_, index) => {
    const angle = index * Math.PI / 4;
    return [Math.cos(angle), Math.sin(angle)];
  });

  function roomAt(point) {
    return rooms.find((bounds) => inRoom(point, bounds))?.room ?? null;
  }

  function hasFloor(point) {
    return Boolean(roomAt(point)) || bridges.some((bridge) => {
      const dx = point[0] - bridge.center[0];
      const dz = point[1] - bridge.center[1];
      const [cos, sin] = bridge.along;
      return Math.abs(dx * cos + dz * sin) <= bridge.halfSpan && Math.abs(-dx * sin + dz * cos) <= bridge.halfDepth;
    });
  }

  function blocker(point) {
    for (const box of obstacles) {
      const normal = circleCollision(box, point, radius);
      if (normal) return normal;
    }
    for (const door of doors.values()) {
      const normal = circleCollision(door.open ? door.openedBox : door.closedBox, point, radius);
      if (normal) return normal;
    }
    if (!hasFloor(point) || perimeter.some((direction) => !hasFloor(offset(point, direction, radius)))) return OUTSIDE;
    return null;
  }

  function canOccupy(point) {
    return isPoint(point) && blocker(point) === null;
  }

  function spawn(roomId = null, preferred = null) {
    const candidates = roomId ? rooms.filter(({ room }) => room.id === roomId) : rooms;
    if (isPoint(preferred) && (!roomId || candidates.some((bounds) => inRoom(preferred, bounds))) && canOccupy(preferred)) {
      return [...preferred];
    }
    if (!roomId && !preferred && entrance) {
      for (const side of [1, -1]) {
        const point = offset(entrance.midpoint, entrance.across, side * (entrance.halfDepth + 0.16));
        if (entrance.insideRooms.includes(roomAt(point)?.id) && canOccupy(point)) return point;
      }
    }
    const spacing = Math.min(0.18, radius);
    for (const bounds of candidates) {
      const defaultCenter = [(bounds.minX + bounds.maxX) / 2, (bounds.minZ + bounds.maxZ) / 2];
      const origin = isPoint(preferred) ? [clamp(preferred[0], bounds.minX, bounds.maxX), clamp(preferred[1], bounds.minZ, bounds.maxZ)] : defaultCenter;
      if (inRoom(origin, bounds) && canOccupy(origin)) return origin;
      const radiusSteps = Math.ceil(Math.max(origin[0] - bounds.minX, bounds.maxX - origin[0], origin[1] - bounds.minZ, bounds.maxZ - origin[1]) / spacing);
      for (let ring = 1; ring <= radiusSteps; ring += 1) {
        for (let index = -ring; index < ring; index += 1) {
          const edges = [[index, -ring], [ring, index], [-index, ring], [-ring, -index]];
          for (const [x, z] of edges) {
            const point = [origin[0] + x * spacing, origin[1] + z * spacing];
            if (inRoom(point, bounds) && canOccupy(point)) return point;
          }
        }
      }
    }
    return null;
  }

  function move(position, delta) {
    if (!isPoint(position) || !isPoint(delta)) return position;
    let current = canOccupy(position) ? position : spawn(null, position);
    if (!current) return position;
    const distance = length(delta);
    if (!Number.isFinite(distance) || distance < EPSILON) return current;
    // Substeps make one large movement obey the same barriers as a normal animation frame.
    const travel = Math.min(distance, 160);
    const steps = Math.ceil(travel / Math.min(radius / 2, 0.035));
    const [dx, dz] = delta.map((value) => (value / distance) * (travel / steps));
    for (let index = 0; index < steps; index += 1) {
      const next = [current[0] + dx, current[1] + dz];
      const hit = blocker(next);
      if (hit === null) {
        current = next;
        continue;
      }
      if (hit !== OUTSIDE) {
        const inward = Math.min(0, dx * hit[0] + dz * hit[1]);
        const slide = [next[0] - hit[0] * inward, next[1] - hit[1] * inward];
        if (canOccupy(slide)) {
          current = slide;
          continue;
        }
      }
      const alongX = [next[0], current[1]];
      const alongZ = [current[0], next[1]];
      const axes = Math.abs(dx) >= Math.abs(dz) ? [alongX, alongZ] : [alongZ, alongX];
      current = axes.find(canOccupy) || current;
    }
    return current;
  }

  function doorLeaf(openingId) {
    const door = doors.get(openingId);
    return door ? { ...(door.open ? door.opened : door.closed), open: door.open } : null;
  }

  function setDoorOpen(openingId, open, position = null) {
    const door = doors.get(openingId);
    if (!door || typeof open !== "boolean") return false;
    if (isPoint(position) && circleCollision(open ? door.openedBox : door.closedBox, position, radius)) return false;
    door.open = open;
    return true;
  }

  return { spawn, move, canOccupy, roomAt, doorLeaf, setDoorOpen };
}
