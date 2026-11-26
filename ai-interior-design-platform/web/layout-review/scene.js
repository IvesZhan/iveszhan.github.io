export const LAYOUT_SCHEMA = "layout-review/v1";
const editorMaterials = new Set(["wood", "walnut", "tile800", "tile600", "marble", "antislip", "terrazzo", "carpet"]);

function list(value, field, limit) {
  if (!Array.isArray(value) || value.length > limit) throw new Error(`户型${field}数据无效或数量过多。`);
  return value;
}

function number(value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new Error("户型包含无效的尺寸或坐标。");
  return value;
}

function point(value) {
  if (!Array.isArray(value) || value.length !== 2) throw new Error("户型点位格式无效。");
  return value.map((axis) => number(axis, -500, 500));
}

function cameraPoint(value) {
  if (!Array.isArray(value) || value.length !== 3) throw new Error("全景机位坐标格式无效。");
  return [number(value[0], -500, 500), number(value[1], 0, 12), number(value[2], -500, 500)];
}

function cameraFrame(viewpoint, room) {
  const positionM = cameraPoint(viewpoint.positionM);
  const targetM = cameraPoint(viewpoint.targetM);
  if (!room || positionM[1] < 0.3 || !containsPoint([positionM[0], positionM[2]], room.polygon) ||
      Math.hypot(targetM[0] - positionM[0], targetM[2] - positionM[2]) < 0.01) {
    throw new Error("全景机位需要位于关联空间内，并设置可用的视线方向。");
  }
  return { positionM, targetM };
}

function id(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,150}$/.test(value)) throw new Error("户型对象编号无效。");
  return value;
}

function label(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 120) : fallback;
}

function unique(values) {
  if (new Set(values.map((value) => value.id)).size !== values.length) throw new Error("户型对象编号重复。");
  return values;
}

export function isDiningTable(item) {
  return Boolean(item.shape) || /餐桌|饭桌|圆桌|方桌|矩形桌|dining[-_ ]?table/i.test(item.name);
}

export function loadLayoutScene(scene) {
  if (scene?.schema !== LAYOUT_SCHEMA) throw new Error("户型数据版本不受支持。");
  const rooms = unique(list(scene.rooms, "房间", 100).map((room) => {
    const polygon = list(room.polygon, "房间轮廓", 200).map(point);
    if (polygon.length < 3 || Math.abs(polygonArea(polygon)) < 0.01) throw new Error("户型有无法使用的房间轮廓。");
    return {
      id: id(room.id), name: label(room.name, "未命名空间"), polygon, excludeFromRoutes: room.excludeFromRoutes === true,
      ...(editorMaterials.has(room.editorMaterial) ? { editorMaterial: room.editorMaterial } : {}),
    };
  }));
  const walls = unique(list(scene.walls, "墙体", 700).map((wall) => ({
    id: id(wall.id), name: label(wall.name, "墙体"), start: point(wall.start), end: point(wall.end),
    thicknessM: number(wall.thicknessM, 0.015, 2), heightM: number(wall.heightM, 0.2, 12),
  })));
  const wallIds = new Set(walls.map((wall) => wall.id));
  const roomIds = new Set(rooms.map((room) => room.id));
  if (!walls.length || walls.some((wall) => Math.hypot(wall.start[0] - wall.end[0], wall.start[1] - wall.end[1]) < 0.02)) {
    throw new Error("户型墙线无效，无法建立 3D 校对模型。");
  }
  const openings = unique(list(scene.openings, "门窗", 500).map((opening) => {
    if (!["door", "window", "passage"].includes(opening.kind)) throw new Error("户型有未识别的洞口类型。");
    const segment = list(opening.segment, "洞口定位", 2).map(point);
    if (segment.length !== 2 || Math.hypot(segment[0][0] - segment[1][0], segment[0][1] - segment[1][1]) < 0.02) throw new Error("洞口尺寸无效。");
    const wallId = opening.wallId == null ? null : id(opening.wallId);
    if (wallId && !wallIds.has(wallId)) throw new Error("洞口找不到所属墙体。");
    const result = {
      id: id(opening.id), name: label(opening.name, "未命名洞口"), kind: opening.kind, wallId, segment,
      roomIds: list(opening.roomIds || [], "洞口关联房间", 8).map(id).filter((value) => roomIds.has(value)),
      heightM: number(opening.heightM, 0.02, 12), sillM: number(opening.sillM, 0, 8),
      doorType: ["hinged", "sliding"].includes(opening.doorType) ? opening.doorType : "unknown",
    };
    if (["start", "end"].includes(opening.hinge) && opening.swingSide) {
      result.hinge = opening.hinge;
      result.swingSide = point(opening.swingSide);
    }
    if (opening.frameThicknessM !== undefined) result.frameThicknessM = number(opening.frameThicknessM, 0, 0.25);
    if (opening.excludedReason) result.excludedReason = label(opening.excludedReason, "需要复核");
    return result;
  }));
  const items = unique(list(scene.items || [], "家具", 700).map((item) => ({
    id: id(item.id), name: label(item.name, "家具"), roomId: roomIds.has(item.roomId) ? item.roomId : null,
    center: point(item.center), widthM: number(item.widthM, 0.02, 30), depthM: number(item.depthM, 0.02, 30),
    heightM: number(item.heightM, 0.01, 12), bottomM: number(item.bottomM ?? 0, -0.5, 12),
    rotationRad: number(item.rotationRad ?? 0, -Math.PI * 8, Math.PI * 8),
    ...(["round", "rectangular"].includes(item.shape) ? { shape: item.shape } : {}),
    ...(typeof item.editorType === "string" && /^[a-z][a-z0-9_-]{0,32}$/.test(item.editorType) ? { editorType: item.editorType } : {}),
    ...(typeof item.editorColor === "string" && /^#[a-f0-9]{6}$/i.test(item.editorColor) ? { editorColor: item.editorColor } : {}),
    ...(Number.isFinite(item.editorRotationDeg) && Math.abs(item.editorRotationDeg) <= 1440 ? { editorRotationDeg: item.editorRotationDeg } : {}),
  })));
  const entranceId = openings.some((opening) => opening.id === scene.entranceId && opening.kind !== "window") ? scene.entranceId : null;
  const walkableRooms = new Map(rooms.filter((room) => !room.excludeFromRoutes).map((room) => [room.id, room]));
  const viewpoints = unique(list(scene.viewpoints ?? [], "全景机位", 100).map((viewpoint) => {
    const room = walkableRooms.get(viewpoint.roomId);
    const frame = cameraFrame(viewpoint, room);
    const result = { id: id(viewpoint.id), name: label(viewpoint.name, room.name), roomId: room.id, ...frame };
    if (viewpoint.walkView) {
      result.walkView = { ...cameraFrame(viewpoint.walkView, room), verticalFovDeg: number(viewpoint.walkView.verticalFovDeg, 40, 75) };
    }
    return result;
  }));
  const bounds = getLayoutBounds({ rooms, walls });
  if (bounds.maxX - bounds.minX > 80 || bounds.maxZ - bounds.minZ > 80) throw new Error("请导入单层住宅户型，当前图纸范围过大。");
  return {
    schema: LAYOUT_SCHEMA, name: label(scene.name, "户型校对"), rooms, walls, openings, items, entranceId,
    ...(viewpoints.length ? { viewpoints } : {}),
    warnings: list(scene.warnings || [], "提示", 250).map((message) => label(message, "需要核对图纸数据")),
  };
}

function polygonArea(polygon) {
  return polygon.reduce((sum, [x, z], index) => {
    const [nextX, nextZ] = polygon[(index + 1) % polygon.length];
    return sum + x * nextZ - nextX * z;
  }, 0) / 2;
}

export function getLayoutBounds(scene) {
  const points = scene.walls.flatMap((wall) => [wall.start, wall.end]).concat(scene.rooms.flatMap((room) => room.polygon));
  return {
    minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)),
    minZ: Math.min(...points.map(([, z]) => z)), maxZ: Math.max(...points.map(([, z]) => z)),
  };
}

