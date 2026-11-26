import { containsPoint, isDiningTable, LAYOUT_SCHEMA, loadLayoutScene } from "./scene.js?v=studio-version-save";
import { createWalkNavigation } from "./walk-navigation.js";

const MM_PER_M = 1000;
const DEFAULT_WALL_THICKNESS_M = 0.15;
const DEFAULT_DOOR_HEIGHT_M = 2.1;
const GEOMETRY_EPSILON_M = 0.02;

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const offset = ([x, z], [dx, dz], metres) => [x + dx * metres, z + dz * metres];
const mm = (value) => Number.isFinite(value) ? value / MM_PER_M : undefined;
const numberedId = (prefix, index) => `${prefix}_${String(index + 1).padStart(3, "0")}`;

function cadPoint(value) {
  const coordinates = Array.isArray(value) ? value : [value?.x, value?.y];
  return coordinates.length === 2 && coordinates.every(Number.isFinite) ? coordinates : null;
}

function frame(start, end) {
  const length = distance(start, end);
  const along = [(end[0] - start[0]) / length, (end[1] - start[1]) / length];
  const across = [-along[1], along[0]];
  return {
    along, across, length,
    project: ([x, z]) => [dot([x - start[0], z - start[1]], along), dot([x - start[0], z - start[1]], across)],
    at: (length) => offset(start, along, length),
  };
}

function uniqueId(preferred, fallback, used) {
  let id = typeof preferred === "string" && /^[\w-]{1,150}$/.test(preferred) && !used.has(preferred) ? preferred : fallback;
  while (used.has(id)) id += "_";
  used.add(id);
  return id;
}

function usablePolygon(polygon) {
  if (polygon.length < 3) return false;
  const sum = polygon.reduce((area, [x, z], index) => {
    const [nextX, nextZ] = polygon[(index + 1) % polygon.length];
    return area + x * nextZ - nextX * z;
  }, 0);
  return Math.abs(sum) >= 0.02;
}

function openingFit(wall, sourceSegment, center, width) {
  const geometry = frame(wall.start, wall.end);
  const tolerance = Math.min(0.13, wall.thicknessM / 2 + 0.03);
  const [along, across] = geometry.project(center);
  if (Math.abs(across) > tolerance) return null;
  const positions = sourceSegment ? sourceSegment.map((point) => geometry.project(point)) : [[along - width / 2, across], [along + width / 2, across]];
  if (positions.some(([length, deviation]) => length < -0.035 || length > geometry.length + 0.035 || Math.abs(deviation) > tolerance)) return null;
  const [first, second] = positions.map(([length]) => Math.max(0, Math.min(length, geometry.length)));
  if (Math.abs(second - first) < Math.max(GEOMETRY_EPSILON_M, width * 0.96)) return null;
  return { wall, segment: [geometry.at(first), geometry.at(second)], error: Math.abs(across) };
}

function pickHostWall(walls, wallId, segment, center, width) {
  const fits = walls.map((wall) => openingFit(wall, segment, center, width)).filter(Boolean).sort((a, b) => a.error - b.error);
  const declared = fits.find(({ wall }) => wall.id === wallId);
  if (declared) return declared;
  if (fits.length === 1 || (fits.length > 1 && fits[1].error - fits[0].error >= 0.045)) return fits[0];
  return null;
}

function nearbyOpeningMarker(edges, kind, center, width) {
  const tolerance = kind === "window" ? 0.12 : 0.36;
  const matches = [];
  for (const edge of edges) {
    const [along, across] = edge.project(center);
    const start = along - width / 2;
    const end = along + width / 2;
    if (Math.abs(across) > tolerance || start < -0.025 || end > edge.length + 0.025) continue;
    matches.push({ along: edge.along, error: Math.abs(across), segment: [edge.at(start), edge.at(end)] });
  }
  matches.sort((a, b) => a.error - b.error);
  const closest = matches[0];
  if (!closest || matches.slice(1).some((match) => match.error - closest.error < 0.06 &&
      Math.abs(dot(match.along, closest.along)) < 0.97)) return null;
  return closest.segment;
}

