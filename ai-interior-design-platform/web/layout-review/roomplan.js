import { containsPoint, LAYOUT_SCHEMA, loadLayoutScene } from "./scene.js";

const EPSILON = 1e-8;
const DEFAULT_WALL_THICKNESS_M = 0.15;
const MIN_WALL_LENGTH_M = 0.02;
const MAX_WALLS = 700;
const MAX_VERTICES = 6000;
const MAX_ITEMS = 700;
const SURFACE_NAMES = { doors: "门", windows: "窗", openings: "通道洞口" };
const ROOM_NAMES = {
  bathroom: "卫生间", bedroom: "卧室", diningRoom: "餐厅", kitchen: "厨房",
  livingRoom: "客厅", office: "书房", storage: "储藏间", unidentified: "未命名空间",
};
const FURNITURE_NAMES = {
  bathtub: "浴缸", bed: "床", cabinet: "柜体", chair: "椅子", dishwasher: "洗碗机",
  fireplace: "壁炉", oven: "烤箱", refrigerator: "冰箱", sink: "水槽", sofa: "沙发",
  stairs: "楼梯", storage: "收纳柜", stove: "灶具", table: "桌子", television: "电视", toilet: "坐便器",
  washerDryer: "洗衣设备",
};

function error(field, reason) {
  throw new Error(`RoomPlan 的 ${field}${reason}。`);
}

function array(raw, key) {
  if (raw[key] === undefined) return [];
  if (!Array.isArray(raw[key])) error(key, "应为数组");
  return raw[key];
}

function storyOf(entity) {
  if (entity?.story === undefined) return 0;
  if (!Number.isSafeInteger(entity.story)) error("story", "应为整数");
  return entity.story;
}

function sizeOf(entity, path, requireDepth = false) {
  const size = entity?.dimensions;
  if (!Array.isArray(size) || size.length < 2 || size.length > 3 || !size.every(Number.isFinite)) {
    error(`${path}.dimensions`, "应包含有限的米制尺寸");
  }
  if (size.some((axis) => axis > 100) || size[0] < 0 || size[1] <= 0 || (size[2] ?? 0) < 0 ||
      (requireDepth && !(size[2] > 0))) {
    error(`${path}.dimensions`, "尺寸无效");
  }
  return size;
}

function matrixOf(entity, path) {
  let transform = entity?.transform;
  if (Array.isArray(transform) && transform.length === 4 && transform.every((column) => (
    Array.isArray(column) && column.length === 4
  ))) transform = transform.flat();
  if (!Array.isArray(transform) || transform.length !== 16 || !transform.every(Number.isFinite)) {
    error(`${path}.transform`, "应为有限的 4×4 矩阵");
  }
  return transform;
}

function toElement(entity, path, usedIds, requireDepth = false) {
  const id = entity?.identifier;
  if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,150}$/.test(id)) error(`${path}.identifier`, "编号无效");
  if (usedIds.has(id)) error(`${path}.identifier`, "编号重复");
  usedIds.add(id);
  const size = sizeOf(entity, path, requireDepth);
  const matrix = matrixOf(entity, path);
  const horizontal = Math.hypot(matrix[0], matrix[2]);
  if (!Number.isFinite(horizontal) || horizontal < EPSILON) error(`${path}.transform`, "缺少水平朝向");
  if (matrix.slice(12, 15).some((value) => Math.abs(value) > 500)) {
    error(`${path}.transform`, "位置超出单层住宅校对范围");
  }
  return { id, size, matrix, center: [matrix[12], matrix[14]], direction: [matrix[0] / horizontal, matrix[2] / horizontal] };
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function translate([x, z], direction, distance) {
  return [x + direction[0] * distance, z + direction[1] * distance];
}

function signedArea(polygon) {
  return polygon.reduce((sum, point, index) => sum + cross(point, polygon[(index + 1) % polygon.length]), 0) / 2;
}

