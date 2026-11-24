import * as THREE from "./vendor/three.module.min.js";
import { containsPoint, getLayoutBounds } from "./scene.js";
import { HDRLoader } from "./vendor/addons/loaders/HDRLoader.js";
import { createWalkContacts } from "./walk-contact-light.js";

export function exteriorWindows(scene) {
  const rooms = new Map(scene.rooms.map((room) => [room.id, room]));
  const walls = new Map(scene.walls.map((wall) => [wall.id, wall]));
  return scene.openings.flatMap((opening) => {
    const wall = walls.get(opening.wallId);
    const room = rooms.get(opening.roomIds[0]);
    if (!wall || !room || opening.kind !== "window" || opening.excludedReason || opening.roomIds.length !== 1) return [];
    const [[x, z], [endX, endZ]] = opening.segment;
    const span = Math.hypot(endX - x, endZ - z);
    if (span < 0.24) return [];
    const center = [(x + endX) / 2, (z + endZ) / 2];
    const normal = [-(endZ - z) / span, (endX - x) / span];
    const probe = wall.thicknessM / 2 + 0.21;
    const inside = (side) => containsPoint(
      [center[0] + normal[0] * probe * side, center[1] + normal[1] * probe * side], room.polygon,
    );
    if (inside(1) === inside(-1)) return [];
    const inward = inside(1) ? normal : normal.map((component) => -component);
    return [{ opening, room, wall, span, center, inward, angle: Math.atan2(endZ - z, endX - x) }];
  });
}

const livingRoom = /客(?:餐)?厅|起居室|living|lounge/i;
const diningRoom = /餐厅|dining/i;
const sofaItem = /沙发|sofa|couch/i;
const kitchenRoom = /厨房|kitchen/i;
const entryRoom = /玄关|entry|foyer/i;

function roomTag(room) {
  return `${room?.name ?? ""} ${room?.id ?? ""}`;
}

function placeBounce(light, room, height, upward, intensity) {
  const { minX, minZ, maxX, maxZ } = getLayoutBounds({ rooms: [room], walls: [] });
  const x = (minX + maxX) / 2;
  const z = (minZ + maxZ) / 2;
  light.position.set(x, height, z);
  light.up.set(0, 0, 1);
  light.lookAt(x, height + (upward ? 1 : -1), z);
  light.width = Math.min(3.6, (maxX - minX) * 0.64);
  light.height = Math.min(3.1, (maxZ - minZ) * 0.60);
  light.intensity = intensity;
}

function prepareArtWash(light, room, sofa, ceiling) {
  light.intensity = 0;
  if (!room || !sofa) return;
  const [x, z] = sofa.center;
  let anchor;
  for (const [index, [ax, az]] of room.polygon.entries()) {
    const [bx, bz] = room.polygon[(index + 1) % room.polygon.length];
    const length = Math.hypot(bx - ax, bz - az);
    if (length < 1.45) continue;
    const [ux, uz] = [(bx - ax) / length, (bz - az) / length];
    const along = (x - ax) * ux + (z - az) * uz;
    if (along < 0.60 || along > length - 0.60) continue;
    const [px, pz] = [ax + ux * along, az + uz * along];
    const distance = Math.hypot(x - px, z - pz);
    if (distance < 0.28 || distance > 0.90 || (anchor && distance >= anchor.distance)) continue;
    anchor = { px, pz, nx: (x - px) / distance, nz: (z - pz) / distance, distance };
  }
  if (!anchor) return;
  const { px, pz, nx, nz } = anchor;
  light.position.set(px + nx * 0.53, ceiling - 0.085, pz + nz * 0.53);
  light.target.position.set(px + nx * 0.075, Math.min(1.73, ceiling - 0.72), pz + nz * 0.075);
  light.intensity = 3.25;
}