function openingRooms(segment, wallThickness, declaredRoomIds, rooms, roomAliases) {
  const { across } = frame(...segment);
  const center = midpoint(...segment);
  const detected = rooms.filter(({ polygon }) => [1, -1].some((side) =>
    [0.08, 0.24].some((distance) => containsPoint(offset(center, across, side * (wallThickness / 2 + distance)), polygon))));
  const declared = Array.isArray(declaredRoomIds) ? declaredRoomIds.map((id) => roomAliases.get(id)).filter(Boolean) : [];
  return [...new Set([...declared, ...detected.map(({ id }) => id)])].slice(0, 8);
}

export function fromFloorPlan(floorPlan, { name, items = [] } = {}) {
  if (!floorPlan || (floorPlan.unit && String(floorPlan.unit).toLowerCase() !== "mm")) {
    throw new Error("实时 3D 需要以毫米为单位的已解析户型。");
  }
  const sourceWalls = Array.isArray(floorPlan.walls) ? floorPlan.walls : [];
  const sourceRooms = Array.isArray(floorPlan.room_boundaries) ? floorPlan.room_boundaries : [];
  const sourceColumns = Array.isArray(floorPlan.columns) ? floorPlan.columns : [];
  if (sourceWalls.length + sourceColumns.length > 1500 || sourceRooms.length > 100) throw new Error("CAD 线条过多，请先保留本层户型结构。");
  const geometryPoints = sourceWalls.concat(sourceColumns).flatMap(({ start, end }) => [cadPoint(start), cadPoint(end)])
    .concat(sourceRooms.flatMap(({ polygon }) => Array.isArray(polygon) ? polygon.map(cadPoint) : [])).filter(Boolean);
  if (!geometryPoints.length) throw new Error("CAD 缺少可用的户型结构坐标。");
  const origin = geometryPoints.some(([x, y]) => Math.max(Math.abs(x), Math.abs(y)) > 499_000)
    ? [...geometryPoints[0]] : [0, 0];
  const toScenePoint = ([x, y]) => [(x - origin[0]) / MM_PER_M, (origin[1] - y) / MM_PER_M];
  const warnings = Array.isArray(floorPlan.parser_warnings) ? [...floorPlan.parser_warnings] : [];
  const floorHeight = mm(floorPlan.floor_height) ?? 2.8;
  let estimatedWalls = 0;

  const wallAliases = new Map();
  const wallIds = new Set();
  const wallKeys = new Map();
  const walls = sourceWalls.concat(sourceColumns).flatMap((source, index) => {
    const rawStart = cadPoint(source.start);
    const rawEnd = cadPoint(source.end);
    if (!rawStart || !rawEnd || distance(rawStart, rawEnd) < GEOMETRY_EPSILON_M * MM_PER_M) return [];
    const isColumn = index >= sourceWalls.length;
    const fallbackId = numberedId(isColumn ? "column" : "wall", isColumn ? index - sourceWalls.length : index);
    const start = toScenePoint(rawStart);
    const end = toScenePoint(rawEnd);
    const key = [start, end].map((point) => point.map((coordinate) => Math.round(coordinate * MM_PER_M)).join(",")).sort().join(";");
    if (wallKeys.has(key)) {
      wallAliases.set(source.id || fallbackId, wallKeys.get(key));
      return [];
    }
    const id = uniqueId(source.id, fallbackId, wallIds);
    const measuredThickness = mm(source.thickness_mm ?? source.thickness);
    if (measuredThickness === undefined) estimatedWalls += 1;
    wallAliases.set(source.id || fallbackId, id);
    wallKeys.set(key, id);
    return [{
      id, name: source.name || (isColumn ? `结构柱线 ${index - sourceWalls.length + 1}` : `墙体 ${index + 1}`),
      start, end, thicknessM: measuredThickness ?? DEFAULT_WALL_THICKNESS_M,
      heightM: mm(source.height_mm ?? source.height) ?? floorHeight,
    }];
  });
  if (estimatedWalls) warnings.push(`${estimatedWalls} 段 CAD 墙柱线缺少厚度，实时预览暂按 150 毫米画线，实际净宽需复核。`);

  const labels = Array.isArray(floorPlan.room_labels) ? floorPlan.room_labels : [];
  const roomAliases = new Map();
  const roomIds = new Set();
  const rooms = sourceRooms.flatMap((boundary, index) => {
    const points = (Array.isArray(boundary.polygon) ? boundary.polygon : []).map(cadPoint);
    if (points.some((point) => !point)) return [];
    const polygon = points.map(toScenePoint).filter((point, i, list) => !i || distance(point, list[i - 1]) > 0.0001);
    if (polygon.length > 1 && distance(polygon[0], polygon[polygon.length - 1]) < 0.0001) polygon.pop();
    if (!usablePolygon(polygon)) return [];
    const matches = labels.filter((label) => (boundary.label_id && label.id === boundary.label_id) || (boundary.id && label.boundary_id === boundary.id));
    const spatial = !matches.length && !boundary.name ? labels.filter((label) => {
      const point = cadPoint(label.position);
      return point && containsPoint(toScenePoint(point), polygon);
    }) : [];
    const label = matches[0] || (spatial.length === 1 ? spatial[0] : null);
    const roomName = boundary.name || label?.name || `空间 ${index + 1}`;
    const id = uniqueId(boundary.id ?? label?.id, numberedId("room", index), roomIds);
    for (const alias of [id, boundary.id, boundary.label_id, label?.id]) {
      if (alias && !roomAliases.has(alias)) roomAliases.set(alias, id);
    }
    return [{ id, name: roomName, polygon, excludeFromRoutes: boundary.excludeFromRoutes === true ||
      /电梯厅|电梯前室|楼梯间|公共走廊|室外|elevator|lift lobby|stairwell|exterior|outdoor/i.test(roomName) }];
  });
  if (!rooms.length) warnings.push("CAD 缺少可用的封闭房间边界，可先查看墙体，补齐边界后再漫游和摆位。");
  else if (rooms.length < sourceRooms.length) warnings.push(`${sourceRooms.length - rooms.length} 个无效 CAD 房间边界未导入。`);
  if (floorPlan.beams?.length) warnings.push("CAD 横梁缺少可用标高和断面尺寸，实时摆位暂不计入横梁。");
  const roomEdgeFrames = rooms.flatMap(({ polygon }) => roomEdges(polygon).map((edge) => frame(...edge)));

  const openingIds = new Set();
  const unresolvedMarkers = [];
  let missingOpenings = 0;
  let assumedDoors = 0;
  let unresolvedWindows = 0;
  let entranceId = null;
  const doors = Array.isArray(floorPlan.doors) ? floorPlan.doors : [];
  const windows = Array.isArray(floorPlan.windows) ? floorPlan.windows : [];
  const openings = doors.concat(windows).flatMap((source, index) => {
    const raw = source.raw || {};
    const kind = raw.opening_kind === "passage" ? "passage" : (source.kind || (index < doors.length ? "door" : "window"));
    const start = cadPoint(raw.start ?? source.start);
    const end = cadPoint(raw.end ?? source.end);
    const sourceSegment = start && end && distance(start, end) >= GEOMETRY_EPSILON_M * MM_PER_M ? [start, end].map(toScenePoint) : null;
    const sourceCenter = cadPoint(source.center);
    const center = sourceSegment ? midpoint(...sourceSegment) : (sourceCenter && toScenePoint(sourceCenter));
    const width = sourceSegment ? distance(...sourceSegment) : mm(source.width);
    if (!center || !Number.isFinite(width) || width < GEOMETRY_EPSILON_M) { missingOpenings += 1; return []; }
    const wallId = wallAliases.get(raw.wall_id ?? source.wall_id);
    const host = pickHostWall(walls, wallId, sourceSegment, center, width);
    const marker = !host && !sourceSegment ? nearbyOpeningMarker(roomEdgeFrames, kind, center, width) : null;
    const segment = host?.segment || sourceSegment || marker;
    if (!segment) { missingOpenings += 1; return []; }
    if (marker) {
      const sameMarker = unresolvedMarkers.some(({ kind: savedKind, start, end }) => savedKind === kind &&
        ((distance(start, marker[0]) < 0.035 && distance(end, marker[1]) < 0.035) ||
          (distance(start, marker[1]) < 0.035 && distance(end, marker[0]) < 0.035)));
      if (sameMarker) return [];
      unresolvedMarkers.push({ kind, start: marker[0], end: marker[1] });
    }
    const indexInGroup = index < doors.length ? index : index - doors.length;
    const rawId = source.id ?? raw.id;
    const id = uniqueId(rawId, numberedId(kind, indexInGroup), openingIds);
    const label = kind === "door" ? "门洞" : kind === "window" ? "窗" : "通道洞口";
    const measuredSill = mm(raw.sill_mm ?? source.sill_mm);
    const measuredTop = mm(raw.top_mm ?? source.top_mm);
    const measuredHeight = mm(raw.height_mm ?? source.height_mm) ?? (measuredTop !== undefined && measuredSill !== undefined ? measuredTop - measuredSill : undefined);
    const elevationsKnown = measuredSill >= 0 && measuredSill <= 8 && measuredHeight >= GEOMETRY_EPSILON_M && measuredHeight <= 12;
    let excludedReason = raw.excluded_reason || source.excludedReason || (!host ? "CAD 洞口定位或所属墙体需要复核" : undefined);
    if (kind === "window" && !elevationsKnown) {
      unresolvedWindows += 1;
      excludedReason ||= "CAD 窗台或窗高未标注，待复核";
    }
    if (!excludedReason && kind !== "window" && !elevationsKnown) assumedDoors += 1;
    const opening = {
      id, kind, name: source.name || raw.name || `${label} ${indexInGroup + 1}`, segment, wallId: host?.wall.id ?? null,
      doorType: ["hinged", "sliding"].includes(raw.door_type) ? raw.door_type : "unknown",
      roomIds: openingRooms(segment, host?.wall.thicknessM ?? DEFAULT_WALL_THICKNESS_M, raw.room_ids, rooms, roomAliases),
      sillM: measuredSill >= 0 && measuredSill <= 8 ? measuredSill : 0,
      heightM: measuredHeight >= GEOMETRY_EPSILON_M && measuredHeight <= 12 ? measuredHeight : (kind === "window" ? GEOMETRY_EPSILON_M : Math.min(DEFAULT_DOOR_HEIGHT_M, floorHeight)),
      ...(excludedReason ? { excludedReason } : {}),
    };
    const swing = cadPoint(raw.swing_side);
    if (kind === "door" && opening.doorType === "hinged" && host && sourceSegment && !excludedReason &&
        ["start", "end"].includes(raw.hinge) && swing && Math.abs(dot([swing[0], -swing[1]], frame(...segment).across)) > 0.001) {
      const magnitude = Math.hypot(...swing);
      opening.hinge = raw.hinge;
      opening.swingSide = [swing[0] / magnitude, -swing[1] / magnitude];
    }
    const measuredFrame = mm(raw.frame_thickness_mm ?? source.frame_thickness_mm);
    if (measuredFrame >= 0 && measuredFrame <= 0.25 && measuredFrame < width / 2) opening.frameThicknessM = measuredFrame;
    if (kind !== "window" && !excludedReason && (raw.is_entrance === true || (floorPlan.entrance_id && floorPlan.entrance_id === (rawId ?? id)))) entranceId = id;
    return [opening];
  });
  if (missingOpenings) warnings.push(`${missingOpenings} 处 CAD 门窗缺少可匹配的墙线、方向或尺寸，空间检查前需要人工复核。`);
  if (unresolvedMarkers.length) warnings.push(`${unresolvedMarkers.length} 处 CAD 门窗仅能根据附近房间边定位，保留为待复核标记。`);
  if (unresolvedWindows) warnings.push(`${unresolvedWindows} 处 CAD 窗台或窗高未确认，预览保留完整墙面。`);
  if (assumedDoors) warnings.push(`${assumedDoors} 处 CAD 门洞标高未确认，实时预览暂按地面至 2,100 毫米表达。`);
  if (openings.some((opening) => opening.kind === "door" && opening.doorType !== "sliding" && !opening.hinge)) {
    warnings.push("CAD 门扇未提供可确认的铰链和开向时，仅显示固定洞口。");
  }
  const placedItems = items.map((item) => ({ ...item, roomId: roomAliases.get(item.roomId) || item.roomId,
    center: origin.some(Boolean) ? [item.center[0] - origin[0] / MM_PER_M, item.center[1] + origin[1] / MM_PER_M] : item.center }));
  return loadLayoutScene({ schema: LAYOUT_SCHEMA, name: name || floorPlan.name || "CAD 户型", rooms, walls, openings,
    items: placedItems, entranceId, warnings: warnings.slice(0, 250) });
}

