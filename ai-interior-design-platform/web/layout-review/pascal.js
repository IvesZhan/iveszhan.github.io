// A shared metric plan is converted to Pascal's geometry in a local worker.
const ENGINE_VERSION = "1.1.6";
const LEVEL_ID = "level_layout";
const GEOMETRY_TOLERANCE_M = 0.000001;
const OPENING_SAMPLE_HEIGHT_M = 0.1;
const ROUTE_GRID_M = 0.02;

const finitePoint = (point) => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite);
const positive = (value) => Number.isFinite(value) && value > 0;
const center = ([a, b]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const validSegment = (segment) => Array.isArray(segment) && segment.length === 2 && segment.every(finitePoint);
const nodeId = (kind, id) => `${kind}_${id}`;

function segmentFrame([a, b]) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const length = Math.hypot(dx, dz);
  const tx = dx / length;
  const tz = dz / length;
  return {
    length,
    normal: [-tz, tx],
    local: ([x, z]) => [(x - a[0]) * tx + (z - a[1]) * tz, -(x - a[0]) * tz + (z - a[1]) * tx],
  };
}

function mergeIntervals(intervals) {
  const merged = [];
  for (const [start, end] of [...intervals].sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1);
    if (last && start <= last[1] + GEOMETRY_TOLERANCE_M) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function removeIntervals(clear, occupied) {
  const remaining = [];
  const merged = mergeIntervals(occupied);
  for (const [start, end] of clear) {
    let cursor = start;
    for (const [blockStart, blockEnd] of merged) {
      if (blockEnd <= cursor) continue;
      if (blockStart >= end) break;
      if (blockStart - cursor > GEOMETRY_TOLERANCE_M) remaining.push([cursor, blockStart]);
      cursor = Math.min(end, Math.max(cursor, blockEnd));
    }
    if (end - cursor > GEOMETRY_TOLERANCE_M) remaining.push([cursor, end]);
  }
  return remaining;
}

function overlapIntervals(a, b) {
  return a.flatMap(([a0, a1]) => b.flatMap(([b0, b1]) => {
    const start = Math.max(a0, b0);
    const end = Math.min(a1, b1);
    return end - start > GEOMETRY_TOLERANCE_M ? [[start, end]] : [];
  }));
}

const widest = (intervals) => Math.max(0, ...intervals.map(([start, end]) => end - start));

function openingSlice(opening, wall, prisms, clipping, objectFor) {
  const frame = segmentFrame([wall.start, wall.end]);
  const along = opening.position[0];
  const aperture = [along - opening.width / 2, along + opening.width / 2];
  const half = wall.thickness / 2 + GEOMETRY_TOLERANCE_M;
  const strip = [[aperture[0], -half], [aperture[1], -half], [aperture[1], half], [aperture[0], half]];
  function covered(prism) {
    const footprint = [prism.outer, ...(prism.holes || [])].map((ring) => ring.map(frame.local));
    return clipping.intersection(footprint, [strip]).flatMap(([outer]) => {
      const xs = outer.map(([x]) => x);
      const start = Math.min(...xs);
      const end = Math.max(...xs);
      return end - start > GEOMETRY_TOLERANCE_M ? [[start, end]] : [];
    });
  }

  const slice = prisms.filter((prism) => prism.z0 <= OPENING_SAMPLE_HEIGHT_M && OPENING_SAMPLE_HEIGHT_M < prism.z1);
  const solid = slice.filter((prism) => prism.kind === "wall" || prism.kind === "jamb");
  const base = removeIntervals([aperture], solid.flatMap(covered));
  const occupied = new Map();
  for (const prism of slice.filter((part) => part.kind === "item")) {
    const hit = overlapIntervals(base, covered(prism));
    if (!hit.length) continue;
    const blocker = occupied.get(prism.nodeId) || { object: objectFor(prism), intervals: [] };
    blocker.intervals.push(...hit);
    occupied.set(prism.nodeId, blocker);
  }
  const remaining = removeIntervals(base, [...occupied.values()].flatMap((blocker) => blocker.intervals));
  return {
    baselineWidthM: widest(base),
    widthM: widest(remaining),
    blockers: [...occupied.values()].map(({ object, intervals }) => ({
      ...object,
      coveredWidthM: mergeIntervals(intervals).reduce((width, [start, end]) => width + end - start, 0),
    })),
  };
}

function roomSlabs(rooms, engine, addLevelNode) {
  if (!rooms.length) return;
  const floors = engine.clipping.union(...rooms.map(({ polygon }) => [polygon]));
  for (const [index, [outer, ...holes]] of floors.entries()) {
    // Clipping returns closed rings whereas Pascal's slab schema uses open rings.
    addLevelNode(engine.SlabNode.parse({
      id: `slab_layout_${index}`, parentId: LEVEL_ID, polygon: outer.slice(0, -1),
      holes: holes.map((ring) => ring.slice(0, -1)), elevation: 0,
    }));
  }
}

function determineHanging(opening, firstAlong, secondAlong, frame) {
  if (opening.kind !== "door" || opening.doorType !== "hinged" ||
      !["start", "end"].includes(opening.hinge) || !finitePoint(opening.swingSide)) return null;
  const across = opening.swingSide[0] * frame.normal[0] + opening.swingSide[1] * frame.normal[1];
  if (Math.abs(across) <= GEOMETRY_TOLERANCE_M) return null;
  const hingeAtLowEnd = opening.hinge === "start" ? firstAlong < secondAlong : secondAlong < firstAlong;
  return { hingesSide: hingeAtLowEnd ? "left" : "right", swingDirection: across > 0 ? "inward" : "outward" };
}

function buildPascalScene(scene, engine, warnings, routeOnly = false) {
  const nodes = Object.create(null);
  const refs = new Map();
  const excludedOpenings = new Map();
  const children = [];
  function add(node, from, addToLevel = true) {
    if (Object.hasOwn(nodes, node.id)) throw new Error(`重复的布局对象编号：${from?.id || node.id}`);
    nodes[node.id] = node;
    if (from) refs.set(node.id, { id: from.id, name: from.name || from.id });
    if (addToLevel) children.push(node.id);
  }

  for (const wall of scene.walls) {
    if (!validSegment([wall.start, wall.end]) || !positive(wall.thicknessM) || !positive(wall.heightM) ||
        segmentFrame([wall.start, wall.end]).length < GEOMETRY_TOLERANCE_M) {
      warnings.add(`墙体「${wall.name || wall.id}」缺少可用尺寸，已跳过。`);
      continue;
    }
    add(engine.WallNode.parse({
      id: nodeId("wall", wall.id), parentId: LEVEL_ID, name: wall.name,
      start: wall.start, end: wall.end, thickness: wall.thicknessM, height: wall.heightM, children: [],
    }), wall);
  }

  for (const opening of scene.openings) {
    const wall = nodes[nodeId("wall", opening.wallId)];
    let reason = opening.excludedReason;
    if (!reason && (!wall || !validSegment(opening.segment) || !positive(opening.heightM) ||
        !Number.isFinite(opening.sillM) || opening.sillM < 0)) {
      reason = "缺少可用的墙体、洞口或标高数据";
    }
    if (reason) {
      excludedOpenings.set(opening.id, reason);
      continue;
    }
    const frame = segmentFrame([wall.start, wall.end]);
    const [[first, acrossFirst], [last, acrossLast]] = opening.segment.map(frame.local);
    // Small model rounding is allowed; an opening on another wall remains unresolved.
    const wallTolerance = wall.thickness / 2 + GEOMETRY_TOLERANCE_M;
    const width = Math.abs(last - first);
    if (width < GEOMETRY_TOLERANCE_M || Math.max(Math.abs(acrossFirst), Math.abs(acrossLast)) > wallTolerance ||
        Math.min(first, last) < -wallTolerance || Math.max(first, last) > frame.length + wallTolerance) {
      excludedOpenings.set(opening.id, "洞口端点与宿主墙不匹配");
      continue;
    }
    const base = {
      id: nodeId(opening.kind === "window" ? "window" : "door", opening.id), name: opening.name, parentId: wall.id, wallId: wall.id,
      width, height: opening.heightM, position: [(first + last) / 2, opening.sillM + opening.heightM / 2, 0],
    };
    if (opening.kind === "window") {
      add(engine.WindowNode.parse({ ...base, sill: false }), opening, false);
    } else {
      const isPassage = opening.kind === "passage";
      const hanging = determineHanging(opening, first, last, frame);
      const inputFrame = opening.frameThicknessM;
      const frameKnown = Number.isFinite(inputFrame) && inputFrame >= 0 && inputFrame < width / 2;
      if (!isPassage && !frameKnown && !routeOnly) warnings.add(`「${opening.name || opening.id}」的门框尺寸待确认，净宽按固定洞口估算。`);
      add(engine.DoorNode.parse({
        ...base, ...hanging,
        openingKind: isPassage ? "opening" : "door", openingShape: "rectangle",
        doorType: hanging ? "hinged" : "sliding", leafCount: 1, threshold: false,
        frameThickness: frameKnown && !isPassage ? inputFrame : 0, frameDepth: wall.thickness,
      }), opening, false);
    }
    wall.children.push(base.id);
  }

  const rooms = scene.rooms.filter((room) => {
    if (routeOnly && room.excludeFromRoutes) return false;
    if (Array.isArray(room.polygon) && room.polygon.length >= 3 && room.polygon.every(finitePoint)) return true;
    warnings.add(`空间「${room.name || room.id}」缺少可用轮廓，已跳过。`);
    return false;
  });
  for (const room of rooms) {
    add(engine.ZoneNode.parse({
      id: nodeId("zone", room.id), name: room.name, parentId: LEVEL_ID, polygon: room.polygon,
    }), room);
  }
  roomSlabs(rooms, engine, (node) => add(node));

  for (const item of scene.items) {
    if (!finitePoint(item.center) || ![item.widthM, item.depthM, item.heightM].every(positive)) {
      warnings.add(`家具「${item.name || item.id}」缺少占地或高度，未纳入检查。`);
      continue;
    }
    // Pascal uses a right-handed local yaw, opposite to the plan's X-to-Z angle.
    const yaw = Number.isFinite(item.rotationRad) ? -item.rotationRad : 0;
    add(engine.ItemNode.parse({
      id: nodeId("item", item.id), name: item.name, parentId: LEVEL_ID,
      position: [item.center[0], Number.isFinite(item.bottomM) ? item.bottomM : 0, item.center[1]],
      rotation: [0, yaw, 0],
      asset: {
        id: `layout_box_${item.id}`, name: item.name || item.id, category: "furniture",
        dimensions: [item.widthM, item.heightM, item.depthM],
        // Usage-field reads these boxes directly. No model is downloaded.
        src: "/layout-review-placeholder.glb", thumbnail: "/layout-review-placeholder.webp",
      },
    }), item);
  }
  add(engine.LevelNode.parse({ id: LEVEL_ID, parentId: "building_layout", children, level: 0 }), null, false);
  add(engine.BuildingNode.parse({ id: "building_layout", children: [LEVEL_ID] }), null, false);
  const objectFor = (obstacle) => ({
    ...(refs.get(obstacle.nodeId) || { id: obstacle.nodeId, name: nodes[obstacle.nodeId]?.name || obstacle.nodeId }),
    kind: obstacle.kind, approximate: obstacle.shape === "approx",
  });
  return { nodes, excludedOpenings, objectFor };
}

function routeCellSize(rooms, walls) {
  // Bound the grid for larger imports and keep 20 mm cells for residential scenes.
  let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
  const extend = ([x, z]) => {
    minX = Math.min(minX, x);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxZ = Math.max(maxZ, z);
  };
  for (const room of rooms) for (const point of room.polygon || []) if (finitePoint(point)) extend(point);
  for (const wall of walls) for (const point of [wall.start, wall.end]) if (finitePoint(point)) extend(point);
  if (!Number.isFinite(minX)) return ROUTE_GRID_M;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  return Math.max(ROUTE_GRID_M, width / 900, depth / 900, Math.sqrt(width * depth / 500000));
}

function analyzeRoutes(scene, engine, warnings) {
  const rooms = scene.rooms.filter((room) => !room.excludeFromRoutes);
  const unknown = (reason) => ({
    routes: rooms.map((room) => ({ roomId: room.id, widthM: null, point: null, obstacles: [], status: "unknown", reason })),
    cellSizeM: null,
  });
  if (!scene.entranceId) return unknown("入口待确认");
  const parsed = buildPascalScene(scene, engine, warnings, true);
  const { nodes, objectFor, excludedOpenings } = parsed;
  const entrance = nodeId("door", scene.entranceId);
  if (nodes[entrance]?.type !== "door") return unknown("入口洞口待确认");
  const shapes = engine.usageShapes(nodes);
  const cellSizeM = routeCellSize(rooms, scene.walls);
  const measurement = engine.measureUsage(nodes, shapes, { cell: cellSizeM, entranceDoorId: entrance });
  const level = measurement.groups.find((group) => group.levelId === LEVEL_ID);
  if (level?.source.kind !== "door" || level.source.doorId !== entrance) {
    return unknown("所选入口未被识别为套内边界入口");
  }
  if (cellSizeM > ROUTE_GRID_M) {
    warnings.add(`按户型尺寸使用约 ${Math.ceil(cellSizeM * 1000)} 毫米网格。`);
  }
  const byId = new Map(level.rooms.map((room) => [room.roomId, room]));
  return {
    cellSizeM,
    routes: rooms.map((room) => {
      const result = byId.get(nodeId("zone", room.id));
      if (!result) {
        return { roomId: room.id, widthM: null, point: null, obstacles: [], status: "unknown", reason: "空间轮廓或楼板连接待确认" };
      }
      const passage = result.passage;
      if (!passage) {
        const unresolved = scene.openings.find((opening) => opening.roomIds?.includes(room.id) && excludedOpenings.has(opening.id));
        return {
          roomId: room.id, widthM: null, point: result.at, obstacles: [],
          status: unresolved ? "unknown" : "unreachable",
          ...(unresolved ? { reason: excludedOpenings.get(unresolved.id) } : {}),
        };
      }
      const thresholdM = passage.by.some(({ kind }) => kind === "jamb") ? engine.DOOR_M : engine.PASSAGE_M;
      return {
        roomId: room.id, widthM: passage.width, point: passage.at, thresholdM,
        obstacles: uniqueObjects(passage.by.map(objectFor)),
        status: passage.width < thresholdM - engine.TOLERANCE_M ? "narrow" : "clear",
      };
    }),
  };
}

function uniqueObjects(objects) {
  return [...new Map(objects.map((item) => [item.id, item])).values()];
}

function analyzeOpenings(scene, engine, warnings) {
  const { nodes, objectFor, excludedOpenings } = buildPascalScene(scene, engine, warnings);
  const shapes = engine.usageShapes(nodes);
  const level = shapes.levels.find((group) => group.levelId === LEVEL_ID);
  const reader = engine.swingReader(nodes, shapes, level);
  return scene.openings.filter((opening) => opening.kind !== "window").map((opening) => {
    const point = validSegment(opening.segment) ? center(opening.segment) : null;
    const node = nodes[nodeId("door", opening.id)];
    const isHinged = opening.kind === "door" && opening.doorType === "hinged";
    const expectedSwing = opening.kind === "door" && opening.doorType !== "sliding";
    const unknown = excludedOpenings.get(opening.id);
    if (!node || unknown) {
      return {
        id: opening.id, point, widthM: null, baselineWidthM: null, angleDeg: null, firstHitDeg: null,
        blockers: [], status: "unknown", clearanceStatus: "unknown",
        swingStatus: expectedSwing ? "unknown" : "not-applicable", reason: unknown || "洞口模型待确认",
      };
    }
    const clearance = openingSlice(node, nodes[node.wallId], level.prisms, engine.clipping, objectFor);
    const thresholdM = opening.kind === "passage" ? engine.PASSAGE_M : engine.DOOR_M;
    let clearanceStatus = "clear";
    if (clearance.widthM <= GEOMETRY_TOLERANCE_M) clearanceStatus = "blocked";
    else if (clearance.blockers.length) clearanceStatus = "partially-blocked";
    else if (clearance.widthM < thresholdM - engine.TOLERANCE_M) clearanceStatus = "narrow";

    const sweep = isHinged && node.doorType === "hinged" ? reader.sweepOf(node, engine.hungOf(node)) : null;
    const swingBlocker = sweep?.by ? objectFor({ ...sweep.by.prism, kind: sweep.by.kind }) : null;
    const swingStatus = sweep ? (swingBlocker ? "limited" : "clear") : expectedSwing ? "unknown" : "not-applicable";
    return {
      id: opening.id, point, widthM: clearance.widthM, baselineWidthM: clearance.baselineWidthM, thresholdM,
      angleDeg: sweep?.free ?? null, firstHitDeg: swingBlocker ? sweep.free + engine.SWEEP_STEP_DEG : null,
      blockers: uniqueObjects([...clearance.blockers, ...(swingBlocker ? [swingBlocker] : [])]),
      clearanceBlockers: clearance.blockers, swingBlocker,
      clearanceStatus, swingStatus,
      status: clearanceStatus !== "clear" || swingStatus === "limited" ? "attention" : swingStatus === "unknown" ? "unknown" : "clear",
      ...(swingStatus === "unknown" ? { reason: "图上开向或铰链待确认" } : {}),
      ...(opening.kind === "door" && opening.doorType === "sliding" ? { clearanceScope: "fixed-opening" } : {}),
    };
  });
}

async function reviewLayout(scene) {
  if (scene?.schema !== "layout-review/v1" ||
      !["walls", "rooms", "openings", "items"].every((key) => Array.isArray(scene[key]))) {
    throw new Error("请选择有效的布局场景。");
  }
  const engine = await import("./vendor/pascal-layout.bundle.js");
  const warnings = new Set(scene.warnings || []);
  const { routes, cellSizeM } = analyzeRoutes(scene, engine, warnings);
  const openings = analyzeOpenings(scene, engine, warnings);
  return {
    engineVersion: ENGINE_VERSION, cellSizeM, sampleHeightM: OPENING_SAMPLE_HEIGHT_M,
    swingStepDeg: engine.SWEEP_STEP_DEG, routes, openings, warnings: [...warnings],
  };
}

const inDedicatedWorker = typeof DedicatedWorkerGlobalScope === "function" && globalThis instanceof DedicatedWorkerGlobalScope;
if (inDedicatedWorker) {
  globalThis.addEventListener("message", async ({ data }) => {
    try {
      globalThis.postMessage({ result: await reviewLayout(data) });
    } catch (error) {
      globalThis.postMessage({ error: error instanceof Error ? error.message : String(error) });
    }
  });
}

/** Run against only the supplied local scene; works directly in Node for diagnostics. */
export async function analyzeLayout(scene) {
  if (typeof Worker !== "function" || inDedicatedWorker) return reviewLayout(scene);
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./pascal.js", import.meta.url), { type: "module" });
    worker.addEventListener("message", ({ data }) => {
      worker.terminate();
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    }, { once: true });
    worker.addEventListener("error", (event) => {
      worker.terminate();
      reject(new Error(event.message || "无法启动布局检查。"));
    }, { once: true });
    worker.addEventListener("messageerror", () => {
      worker.terminate();
      reject(new Error("无法读取布局检查结果。"));
    }, { once: true });
    try {
      worker.postMessage(scene);
    } catch (error) {
      worker.terminate();
      reject(error);
    }
  });
}