export function containsPoint([x, z], polygon) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [aX, aZ] = polygon[previous];
    const [bX, bZ] = polygon[index];
    if ((aZ > z) !== (bZ > z) && x < (bX - aX) * (z - aZ) / (bZ - aZ) + aX) inside = !inside;
  }
  return inside;
}

export function toFloorPlan(scene) {
  const cadPoint = ([x, z]) => ({ x: Math.round(x * 1000), y: Math.round(-z * 1000) });
  const pointsBounds = (points) => {
    const x = points.map((p) => p.x);
    const y = points.map((p) => p.y);
    return { min_x: Math.min(...x), min_y: Math.min(...y), max_x: Math.max(...x), max_y: Math.max(...y) };
  };
  const walls = scene.walls.map((wall) => ({ start: cadPoint(wall.start), end: cadPoint(wall.end), layer: "WALL", source: "meter_layout" }));
  const boundaries = scene.rooms.filter((room) => !room.excludeFromRoutes).map((room) => {
    const polygon = room.polygon.map(cadPoint);
    const bounds = pointsBounds(polygon);
    const center = { x: (bounds.min_x + bounds.max_x) / 2, y: (bounds.min_y + bounds.max_y) / 2 };
    return { id: room.id, name: room.name, label_id: room.id, polygon, bounds, center, area: Math.abs(polygonArea(room.polygon)) * 1e6, layer: "ROOM-BOUNDARY", source: "meter_layout" };
  });
  const openings = scene.openings.filter((opening) => !opening.excludedReason && opening.wallId).map((opening) => {
    const [a, b] = opening.segment.map(cadPoint);
    const kind = opening.kind === "window" ? "window" : "door";
    return { kind, center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, width: Math.hypot(b.x - a.x, b.y - a.y),
      layer: kind.toUpperCase(), source: "meter_layout", raw: { start: a, end: b, wall_id: opening.wallId,
        room_ids: opening.roomIds, opening_kind: opening.kind, sill_mm: opening.sillM * 1000, height_mm: opening.heightM * 1000 } };
  });
  const floorHeight = scene.walls.map((wall) => wall.heightM).sort((a, b) => a - b);
  return {
    unit: "mm", floor_height: Math.round(floorHeight[Math.floor(floorHeight.length / 2)] * 1000),
    bounds: pointsBounds(walls.flatMap((wall) => [wall.start, wall.end])), walls,
    room_boundaries: boundaries, room_labels: boundaries.map((room) => ({ id: room.id, name: room.name, position: room.center, layer: "ROOM-TEXT", boundary_id: room.id })),
    doors: openings.filter((opening) => opening.kind === "door"), windows: openings.filter((opening) => opening.kind === "window"),
    parser_warnings: scene.warnings,
  };
}