const SOFA = { name: "沙发", widthM: 1.9, depthM: 0.82, heightM: 0.84 };
const DESK = { name: "书桌", widthM: 1.08, depthM: 0.56, heightM: 0.74 };
const DINING_TABLE = { name: "餐桌", widthM: 1.15, depthM: 0.72, heightM: 0.75, centered: true };
const DOUBLE_BED = { name: "双人床", widthM: 1.52, depthM: 2.02, heightM: 0.9 };
const SINGLE_BED = { name: "单人床", widthM: 1.0, depthM: 1.98, heightM: 0.85 };
const DINING_CHAIR = { widthM: 0.46, depthM: 0.48, heightM: 0.8, bottomM: 0 };

function furnishings(room) {
  const name = room.name.toLowerCase();
  if (/公卫|主卫|卫生间|浴室|厨房|bathroom|toilet|kitchen/.test(name)) return [];
  if (/客餐厅|living.{0,8}dining/.test(name)) return [SOFA, DINING_TABLE];
  if (/客厅|起居室|living|lounge/.test(name)) return [SOFA];
  if (/餐厅|餐区|dining/.test(name)) return [DINING_TABLE];
  if (/儿童房|儿童卧室|kids? room/.test(name)) return [SINGLE_BED];
  if (/主卧|卧室|次卧|客卧|bedroom/.test(name)) return [DOUBLE_BED];
  if (/书房|家庭办公|study|home office/.test(name)) return [DESK];
  return [];
}