function placeCabinetWash(light, room, item, upper) {
  light.intensity = 0;
  if (!room || !item) return;
  const depth = Math.min(item.widthM, item.depthM);
  const length = Math.max(item.widthM, item.depthM);
  if (length < 0.8 || depth < 0.22) return;

  const [x, z] = item.center;
  const angle = item.rotationRad + (item.depthM > item.widthM ? Math.PI / 2 : 0);
  let nx = -Math.sin(angle);
  let nz = Math.cos(angle);
  const inward = room.polygon.reduce((sum, [px, pz]) => sum + (px - x) * nx + (pz - z) * nz, 0);
  if (inward < 0) {
    nx = -nx;
    nz = -nz;
  }
  // Light originates at the cabinet's existing strip and aims back at its backing and worktop.
  const offset = upper ? depth / 2 - 0.035 : depth * 0.28;
  const y = upper ? item.bottomM - 0.019 : item.bottomM + item.heightM - 0.049;
  light.position.set(x + nx * offset, y, z + nz * offset);
  light.width = length - (upper ? 0.17 : 0.12);
  light.up.set(-nx, 0, -nz);
  light.lookAt(x - nx * depth * 0.48, y - (upper ? 0.39 : 0.12), z - nz * depth * 0.48);
  light.intensity = upper ? 11.8 : 6.1;
}

