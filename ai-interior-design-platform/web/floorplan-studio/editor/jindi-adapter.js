const toMillimeters = (meters) => Math.round(meters * 1000);
const mmPoint = (point) => point.map(toMillimeters);
const midpoint = (low, high) => (low + high) / 2;
const materials = new Set(["wood", "walnut", "tile800", "tile600", "marble", "antislip", "terrazzo", "carpet"]);

function roomCenter(points) {
  const [x, y] = points.reduce(([x, y], [px, py]) => [x + px, y + py], [0, 0]);
  return [x / points.length, y / points.length];
}

function architecturalOpening(opening, rect, vertical, rooms, plane, low, high, entranceId) {
  const { id, name, kind, roomIds, sillM: sill, heightM: height } = opening;
  const room = rooms.find(({ id }) => id === roomIds[0]);
  if (kind === "window") {
    const inwardSign = Math.sign((room?.at[vertical ? 0 : 1] ?? plane + 1) - plane) || 1;
    const inward = vertical ? [inwardSign, 0] : [0, inwardSign];
    return { group: "windows", value: [...rect, { id, sill, head: sill + height, roomId: room?.id, inward }] };
  }
  if (kind === "passage" || opening.doorType !== "hinged" && opening.doorType !== "sliding") {
    return { group: "passages", value: { rect, height, sill } };
  }
  if (opening.doorType === "sliding") return { group: "slides", value: { rect, v: vertical, height, sill } };
  if (!opening.hinge || !opening.swingSide) return { group: "passages", value: { rect, height, sill } };

  const variableAxis = vertical ? 1 : 0;
  const pin = opening.segment[opening.hinge === "start" ? 0 : 1][variableAxis];
  const end = opening.segment[opening.hinge === "start" ? 1 : 0][variableAxis];
  const direction = Math.sign(end - pin);
  const hingeAxis = direction > 0 ? low : high;
  const h = vertical ? [plane, hingeAxis] : [hingeAxis, plane];
  const c = vertical ? [0, direction] : [direction, 0];
  return { group: "doors", value: { name, rect, h, c, o: opening.swingSide, len: high - low, entry: id === entranceId, height, sill } };
}

export function adaptJindiDesign(source) {
  if (source?.schema !== "layout-review/v1" || !source.walls?.length || !Array.isArray(source.rooms)) {
    throw new Error("户型数据格式无效。");
  }
  const rooms = source.rooms.map((room) => {
    const poly = room.polygon.map(mmPoint);
    const mat = materials.has(room.editorMaterial) ? room.editorMaterial : "tile800";
    return { id: room.id, name: room.name, poly, mat, at: roomCenter(poly), counted: !room.excludeFromRoutes };
  });
  const architecture = { walls: [], windows: [], doors: [], slides: [], passages: [] };
  const openingByWall = new Map();
  for (const opening of source.openings) {
    if (!opening.wallId || opening.excludedReason) continue;
    if (!openingByWall.has(opening.wallId)) openingByWall.set(opening.wallId, []);
    openingByWall.get(opening.wallId).push(opening);
  }

  const extents = [];
  const centerLines = [];
  for (const wall of source.walls) {
    const [x0, y0] = mmPoint(wall.start);
    const [x1, y1] = mmPoint(wall.end);
    centerLines.push([x0, y0], [x1, y1]);
    const vertical = x0 === x1;
    if (!vertical && y0 !== y1) throw new Error("当前编辑器支持正交墙线，含斜墙的户型可继续使用空间校对。");
    const axis = vertical ? 1 : 0;
    const start = vertical ? Math.min(y0, y1) : Math.min(x0, x1);
    const end = vertical ? Math.max(y0, y1) : Math.max(x0, x1);
    const plane = vertical ? x0 : y0;
    const halfThickness = toMillimeters(wall.thicknessM) / 2;
    const wallKind = ["b", "n", "low"].includes(wall.editorKind) ? wall.editorKind : "e";
    const rect = (a, b) => vertical
      ? [plane - halfThickness, a, plane + halfThickness, b]
      : [a, plane - halfThickness, b, plane + halfThickness];
    extents.push(rect(start, end));
    const indexed = (openingByWall.get(wall.id) ?? []).map((opening) => {
      const [a, b] = opening.segment.map((point) => toMillimeters(point[axis])).sort((a, b) => a - b);
      return { opening, a, b };
    }).sort((a, b) => a.a - b.a);
    let cursor = start;
    for (const { opening, a, b } of indexed) {
      const low = Math.max(cursor, a);
      const high = Math.min(end, b);
      if (high <= low) continue;
      if (low > cursor) architecture.walls.push([...rect(cursor, low), wallKind, wall.heightM]);
      const { group, value } = architecturalOpening(opening, rect(low, high), vertical, rooms, plane, low, high, source.entranceId);
      architecture[group].push(value);
      cursor = high;
    }
    if (end > cursor) architecture.walls.push([...rect(cursor, end), wallKind, wall.heightM]);
  }

  const [[minX, minY], [maxX, maxY]] = [
    [Math.min(...extents.map(([x]) => x)), Math.min(...extents.map(([, y]) => y))],
    [Math.max(...extents.map(([, , x]) => x)), Math.max(...extents.map(([, , , y]) => y))],
  ];
  const furniture = source.items.map((item) => {
    const [cx, cy] = mmPoint(item.center);
    return {
      id: item.id, type: item.editorType ?? "cabinet", name: item.name, cx, cy,
      w: toMillimeters(item.widthM), d: toMillimeters(item.depthM),
      rot: item.editorRotationDeg ?? Math.round(item.rotationRad * 180 / Math.PI),
      color: item.editorColor ?? "#d6c2a6",
      elevation: item.editorType === "tvstand" ? item.bottomM : 0,
    };
  });
  const bounds = { x: minX - 1070, y: minY - 1040, w: maxX - minX + 1790, h: maxY - minY + 1760 };
  const dimensionExtent = {
    minX: Math.min(...centerLines.map(([x]) => x)),
    maxX: Math.max(...centerLines.map(([x]) => x)),
    minY: Math.min(...centerLines.map(([, y]) => y)),
    maxY: Math.max(...centerLines.map(([, y]) => y)),
  };
  return {
    ...architecture, rooms, furniture, bounds, dimensionExtent, extent: { minX, minY, maxX, maxY },
    center: [midpoint(minX, maxX), midpoint(minY, maxY)],
    ceiling: source.source?.ceilingHeightM ?? 2.8,
    walkFrames: Object.fromEntries((source.viewpoints ?? []).map((frame) =>
      [frame.roomId, frame.walkView ?? frame])),
  };
}