function footprint(center, width, depth, rotation) {
  const along = [Math.cos(rotation), Math.sin(rotation)];
  const across = [-along[1], along[0]];
  return { center, along, across, halfWidth: width / 2, halfDepth: depth / 2 };
}

function strip(start, end, depth, widthPadding = 0) {
  return footprint(midpoint(start, end), distance(start, end) + widthPadding * 2, depth,
    Math.atan2(end[1] - start[1], end[0] - start[0]));
}

function overlapping(a, b) {
  const projectedRadius = (box, axis) => Math.abs(dot(box.along, axis)) * box.halfWidth + Math.abs(dot(box.across, axis)) * box.halfDepth;
  const centers = [a.center[0] - b.center[0], a.center[1] - b.center[1]];
  return [a.along, a.across, b.along, b.across].every((axis) => Math.abs(dot(centers, axis)) < projectedRadius(a, axis) + projectedRadius(b, axis));
}

function roomEdges(polygon) {
  return polygon.map((point, i) => [point, polygon[(i + 1) % polygon.length]]).filter(([a, b]) => distance(a, b) > GEOMETRY_EPSILON_M);
}

function itemFootprint(item, padding = 0) {
  return footprint(item.center, item.widthM + 2 * padding, item.depthM + 2 * padding, item.rotationRad);
}