function compactPath(path) {
  const result = [];
  for (const vertex of path) {
    if (result.at(-2) === vertex) result.pop();
    else result.push(vertex);
  }
  let first = 0;
  let last = result.length - 1;
  while (last - first > 1) {
    if (result[first] === result[last]) last--;
    else if (result[first + 1] === result[last]) {
      first++;
      last--;
    } else break;
  }
  return result.slice(first, last + 1);
}

// Weld scan endpoints for room detection only. The 3D walls retain the capture's
// measured endpoints; the derived polygons follow the planar graph's bounded faces.
function closedWallFaces(walls, tolerance) {
  const vertices = [];
  const buckets = new Map();
  const toleranceSquared = tolerance ** 2;
  function vertex([x, z]) {
    const a = Math.floor(x / tolerance);
    const b = Math.floor(z / tolerance);
    let match = -1;
    let distance = toleranceSquared;
    for (let i = a - 1; i <= a + 1; i++) {
      for (let j = b - 1; j <= b + 1; j++) {
        for (const index of buckets.get(`${i},${j}`) || []) {
          const point = vertices[index];
          const dist = (point[0] - x) ** 2 + (point[1] - z) ** 2;
          if (dist < distance) {
            distance = dist;
            match = index;
          }
        }
      }
    }
    if (match !== -1) return match;
    if (vertices.length === MAX_VERTICES) error("墙体", "交点过多，请分开校对");
    const index = vertices.push([x, z]) - 1;
    const key = `${a},${b}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(index);
    return index;
  }

  const edges = walls.flatMap((wall) => {
    const start = vertex(wall.start);
    const end = vertex(wall.end);
    if (start === end) return [];
    const delta = subtract(vertices[end], vertices[start]);
    return [{ delta, lengthSquared: dot(delta, delta), start, end, splits: new Set([start, end]) }];
  });

  function addNearbyJunction(edge, index) {
    const offset = subtract(vertices[index], vertices[edge.start]);
    const t = dot(offset, edge.delta) / edge.lengthSquared;
    if (t > 0 && t < 1 && cross(offset, edge.delta) ** 2 < toleranceSquared * edge.lengthSquared) {
      edge.splits.add(index);
    }
  }

  for (const [index, edge] of edges.entries()) {
    for (let next = index + 1; next < edges.length; next++) {
      const other = edges[next];
      if (edge.start !== other.start && edge.end !== other.start) addNearbyJunction(edge, other.start);
      if (edge.start !== other.end && edge.end !== other.end) addNearbyJunction(edge, other.end);
      if (other.start !== edge.start && other.end !== edge.start) addNearbyJunction(other, edge.start);
      if (other.start !== edge.end && other.end !== edge.end) addNearbyJunction(other, edge.end);
      const denominator = cross(edge.delta, other.delta);
      if (Math.abs(denominator) < EPSILON) continue;
      const offset = subtract(vertices[other.start], vertices[edge.start]);
      const alongEdge = cross(offset, other.delta) / denominator;
      const alongOther = cross(offset, edge.delta) / denominator;
      if (alongEdge > 0 && alongEdge < 1 && alongOther > 0 && alongOther < 1) {
        const crossing = vertex(translate(vertices[edge.start], edge.delta, alongEdge));
        edge.splits.add(crossing);
        other.splits.add(crossing);
      }
    }
  }

  const links = vertices.map(() => new Set());
  for (const edge of edges) {
    const from = vertices[edge.start];
    const splits = [...edge.splits].sort((a, b) => (
      dot(subtract(vertices[a], from), edge.delta) - dot(subtract(vertices[b], from), edge.delta)
    ));
    for (let index = 1; index < splits.length; index++) {
      links[splits[index - 1]].add(splits[index]);
      links[splits[index]].add(splits[index - 1]);
    }
  }
  const sorted = links.map((neighbors, index) => {
    const [x, z] = vertices[index];
    const angle = ([a, b]) => Math.atan2(b - z, a - x);
    return [...neighbors].sort((a, b) => angle(vertices[a]) - angle(vertices[b]));
  });
  const visited = new Set();
  const faces = [];
  for (const [start, neighbors] of sorted.entries()) {
    for (const next of neighbors) {
      if (visited.has(`${start},${next}`)) continue;
      const path = [];
      let a = start;
      let b = next;
      while (!visited.has(`${a},${b}`)) {
        visited.add(`${a},${b}`);
        path.push(a);
        const adjacent = sorted[b];
        [a, b] = [b, adjacent[(adjacent.indexOf(a) + adjacent.length - 1) % adjacent.length]];
      }
      const face = compactPath(path);
      if (a !== start || b !== next || face.length < 3 || new Set(face).size !== face.length) continue;
      const polygon = face.map((index) => vertices[index]);
      if (signedArea(polygon) > 0.01) faces.push(polygon);
    }
  }
  return faces;
}

function floorPolygons(floors) {
  return floors.flatMap((floor, index) => {
    const corners = floor?.polygonCorners;
    if (!Array.isArray(corners) || corners.length < 3 || corners.length > 201) return [];
    const matrix = matrixOf(floor, `floors[${index}]`);
    const points = corners.map((corner) => {
      if (!Array.isArray(corner) || corner.length !== 3 || !corner.every(Number.isFinite)) {
        error(`floors[${index}].polygonCorners`, "角点无效");
      }
      const [x, y, z] = corner;
      return [matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
        matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]];
    });
    if (Math.hypot(...subtract(points[0], points.at(-1))) < EPSILON) points.pop();
    return Math.abs(signedArea(points)) > 0.01 ? [points] : [];
  });
}

function nameRooms(polygons, sections, warnings) {
  const anchors = sections.map((section, index) => {
    if (!Array.isArray(section.center) || section.center.length !== 3 || !section.center.every(Number.isFinite)) {
      error(`sections[${index}].center`, "应为有限的三维坐标");
    }
    return {
      point: [section.center[0], section.center[2]],
      name: section.displayName || ROOM_NAMES[section.label] || section.label,
    };
  });
  const unmatched = anchors.filter(({ point }) => !polygons.some((polygon) => containsPoint(point, polygon))).length;
  if (unmatched) warnings.push(`${unmatched} 个扫描房间标签未匹配到闭合区域，相关空间仍需核对墙线。`);
  return polygons.map((polygon, index) => ({
    id: `roomplan-room-${index + 1}`,
    name: anchors.find(({ point }) => containsPoint(point, polygon))?.name || `空间 ${index + 1}`,
    polygon,
  }));
}

function wallFit(element, wall) {
  const offset = subtract(element.center, wall.start);
  const along = dot(offset, wall.direction);
  const distance = Math.abs(cross(offset, wall.direction));
  const halfWidth = element.size[0] / 2;
  if (along - halfWidth < -0.10 || along + halfWidth > wall.lengthM + 0.10) return null;
  if (distance > Math.max(0.08, wall.thicknessM / 2 + 0.04)) return null;
  if (Math.abs(dot(element.direction, wall.direction)) < 0.90) return null;
  return { wall, along };
}

function openingRooms(rooms, center, direction, thickness) {
  const across = [-direction[1], direction[0]];
  const step = thickness / 2 + 0.12;
  const sides = [translate(center, across, step), translate(center, across, -step)];
  return rooms.filter((room) => sides.some((side) => containsPoint(side, room.polygon))).map((room) => room.id);
}

function applyDoorOrientation(opening, entity, fit, hasKnownParent, warnings) {
  const style = entity.style;
  if (style === "sliding" || style === "patio") {
    opening.doorType = "sliding";
    return;
  }
  if (style === "double") {
    warnings.push(`${opening.name} 为双扇门，需要另行核对开启范围。`);
    return;
  }
  const hasHinge = typeof entity.hingeLeft === "boolean";
  const hasDirection = typeof entity.opensInward === "boolean";
  if (style === "single" || hasHinge || hasDirection) opening.doorType = "hinged";
  if (fit && hasKnownParent && hasHinge && hasDirection) {
    const [dx, dz] = fit.wall.direction;
    opening.hinge = entity.hingeLeft ? "start" : "end";
    opening.swingSide = entity.opensInward ? [-dz, dx] : [dz, -dx];
  } else {
    warnings.push(`${opening.name} 没有可确认的铰链或开向，需要现场核对。`);
  }
}

function buildOpenings(collections, walls, rooms, usedIds, floorY, warnings) {
  const byId = new Map(walls.map((wall) => [wall.id, wall]));
  const result = [];
  for (const key of Object.keys(SURFACE_NAMES)) {
    for (const [index, entity] of collections[key].entries()) {
      const element = toElement(entity, `${key}[${index}]`, usedIds);
      const width = element.size[0];
      const name = `${SURFACE_NAMES[key]} ${index + 1}`;
      if (width < MIN_WALL_LENGTH_M) error(`${key}[${index}].dimensions`, "洞口过窄");
      const parent = byId.get(entity.parentIdentifier);
      let fit = parent && wallFit(element, parent);
      const hasKnownParent = Boolean(fit);
      if (!fit) {
        const nearby = walls.flatMap((wall) => {
          const match = wallFit(element, wall);
          return match ? [match] : [];
        });
        if (nearby.length === 1) {
          [fit] = nearby;
          warnings.push(`${name} 的所属墙体根据位置匹配，建议在图上核对。`);
        } else {
          warnings.push(`${name} 无法确认所属墙体，保留扫描位置供校对。`);
        }
      }
      const direction = fit?.wall.direction || element.direction;
      const center = fit ? translate(fit.wall.start, direction, fit.along) : element.center;
      const segment = fit
        ? [Math.max(0, fit.along - width / 2), Math.min(fit.wall.lengthM, fit.along + width / 2)].map(
          (distance) => translate(fit.wall.start, direction, distance)
        )
        : [-width / 2, width / 2].map((distance) => translate(center, direction, distance));
      const kind = { doors: "door", windows: "window", openings: "passage" }[key];
      const inferredSill = element.matrix[13] - element.size[1] / 2 - (fit?.wall.floorY ?? floorY);
      const sillM = Number.isFinite(entity.sillHeight) ? entity.sillHeight : Math.max(0, inferredSill);
      const opening = {
        id: element.id, name, kind, wallId: fit?.wall.id ?? null, segment,
        roomIds: openingRooms(rooms, center, direction, fit?.wall.thicknessM ?? DEFAULT_WALL_THICKNESS_M),
        heightM: element.size[1], sillM, doorType: "unknown",
      };
      if (kind === "door") applyDoorOrientation(opening, entity, fit, hasKnownParent, warnings);
      result.push(opening);
    }
  }
  return result;
}

/**
 * Normalize Apple RoomPlan / OpenPlan3D Editable Plan JSON in the browser.
 * Both formats use metres and column-major transforms. The review scene is
 * single-storey and retains the capture's X/Z axes and measured geometry.
 */
export function parseRoomPlan(raw, { name, story } = {}) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.walls)) {
    throw new Error("请选择 iPhone RoomPlan 扫描或 OpenPlan3D 导出的 Editable Plan JSON。");
  }
  if (raw.openplanHandoffVersion !== undefined && raw.openplanHandoffVersion !== 1) {
    error("openplanHandoffVersion", "版本暂不支持");
  }
  const collections = Object.fromEntries(["walls", "doors", "windows", "openings", "objects", "sections", "floors"].map(
    (key) => [key, array(raw, key)]
  ));
  const stories = [...new Set(collections.walls.map(storyOf))].sort((a, b) => a - b);
  if (!stories.length) error("walls", "没有可导入的墙体");
  const selected = story ?? (stories.includes(0) ? 0 : stories[0]);
  if (!stories.includes(selected)) error("story", "指定楼层没有可导入的墙体");
  for (const key of Object.keys(collections)) collections[key] = collections[key].filter((entity) => storyOf(entity) === selected);
  if (collections.walls.length > MAX_WALLS || collections.objects.length > MAX_ITEMS ||
      collections.doors.length + collections.windows.length + collections.openings.length > 500 ||
      collections.sections.length > 100 || collections.floors.length > 100) {
    error("住宅布局", "对象过多，请按楼层或房间拆分");
  }

  const warnings = [];
  const usedIds = new Set();
  if (stories.length > 1) warnings.push(`文件有多个楼层，本次校对只读取楼层编号 ${selected}。`);
  let defaultedThickness = 0;
  let curvedWalls = 0;
  let collapsedWalls = 0;
  const walls = collections.walls.flatMap((entity, index) => {
    const { id, size, matrix, center, direction } = toElement(entity, `walls[${index}]`, usedIds);
    const [lengthM, heightM, depth] = size;
    if (lengthM < MIN_WALL_LENGTH_M) {
      collapsedWalls++;
      return [];
    }
    if (entity.curve) curvedWalls++;
    const thicknessM = depth > 0 ? depth : DEFAULT_WALL_THICKNESS_M;
    if (thicknessM !== depth) defaultedThickness++;
    return [{
      id, name: `墙体 ${index + 1}`, center, direction, lengthM, heightM, thicknessM,
      start: translate(center, direction, -lengthM / 2), end: translate(center, direction, lengthM / 2),
      floorY: matrix[13] - heightM / 2,
    }];
  });
  if (!walls.length) error("walls", "没有达到最小长度的墙线");
  const floorElevations = walls.map((wall) => wall.floorY).sort((a, b) => a - b);
  const floorY = floorElevations[Math.floor(floorElevations.length / 2)];
  if (defaultedThickness) warnings.push(`${defaultedThickness} 段墙缺少墙厚，预览暂按 150 毫米处理。`);
  if (curvedWalls) warnings.push(`${curvedWalls} 段曲墙按直墙近似，尺寸需要复核。`);
  if (collapsedWalls) warnings.push(`略过 ${collapsedWalls} 段过短或重合的墙线。`);

  const prepared = raw.openplanPrepared === true || raw.openplanHandoffVersion === 1;
  const polygons = closedWallFaces(walls, prepared ? 0.025 : 0.08);
  const rooms = nameRooms(polygons.length ? polygons : floorPolygons(collections.floors), collections.sections, warnings);
  if (rooms.length) warnings.push("房间边界来自墙线围合或扫描地板轮廓，面积和通行判断应结合现场尺寸。");
  else warnings.push("扫描墙线尚未闭合，当前可查看墙体、洞口和家具。");
  const openings = buildOpenings(collections, walls, rooms, usedIds, floorY, warnings);
  const items = collections.objects.map((entity, index) => {
    const element = toElement(entity, `objects[${index}]`, usedIds, true);
    const category = typeof entity.category === "string" ? entity.category : Object.keys(entity.category || {})[0];
    return {
      id: element.id, name: entity.displayName || FURNITURE_NAMES[category] || `家具 ${index + 1}`,
      roomId: rooms.find((room) => containsPoint(element.center, room.polygon))?.id,
      center: element.center, widthM: element.size[0], heightM: element.size[1], depthM: element.size[2],
      bottomM: Math.max(0, element.matrix[13] - element.size[1] / 2 - floorY),
      rotationRad: Math.atan2(element.direction[1], element.direction[0]),
    };
  });
  warnings.push("扫描文件没有入户标记，通道检查需要指定入户口。");
  if (warnings.length > 250) warnings.splice(249, warnings.length - 249, "另有多处来源或开向需要在图上复核。");
  return loadLayoutScene({
    schema: LAYOUT_SCHEMA, name: name || raw.name || (prepared ? "OpenPlan3D 户型" : "RoomPlan 扫描户型"),
    rooms, walls, openings, items, warnings,
  });
}