export function createWalkLighting(renderer, world, invalidate, cream = false, { visualProfile } = {}) {
  const v6 = cream && visualProfile === "cream-v6";
  const daylight = new THREE.DirectionalLight(v6 ? 0xffdaa9 : cream ? 0xffdfb1 : 0xfff2e2, v6 ? 3.1 : cream ? 2.82 : 3.3);
  const fill = new THREE.PointLight(cream ? 0xffe8d3 : 0xfff4e9, 5, 4.6, 2);
  const bounced = new THREE.HemisphereLight(cream ? 0xffedda : 0xf0f3f7, v6 ? 0xd4ad88 : cream ? 0xc7aa89 : 0xd8cbbc, v6 ? 0.49 : 0.55);
  const adjacentFill = cream ? new THREE.PointLight(0xffe0bb, 0, 5.3, 2) : null;
  const windowLights = Array.from({ length: 2 }, () => new THREE.RectAreaLight(cream ? 0xfff3e4 : 0xf0f5ff, 0));
  const floorBounce = cream ? new THREE.RectAreaLight(0xffdbb4, 0) : null;
  const diningBounce = cream ? new THREE.RectAreaLight(0xffddba, 0) : null;
  const artWash = cream ? new THREE.SpotLight(0xffdbac, 0, 2.25, Math.PI / 5.8, 0.88, 2) : null;
  const upperWash = v6 ? new THREE.RectAreaLight(0xffb774, 0, 1, 0.057) : null;
  const nicheWash = v6 ? new THREE.RectAreaLight(0xffb87b, 0, 1, 0.035) : null;
  const contacts = cream ? createWalkContacts() : null;
  const rig = new THREE.Group();
  daylight.castShadow = true;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const resolution = coarsePointer ? 1024 : 2048;
  daylight.shadow.mapSize.set(resolution, resolution);
  daylight.shadow.normalBias = v6 ? 0.013 : 0.018;
  daylight.shadow.bias = -0.0002;
  daylight.shadow.radius = cream && !coarsePointer ? (v6 ? 6 : 5) : 3;
  rig.add(daylight, daylight.target, fill, bounced);
  if (adjacentFill) rig.add(adjacentFill);
  if (artWash) rig.add(artWash, artWash.target);
  if (contacts) rig.add(contacts.group);
  world.add(rig);
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  let environment;
  let environmentLoading;
  let lampsLoading;
  let lampsReady = false;
  let rankedWindows = [];
  let adjoiningRooms = new Map();
  let roomsById = new Map();
  let linkedPublicRooms = [];
  let currentRoomId;
  let active = false;
  let disposed = false;

  function applyEnvironment() {
    world.background = active ? (environment || new THREE.Color(0xc7d5df)) : null;
    world.environment = active ? (environment || null) : null;
    world.backgroundIntensity = cream ? 0.97 : 0.86;
    world.environmentIntensity = cream ? 0.19 : 0.29;
    world.backgroundRotation.y = world.environmentRotation.y = 0.83;
  }

  function updateWindowLights() {
    if (!lampsReady) return;
    const primaryRoomId = v6 && linkedPublicRooms.includes(currentRoomId) ? linkedPublicRooms[0] : currentRoomId;
    const neighbors = adjoiningRooms.get(primaryRoomId);
    const sharesDaylight = (roomId) => roomId === primaryRoomId || neighbors?.has(roomId);
    const nearby = rankedWindows.filter((info) => sharesDaylight(info.room.id));
    const selected = cream ? nearby.slice(0, 2) : [rankedWindows[0], nearby.find((info) => info !== rankedWindows[0]) || rankedWindows[1]];
    for (const [index, light] of windowLights.entries()) {
      const info = selected[index];
      if (!cream) light.visible = Boolean(info);
      light.intensity = info ? (v6 ? (index === 0 ? 1.35 : 0.68) : index === 0 ? (cream ? 1.15 : 0.98) : 0.76) : 0;
      if (!info) continue;
      const { wall, center: [x, z], inward: [nx, nz], opening, span } = info;
      const height = opening.sillM + opening.heightM / 2;
      const offset = wall.thicknessM / 2 + 0.025;
      light.width = span * 0.91;
      light.height = opening.heightM * 0.88;
      light.position.set(x + nx * offset, height, z + nz * offset);
      light.lookAt(x + nx, height, z + nz);
    }
  }

  function setFillForRoom(light, room, intensity) {
    const [x, z] = room.polygon.reduce(([x, z], [px, pz]) => [x + px / room.polygon.length, z + pz / room.polygon.length], [0, 0]);
    light.position.set(x, cream ? 2.01 : 2.3, z);
    light.intensity = intensity;
  }

  function updatePublicBounce(scene) {
    if (!cream) return;
    const living = scene.rooms.find((room) => !room.excludeFromRoutes && livingRoom.test(roomTag(room)) &&
      rankedWindows.some((window) => window.room.id === room.id));
    const dining = scene.rooms.find((room) => !room.excludeFromRoutes && room.id !== living?.id &&
      diningRoom.test(roomTag(room)) && adjoiningRooms.get(living?.id)?.has(room.id));
    const linkedToDining = (room) => dining && scene.openings.some((opening) => !opening.excludedReason &&
      opening.kind !== "window" && opening.roomIds.includes(dining.id) && opening.roomIds.includes(room.id));
    const kitchen = v6 && scene.rooms.find((room) => !room.excludeFromRoutes && kitchenRoom.test(roomTag(room)) && linkedToDining(room));
    const entry = v6 && scene.rooms.find((room) => !room.excludeFromRoutes && entryRoom.test(roomTag(room)) && linkedToDining(room));
    linkedPublicRooms = living ? [living.id, dining?.id, kitchen?.id, entry?.id].filter(Boolean) : [];
    contacts.update(scene, linkedPublicRooms);
    const sofa = scene.items.find((item) => item.roomId === living?.id && sofaItem.test(item.name));
    const heights = scene.walls.map((wall) => wall.heightM).filter((height) => height > 1.9).sort((a, b) => a - b);
    const ceiling = heights[Math.floor(heights.length / 2)] || 2.7;
    floorBounce.intensity = diningBounce.intensity = 0;
    if (living) placeBounce(floorBounce, living, 0.04, true, v6 ? 0.79 : 0.54);
    if (dining) placeBounce(diningBounce, dining, ceiling - 0.09, false, v6 ? 1.37 : 1.18);
    prepareArtWash(artWash, living, sofa, ceiling);
    if (v6) {
      const upper = scene.items.find((item) => item.roomId === kitchen?.id && /吊柜|upper[ _-]?cabinet/i.test(item.name));
      const sideboard = scene.items.find((item) => item.roomId === dining?.id && /餐边柜|sideboard/i.test(item.name));
      placeCabinetWash(upperWash, kitchen, upper, true);
      placeCabinetWash(nicheWash, dining, sideboard, false);
    }
  }

  return {
    update(scene, walking, windows) {
      active = walking;
      rig.visible = walking;
      renderer.shadowMap.enabled = walking;
      applyEnvironment();
      if (!walking) return;
      rankedWindows = [...windows].sort((a, b) => b.span * b.opening.heightM - a.span * a.opening.heightM);
      adjoiningRooms = new Map();
      roomsById = new Map(scene.rooms.map((room) => [room.id, room]));
      for (const opening of scene.openings) {
        if (opening.kind !== "passage" || opening.excludedReason || opening.roomIds.length !== 2) continue;
        const [[x, z], [endX, endZ]] = opening.segment;
        const width = Math.hypot(endX - x, endZ - z);
        if (width < 1.5) continue;
        for (const [id, neighbor] of [opening.roomIds, [...opening.roomIds].reverse()]) {
          if (!adjoiningRooms.has(id)) adjoiningRooms.set(id, new Map());
          const links = adjoiningRooms.get(id);
          links.set(neighbor, Math.max(width, links.get(neighbor) || 0));
        }
      }
      updatePublicBounce(scene);
      if (!lampsLoading && (rankedWindows.length || v6)) {
        lampsLoading = import("./vendor/addons/lights/RectAreaLightUniformsLib.js").then(({ RectAreaLightUniformsLib }) => {
          if (disposed) return;
          if (!THREE.UniformsLib.LTC_FLOAT_1) RectAreaLightUniformsLib.init();
          rig.add(...windowLights);
          if (floorBounce) rig.add(floorBounce, diningBounce);
          if (upperWash) rig.add(upperWash, nicheWash);
          lampsReady = true;
          updateWindowLights();
          if (active) invalidate();
        }).catch(() => { /* Directional daylight and room fill remain available. */ });
      }
      updateWindowLights();
      if (!environmentLoading) {
        const asset = new URL("./assets/environment/kloofendal-1k.hdr", import.meta.url);
        environmentLoading = new HDRLoader().loadAsync(asset.href).then((texture) => {
          if (disposed) { texture.dispose(); return; }
          texture.mapping = THREE.EquirectangularReflectionMapping;
          environment = texture;
          applyEnvironment();
          if (active) invalidate();
        }).catch(() => { /* The daylight rig remains available. */ });
      }
      const primary = rankedWindows[0];
      daylight.visible = Boolean(primary);
      if (primary) {
        const { center: [x, z], inward: [nx, nz], opening } = primary;
        const sofa = cream && livingRoom.test(roomTag(primary.room)) &&
          scene.items.find((item) => item.roomId === primary.room.id && sofaItem.test(item.name));
        const diagonal = sofa ? THREE.MathUtils.clamp(
          ((sofa.center[0] - x) * -nz + (sofa.center[1] - z) * nx) /
          Math.max(1.2, (sofa.center[0] - x) * nx + (sofa.center[1] - z) * nz) * 0.68,
          -0.60, 0.60,
        ) : 0.37;
        const [dx, dz] = [nx - nz * diagonal, nz + nx * diagonal];
        const centerHeight = opening.sillM + opening.heightM * 0.67;
        const distance = v6 ? 8 : 7;
        daylight.position.set(x - dx * distance, centerHeight + (v6 ? 2.28 : 3.55), z - dz * distance);
        daylight.target.position.set(x + dx * 2.5, Math.max(0.25, centerHeight - 1.5), z + dz * 2.5);
        const { minX, minZ, maxX, maxZ } = getLayoutBounds(scene);
        const radius = Math.min(13, Math.max(4, Math.hypot(maxX - minX, maxZ - minZ) * 0.57));
        Object.assign(daylight.shadow.camera, { left: -radius, right: radius, bottom: -radius, top: radius, near: 0.3, far: radius * 3 });
        daylight.shadow.camera.updateProjectionMatrix();
      }
      renderer.shadowMap.needsUpdate = true;
    },
    setRoom(room, hasWindow) {
      if (!room) return;
      if (currentRoomId !== room.id) {
        currentRoomId = room.id;
        updateWindowLights();
      }
      const adjacent = adjoiningRooms.get(room.id);
      const receivesDaylight = hasWindow || rankedWindows.some(({ room: windowRoom }) => adjacent?.has(windowRoom.id));
      if (linkedPublicRooms.includes(room.id)) {
        fill.intensity = adjacentFill.intensity = 0;
        return;
      }
      setFillForRoom(fill, room, cream ? (hasWindow ? 2.2 : receivesDaylight ? 6.5 : 8) : (hasWindow ? 1.65 : receivesDaylight ? 4.2 : 7.4));
      if (adjacentFill) {
        const peerId = [...(adjacent || [])].filter(([id]) => !roomsById.get(id)?.excludeFromRoutes)
          .sort((a, b) => b[1] - a[1])[0]?.[0];
        const peer = roomsById.get(peerId);
        const hasPeerWindow = rankedWindows.some(({ room: windowRoom }) => windowRoom.id === peerId);
        if (peer && !linkedPublicRooms.includes(peer.id)) setFillForRoom(adjacentFill, peer, hasPeerWindow ? 2.65 : 9.5);
        else adjacentFill.intensity = 0;
      }
    },
    ready() { return Promise.all([lampsLoading, environmentLoading]); },
    invalidateShadows() { renderer.shadowMap.needsUpdate = true; },
    dispose() {
      disposed = true;
      environment?.dispose();
      daylight.shadow.dispose();
      contacts?.dispose();
    },
  };
}