function inRoom(placement, polygon, boundary) {
  const { center, along, across, halfWidth, halfDepth } = placement;
  return [1, -1].every((side) => [1, -1].every((front) => containsPoint(offset(offset(center, along, side * halfWidth), across, front * halfDepth), polygon))) &&
    !boundary.some((edge) => overlapping(placement, edge));
}

function candidates(edges, room, item) {
  const orderedEdges = [...edges].sort((a, b) => distance(...b) - distance(...a));
  if (!item.centered) return orderedEdges.flatMap(([start, end]) => {
    const { along, across, length, at } = frame(start, end);
    if (length < item.widthM + 0.24) return [];
    const inward = containsPoint(offset(at(length / 2), across, 0.05), room.polygon) ? 1 : -1;
    const rotationRad = Math.atan2(along[1], along[0]) + (inward < 0 ? Math.PI : 0);
    return [0.5, 0.32, 0.68, 0.20, 0.80].map((fraction) => ({
      center: offset(at(length * fraction), across, inward * (item.depthM / 2 + 0.24)), rotationRad,
    }));
  });
  const xs = room.polygon.map(([x]) => x);
  const zs = room.polygon.map(([, z]) => z);
  const minX = Math.min(...xs), minZ = Math.min(...zs);
  const width = Math.max(...xs) - minX, depth = Math.max(...zs) - minZ;
  const [start, end] = orderedEdges[0];
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  return [0.5, 0.36, 0.64, 0.23, 0.77].flatMap((x) => [0.5, 0.36, 0.64, 0.23, 0.77].flatMap((z) =>
    [angle, angle + Math.PI / 2].map((rotationRad) => ({ center: [minX + x * width, minZ + z * depth], rotationRad }))));
}

function placementBarriers(scene) {
  return scene.walls.map((wall) => strip(wall.start, wall.end, wall.thicknessM)).concat(
    scene.openings.filter((opening) => opening.kind !== "window").map((opening) => {
      const clearance = opening.doorType === "hinged" ? Math.max(0.8, distance(...opening.segment)) : 0.8;
      return strip(...opening.segment, clearance * 2, 0.2);
    }),
  );
}

export function buildInitialLayout(layout) {
  const scene = loadLayoutScene(layout);
  const placed = [...scene.items];
  const ids = new Set(placed.map(({ id }) => id));
  const preexisting = new Set(scene.rooms.filter((room) => placed.some((item) =>
    item.roomId === room.id || containsPoint(item.center, room.polygon))).map(({ id }) => id));
  const barriers = placementBarriers(scene);
  const existing = placed.filter((item) => item.bottomM < 1.7 && item.bottomM + item.heightM > 0.075)
    .map((item) => itemFootprint(item, 0.24));

  for (const room of scene.rooms) {
    if (room.excludeFromRoutes || preexisting.has(room.id)) continue;
    const selected = furnishings(room);
    if (!selected.length || placed.length >= 700) continue;
    const edges = roomEdges(room.polygon);
    if (!edges.length) continue;
    const boundary = edges.map((edge) => strip(...edge, 0.025));
    for (const dimensions of selected) {
      if (placed.length >= 700) break;
      const { centered, ...shape } = dimensions;
      const position = candidates(edges, room, dimensions).find((pose) => {
        const body = itemFootprint({ ...shape, ...pose }, centered ? 0.48 : 0.12);
        return inRoom(body, room.polygon, boundary) && !barriers.some((barrier) => overlapping(body, barrier)) &&
          !existing.some((item) => overlapping(body, item));
      });
      if (!position) continue;
      const item = { ...shape, ...position, roomId: room.id, bottomM: 0 };
      const navigation = createWalkNavigation({ ...scene, items: [...placed, item] });
      if (!navigation.spawn(room.id)) continue;
      item.id = uniqueId(null, numberedId("starter_item", placed.length), ids);
      placed.push(item);
      existing.push(itemFootprint(item, 0.24));
    }
  }
  if (placed.length === scene.items.length) return scene;
  const warnings = [...scene.warnings.slice(0, 249), "初始家具采用按尺寸布置的可编辑模型，位置和尺寸可在校对页调整。"];
  return loadLayoutScene({ ...scene, items: placed, warnings });
}

function requestedShape(requirement, previous) {
  const dining = requirement.kind === "dining-table";
  const preset = dining ? DINING_TABLE : SOFA;
  const seatCount = requirement.seats;
  const length = previous && Math.max(previous.widthM, previous.depthM);
  const depth = previous && Math.min(previous.widthM, previous.depthM);
  const existingRound = previous?.shape === "round" || (previous && !previous.shape && length / depth <= 1.2);
  const differentAxes = requirement.widthM && requirement.depthM && Math.abs(requirement.widthM - requirement.depthM) > 0.005;
  const round = dining && (requirement.shape === "round" || (!requirement.shape && existingRound && !differentAxes));
  const widthM = requirement.widthM ?? (round ? requirement.depthM : undefined) ?? (seatCount
    ? (round ? Math.max(0.95, 0.71 + seatCount * 0.116) : Math.max(1.08, Math.floor(seatCount / 2) * 0.54 + 0.12))
    : length || preset.widthM);
  const depthM = round ? widthM : requirement.depthM ?? (seatCount ? 0.83 : depth || preset.depthM);
  if (widthM < (dining ? 0.65 : 0.8) || widthM > 5 || depthM < 0.5 || depthM > widthM ||
      (!dining && depthM > 2) || (round && Math.abs((requirement.depthM ?? widthM) - widthM) > 0.005)) return null;
  if (seatCount && ((!round && widthM < Math.floor(seatCount / 2) * 0.48) ||
     (round && Math.PI * widthM < seatCount * 0.48))) return null;
  return {
    name: previous?.name || preset.name, widthM, depthM, heightM: previous?.heightM ?? preset.heightM,
    bottomM: previous?.bottomM ?? 0, ...(dining ? { shape: round ? "round" : "rectangular" } : {}),
  };
}

function chairPositions(table, seats, phase) {
  if (!seats) return [];
  const angle = table.rotationRad;
  const local = (x, z) => [table.center[0] + x * Math.cos(angle) - z * Math.sin(angle),
    table.center[1] + x * Math.sin(angle) + z * Math.cos(angle)];
  const create = (x, z, direction) => ({
    ...DINING_CHAIR, center: local(x, z), rotationRad: angle + direction - Math.PI / 2, roomId: table.roomId,
  });
  const gap = DINING_CHAIR.depthM / 2 + 0.07;
  if (table.shape === "round") {
    return Array.from({ length: seats }, (_, index) => {
      const direction = 2 * Math.PI * (index + phase) / seats;
      const [x, z] = [Math.cos(direction), Math.sin(direction)];
      const intersectsAlong = (table.widthM / 2 + Math.abs(z) * DINING_CHAIR.widthM / 2) / Math.abs(x);
      const intersectsAcross = (table.depthM / 2 + Math.abs(x) * DINING_CHAIR.widthM / 2) / Math.abs(z);
      const radius = Math.min(intersectsAlong, intersectsAcross) + gap;
      return create(x * radius, z * radius, direction);
    });
  }
  const eachSide = Math.floor(seats / 2);
  const chairs = [-1, 1].flatMap((side) => Array.from({ length: eachSide }, (_, index) => {
    const x = (index + 0.5 - eachSide / 2) * table.widthM / eachSide;
    return create(x, side * (table.depthM / 2 + gap), side * Math.PI / 2);
  }));
  if (seats % 2) {
    const side = phase ? -1 : 1;
    chairs.push(create(side * (table.widthM / 2 + gap), 0, side === 1 ? 0 : Math.PI));
  }
  return chairs;
}

function fitRequirement(scene, room, requirement, barriers) {
  const dining = requirement.kind === "dining-table";
  const match = dining ? isDiningTable : (item) => /沙发|sofa/i.test(item.name);
  const existing = scene.items.filter((item) => item.roomId === room.id && match(item));
  if (existing.length > 1) return { reason: "该空间有多件同类家具，需指定要调整哪一件。" };
  const [previous] = existing;
  const shape = requestedShape(requirement, previous);
  if (!shape) return { reason: "给定家具尺寸和座数无法组合，请核对尺寸或座数。" };
  const existingChairs = dining && previous ? scene.items.filter((item) =>
    item.roomId === room.id && /餐椅|dining[-_ ]?chair/i.test(item.name) && distance(previous.center, item.center) <= 2) : [];
  const seats = requirement.seats ?? existingChairs.length;
  if (seats > 12) return { reason: "餐桌附近有超过 12 把餐椅，需确认哪些座位随餐桌调整。" };
  const removed = new Set(dining ? existing.concat(existingChairs) : existing);
  const retained = scene.items.filter((item) => !removed.has(item));
  if (retained.length + 1 + seats > 700) return { reason: "方案中的家具数量已达到上限。" };
  const obstacles = retained.filter((item) => item.bottomM < 1.7 && item.bottomM + item.heightM > 0.075)
    .map((item) => itemFootprint(item, 0.035));
  const edges = roomEdges(room.polygon);
  if (!edges.length) return { reason: "空间边界不足，需复核户型图。" };
  const boundary = edges.map((edge) => strip(...edge, 0.025));
  const windows = scene.openings.filter((opening) => opening.kind === "window" && !opening.excludedReason &&
    opening.roomIds.includes(room.id) && opening.sillM < shape.heightM + shape.bottomM)
    .map((opening) => strip(...opening.segment, 0.5));
  const inside = (body) => inRoom(body, room.polygon, boundary)
    && !barriers.some((barrier) => overlapping(body, barrier))
    && !obstacles.some((item) => overlapping(body, item));
  const positions = candidates(edges, room, { ...shape, centered: dining });
  if (previous) {
    const rotation = previous.rotationRad - (previous.widthM < previous.depthM ? Math.PI / 2 : 0);
    positions.unshift({ center: previous.center, rotationRad: Math.atan2(Math.sin(rotation), Math.cos(rotation)) });
  }
  for (const pose of positions) {
    const main = { ...shape, ...pose, roomId: room.id };
    const keepsPosition = previous && pose.center === previous.center;
    const body = itemFootprint(main, seats ? 0.025 : dining ? 0.25 : keepsPosition ? 0.02 : 0.08);
    if (!inside(body) || windows.some((window) => overlapping(body, window))) continue;
    for (const phase of [0, 0.5]) {
      const chairs = chairPositions(main, seats, phase);
      const chairBodies = chairs.map((item) => itemFootprint(item, 0.018));
      if (chairBodies.some((chair, index) => !inside(chair) || overlapping(chair, body) ||
        chairBodies.slice(0, index).some((other) => overlapping(chair, other)))) continue;
      const navigation = createWalkNavigation({ ...scene, items: [...retained, main, ...chairs] });
      if (!navigation.spawn(room.id)) continue;
      return { main, chairs, previous, existingChairs, retained };
    }
  }
  return { reason: "按给定尺寸找不到同时避开墙体、洞口和其他家具的摆位。" };
}

export function applyFurnitureRequirements(layout, directives) {
  let scene = loadLayoutScene(layout);
  const applied = [];
  const needsReview = [];
  const barriers = placementBarriers(scene);
  for (const requirement of directives) {
    const room = scene.rooms.find(({ id, excludeFromRoutes }) => id === requirement.roomId && !excludeFromRoutes);
    if (!room) {
      needsReview.push({ description: `${requirement.source.slice(0, 150)}。 请确认方案中的目标空间。` });
      continue;
    }
    const placement = fitRequirement(scene, room, requirement, barriers);
    if (placement.reason) {
      needsReview.push({ roomId: room.id, description: `${requirement.source.slice(0, 150)}。 ${placement.reason}` });
      continue;
    }
    const { main, chairs, previous, existingChairs, retained } = placement;
    const ids = new Set(scene.items.map(({ id }) => id));
    main.id = previous?.id ?? uniqueId(null, numberedId("design_item", scene.items.length), ids);
    for (const [index, chair] of chairs.entries()) {
      chair.id = existingChairs[index]?.id ?? uniqueId(null, numberedId("design_seat", scene.items.length + index), ids);
      chair.name = existingChairs[index]?.name ?? `餐椅 ${index + 1}`;
    }
    scene = { ...scene, items: [...retained, main, ...chairs] };
    const dimensions = main.shape === "round" ? `圆桌直径 ${Math.round(main.widthM * MM_PER_M)} 毫米`
      : `${main.shape === "rectangular" ? "矩形餐桌" : "沙发"} ${Math.round(main.widthM * MM_PER_M)} × ${Math.round(main.depthM * MM_PER_M)} 毫米`;
    applied.push({ roomId: room.id, itemId: main.id, description: `已布置${dimensions}${chairs.length ? `，配 ${chairs.length} 把餐椅` : ""}。` });
  }
  return { layout: loadLayoutScene(scene), applied, needsReview };
}
