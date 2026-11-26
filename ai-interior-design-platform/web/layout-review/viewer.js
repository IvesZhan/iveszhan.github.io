import * as THREE from "./vendor/three.module.min.js";
import { containsPoint, getLayoutBounds, isDiningTable } from "./scene.js?v=studio-version-save";
import { createWalkNavigation } from "./walk-navigation.js?v=cream-v7";
import { planWalkRoute } from "./walk-route.js";
import { createWalkAppearance } from "./walk-appearance.js?v=cream-v6-3";
import { loadWalkFurniture } from "./walk-furniture.js?v=cream-v6-3";
import { applyBoxFinish, createWalkFitout, makeCreamCoffeeTable, makeWalkMillwork, makeWalkRoundTable, surfaceMaterial } from "./walk-fitout.js?v=cream-v7-interior";
import { createWalkLighting, exteriorWindows } from "./walk-lighting.js?v=cream-v7-interior";
import { makeWalkFixture } from "./walk-fixtures.js";

const colors = {
  background: 0xecece4, floors: [0xe9e2d1, 0xe9e2d1, 0xe9e6da, 0xe9e0d1],
  wall: 0xf5f1e7, wallTop: 0xbcb9a7, window: 0xa5b6b3,
  opening: 0x849589, furniture: 0xb19b7e, softFurniture: 0xc4bfae,
  selection: 0x4f826d, issue: 0xad5a4c,
};

const previewFloorColors = {
  wood: 0xdcc4a5, walnut: 0xbda184, tile800: 0xe9e3d7, tile600: 0xe4dfd7,
  marble: 0xeee8dd, antislip: 0xd9d3c7, terrazzo: 0xded8ca, carpet: 0xdacfc2,
};

function line(scene, a, b, color, height = 0.025) {
  const path = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], height, a[1]), new THREE.Vector3(b[0], height, b[1])]);
  scene.add(new THREE.Line(path, new THREE.LineBasicMaterial({ color })));
}

function box(container, x, y, z, width, height, depth, color, angle = 0, outlined = true) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.84 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = -angle;
  container.add(mesh);
  if (outlined) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: colors.wallTop, transparent: true, opacity: 0.48 })));
  return mesh;
}

function furniture(group, item, outlined, appearance, room) {
  const [x, z] = item.center;
  const { widthM: width, depthM: depth, heightM: height, bottomM: bottom, rotationRad: angle } = item;
  const node = new THREE.Group();
  node.position.set(x, bottom, z);
  node.rotation.y = -angle;
  group.add(node);
  if (appearance) {
    if (appearance.cream) {
      const coffee = makeCreamCoffeeTable(node, item, appearance);
      if (coffee.length) return coffee;
    }
    const fixture = makeWalkFixture(node, item);
    if (fixture.length) return fixture;
    const millwork = makeWalkMillwork(node, item, room, appearance);
    if (millwork.length) return millwork;
    const roundTable = makeWalkRoundTable(node, item, appearance);
    if (roundTable.length) return roundTable;
  }
  const parts = [];
  function part(px, py, pz, w, h, d, color, finish) {
    if (w <= 0.008 || h <= 0.008 || d <= 0.008) return;
    const mesh = box(node, px, py, pz, w, h, d, color, 0, outlined);
    if (finish) applyBoxFinish(mesh, finish, w, h, d);
    mesh.userData = { id: item.id, color: mesh.material.color.getHex() };
    parts.push(mesh);
  }
  function cylinder(y, radius, length, color) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 32), new THREE.MeshStandardMaterial({ color, roughness: 0.67 }));
    mesh.position.y = y;
    mesh.scale.z = depth / width;
    mesh.userData = { id: item.id, color };
    if (outlined) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: colors.wallTop, transparent: true, opacity: 0.48 })));
    node.add(mesh);
    parts.push(mesh);
  }
  if (/床/.test(item.name) && !/床头|床边|床尾/.test(item.name) && width > 0.8 && depth > 0.8) {
    const headAlongX = width > depth;
    const main = Math.min(height * 0.59, 0.46);
    const head = Math.max(main + 0.03, height);
    const offset = (dx, dz) => headAlongX ? [dz, dx] : [dx, dz];
    const narrow = Math.min(width, depth);
    const long = Math.max(width, depth);
    function bedPart(px, py, pz, w, h, d, color) {
      const [cx, cz] = offset(px, pz);
      const [sx, sz] = offset(w, d);
      part(cx, py, cz, sx, h, sz, color);
    }
    bedPart(0, main * 0.27, 0, narrow, main * 0.54, long, 0xb9a68e);
    bedPart(0, main * 0.76, 0.02, narrow * 0.96, main * 0.38, long * 0.97, 0xe9e2d4);
    bedPart(0, head / 2, -long * 0.47, narrow, head, long * 0.06, 0xa99a85);
    bedPart(0, main, long * 0.152, narrow * 0.92, 0.044, long * 0.58, 0xd7cfbc);
    const pillows = narrow > 1.4 ? [-0.24, 0.24] : [0];
    for (const pillow of pillows) bedPart(pillow * narrow, main + 0.013, -long * 0.29, narrow * (pillows.length === 2 ? 0.42 : 0.58), 0.069, long * 0.205, 0xf5f0e7);
  } else if ((isDiningTable(item) || /茶几|床头几|书桌/.test(item.name)) && height > 0.16) {
    const plate = Math.min(0.055, height * 0.18);
    if ((item.shape === "round" || (!outlined && item.shape !== "rectangular" && (isDiningTable(item) || /床头几/.test(item.name)))) &&
        Math.max(width, depth) / Math.min(width, depth) < 1.25) {
      cylinder(height - plate / 2, width / 2, plate, 0xc9a77d);
      cylinder((height - plate) / 2, width * 0.125, height - plate, 0xad8862);
      cylinder(0.045, width * 0.23, 0.09, 0xad8862);
    } else {
      part(0, height - plate / 2, 0, width, plate, depth, 0xbb9b75, appearance?.wood);
      const leg = Math.min(0.05, width * 0.14, depth * 0.14);
      for (const signX of [-1, 1]) for (const signZ of [-1, 1]) {
        part(signX * (width / 2 - leg), (height - plate) / 2, signZ * (depth / 2 - leg), leg, height - plate, leg, 0xa38769);
      }
    }
  } else if (/沙发/.test(item.name) && width > 0.4 && depth > 0.4) {
    const w = Math.min(width, depth);
    const arm = Math.min(w * 0.18, 0.16);
    part(0, height * 0.25, 0, width, height * 0.5, depth, 0xc1b49d);
    const longAlongX = width > depth;
    if (longAlongX) {
      part(0, height * 0.73, -depth / 2 + arm / 2, width, height * 0.54, arm, 0xd4c8b2);
      for (const side of [-1, 1]) part(side * (width - arm) / 2, height * 0.57, arm / 2, arm, height * 0.34, depth - arm, 0xd7ccba);
    } else {
      part(-width / 2 + arm / 2, height * 0.73, 0, arm, height * 0.54, depth, 0xd4c8b2);
      for (const side of [-1, 1]) part(arm / 2, height * 0.57, side * (depth - arm) / 2, width - arm, height * 0.34, arm, 0xd7ccba);
    }
  } else if (/柜/.test(item.name) && height > (appearance ? 0.21 : 0.34) && Math.max(width, depth) > 0.8) {
    const longAlongX = width > depth;
    const panelCount = Math.max(2, Math.min(5, Math.round(Math.max(width, depth) / 0.48)));
    const pitch = Math.max(width, depth) / panelCount;
    const counter = appearance && /橱|餐边/.test(item.name) && height < 1.2 ? 0.032 : 0;
    const toe = appearance && height > 0.56 && bottom < 0.08 ? 0.065 : 0;
    const faceHeight = height - toe - counter;
    for (let index = 0; index < panelCount; index += 1) {
      const pos = (index + 0.5 - panelCount / 2) * pitch;
      const color = index % 2 ? 0xc2ad92 : 0xcab89d;
      part(longAlongX ? pos : 0, toe + faceHeight / 2, longAlongX ? 0 : pos, longAlongX ? pitch - 0.007 : width,
        faceHeight, longAlongX ? depth : pitch - 0.007, color, appearance?.wood);
    }
    if (counter) part(0, height - counter / 2, 0, width, counter, depth, 0xd9ccb6, appearance.stone);
    if (toe) part(0, toe / 2, 0, width - 0.045, toe, depth - 0.045, 0x5f5040);
  } else if (appearance && /柜/.test(item.name)) {
    part(0, height / 2, 0, width, height, depth, 0xad9173, appearance.wood);
  } else {
    part(0, height / 2, 0, width, height, depth, /椅|凳/.test(item.name) ? colors.softFurniture : colors.furniture);
  }
  return parts;
}

function floor(room, color, { height = 0, ...finish } = {}) {
  const shape = new THREE.Shape(room.polygon.map(([x, z]) => new THREE.Vector2(x, height ? z : -z)));
  const geometry = new THREE.ShapeGeometry(shape);
  if (finish.map) {
    const [uPeriod, vPeriod] = finish.repeatM;
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) / uPeriod, uv.getY(i) / vPeriod);
  }
  const properties = { side: THREE.DoubleSide };
  if (height) Object.assign(properties, { emissive: 0xc9baa6, emissiveIntensity: 0.13 });
  const material = surfaceMaterial({ color, roughness: 0.96, ...finish }, properties);
  if (finish.tileSizeM && finish.map) {
    // All room slabs share the same metric grout grid across doorways and open boundaries.
    material.onBeforeCompile = (shader) => {
      shader.uniforms.tileRepeat = { value: new THREE.Vector2(...finish.repeatM).divideScalar(finish.tileSizeM) };
      shader.fragmentShader = "uniform vec2 tileRepeat;\n" + shader.fragmentShader.replace("#include <map_fragment>", `
        #include <map_fragment>
        vec2 tileGrid = vMapUv * tileRepeat + vec2(0.17, 0.43);
        vec2 tileFraction = fract(tileGrid);
        vec2 nearestJoint = min(tileFraction, 1.0 - tileFraction);
        float seamDistance = min(nearestJoint.x, nearestJoint.y);
        float filterWidth = max(0.0003, max(fwidth(tileGrid.x), fwidth(tileGrid.y)) * 0.65);
        float joint = 1.0 - smoothstep(0.0015 - filterWidth, 0.0015 + filterWidth, seamDistance);
        float tileTone = fract(sin(dot(floor(tileGrid), vec2(12.9898, 78.233))) * 43758.5453);
        diffuseColor.rgb *= mix(0.986 + tileTone * 0.028, 0.77, joint);
      `);
    };
    material.customProgramCacheKey = () => "cream-porcelain-grid";
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = (height ? 1 : -1) * Math.PI / 2;
  mesh.position.y = height;
  mesh.castShadow = Boolean(height);
  mesh.receiveShadow = true;
  return mesh;
}

function roomLabel(room) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#405b4e";
  ctx.fillText(room.name, 128, 40, 248);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
  const [x, z] = room.polygon.reduce(([x, z], p) => [x + p[0] / room.polygon.length, z + p[1] / room.polygon.length], [0, 0]);
  sprite.position.set(x, 0.03, z);
  sprite.scale.set(1.45, 0.45, 1);
  return sprite;
}

function addWall(group, wall, openings, heightLimit, appearance = null, rooms = []) {
  const [ax, az] = wall.start;
  const dx = wall.end[0] - ax;
  const dz = wall.end[1] - az;
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const height = Math.min(heightLimit, wall.heightM);
  const project = ([x, z]) => Math.min(length, Math.max(0, ((x - ax) * dx + (z - az) * dz) / length));
  const cuts = openings.filter((opening) => !opening.excludedReason).map((opening) => ({
    opening, span: opening.segment.map(project).sort((a, b) => a - b),
  })).filter(({ span }) => span[1] - span[0] > 0.015).sort((a, b) => a.span[0] - b.span[0]);
  const finish = appearance?.wallFinish();
  const sideFinishes = appearance ? [1, -1].map((sign) => {
    const offset = sign * (wall.thicknessM / 2 + 0.16) / length;
    const sample = [ax + dx / 2 - dz * offset, az + dz / 2 + dx * offset];
    return appearance.wallFinish(rooms.find((room) => containsPoint(sample, room.polygon)));
  }) : [];
  function section(a, b, bottom, top, color, thickness = wall.thicknessM) {
    if (b - a < 0.012 || top - bottom < 0.01) return;
    const center = (a + b) / (2 * length);
    const mesh = box(group, ax + center * dx, (bottom + top) / 2, az + center * dz,
      b - a, top - bottom, thickness, color ?? appearance?.wall ?? colors.wall, angle, !appearance);
    if (appearance) {
      if (color === undefined) applyBoxFinish(mesh, finish, b - a, top - bottom, thickness, a, bottom, sideFinishes);
      mesh.castShadow = mesh.receiveShadow = true;
    }
    return mesh;
  }
  function solid(a, b, bottom, top) {
    section(a, b, bottom, top);
    if (appearance && bottom === 0 && top >= 0.062) section(a, b, 0.008, 0.062, appearance.trim, wall.thicknessM + 0.014);
  }
  let cursor = 0;
  for (const { opening, span: [start, end] } of cuts) {
    if (end <= cursor) continue;
    solid(cursor, start, 0, height);
    const bottom = Math.min(height, opening.sillM);
    const top = Math.min(height, opening.sillM + opening.heightM);
    solid(Math.max(cursor, start), end, 0, bottom);
    section(Math.max(cursor, start), end, top, height);
    if (opening.kind === "window") {
      const glass = section(Math.max(cursor, start), end, bottom, top, colors.window, 0.03);
      if (appearance && glass) {
        glass.material.color.setHex(0xc8d4cf);
        glass.material.roughness = 0.19;
        glass.material.transparent = true;
        glass.material.depthWrite = false;
        glass.material.opacity = 0.12;
        glass.castShadow = false;
        const metal = 0x5e5850;
        section(start, end, bottom, bottom + 0.04, metal, 0.072);
        section(start, end, top - 0.04, top, metal, 0.072);
        const panes = Math.max(1, Math.ceil((end - start) / 1.5));
        for (let index = 0; index <= panes; index += 1) {
          const x = start + 0.017 + index * (end - start - 0.034) / panes;
          section(x - 0.017, x + 0.017, bottom, top, metal, 0.072);
        }
      }
    }
    cursor = end;
  }
  solid(cursor, length, 0, height);
}

function disposeGroup(group) {
  group.traverse((object) => {
    if (!object.userData.walkAsset) object.geometry?.dispose();
    if (object.isSprite) object.material.map?.dispose();
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
    else object.material?.dispose();
  });
  group.clear();
}

const walkKeys = new Map([
  ["KeyW", "forward"], ["ArrowUp", "forward"], ["KeyS", "backward"], ["ArrowDown", "backward"],
  ["KeyA", "left"], ["ArrowLeft", "left"], ["KeyD", "right"], ["ArrowRight", "right"],
]);
const eyeHeight = 1.56;
const isInteriorView = (mode) => mode === "walk" || mode === "panorama";

function findBedroomFrame(bed, room, entry, windowView, navigation) {
  const length = Math.max(bed.widthM, bed.depthM);
  const width = Math.min(bed.widthM, bed.depthM);
  const angle = bed.rotationRad + (bed.widthM >= bed.depthM ? 0 : Math.PI / 2);
  const [ax, az] = [Math.cos(angle), Math.sin(angle)];
  const [x, z] = bed.center;
  const approach = entry ? entry.segment[0].map((value, index) => (value + entry.segment[1][index]) / 2) : [x - az, z + ax];
  const side = Math.sign((approach[0] - x) * -az + (approach[1] - z) * ax) || 1;
  const positions = [side, -side].flatMap((sign) => [0.52, 0.34].flatMap((footGap) =>
    [0.79, 0.49].map((sideGap) => {
      const forward = length / 2 + footGap;
      const across = (width / 2 + sideGap) * sign;
      return [x + ax * forward - az * across, z + az * forward + ax * across];
    })));
  const position = positions.find((point) => navigation.roomAt(point)?.id === room.id && navigation.canOccupy(point));
  if (!position) return null;
  const aim = windowView ? bed.center.map((coordinate, index) => coordinate * 0.80 + windowView.center[index] * 0.20) : bed.center;
  return { position, aim };
}

function viewpointPose(viewpoint, navigation) {
  const preferred = viewpoint.walkView;
  const [walkX, , walkZ] = preferred?.positionM ?? [];
  const framing = preferred && navigation.canOccupy([walkX, walkZ]) ? preferred : viewpoint;
  const [x, height, z] = framing.positionM;
  const [targetX, targetHeight, targetZ] = framing.targetM;
  return {
    position: [x, z], height,
    yaw: Math.atan2(x - targetX, z - targetZ),
    pitch: THREE.MathUtils.clamp(Math.atan2(targetHeight - height, Math.hypot(x - targetX, z - targetZ)), -1.16, 1.16),
    fieldOfView: framing.verticalFovDeg ?? 52,
  };
}

export function createLayoutViewer(element, { onItem, onMeasure, onWalkRoom, onWalkNotice, onGuideChange, styleId, visualProfile, overviewPreview = false } = {}) {
  const refined = styleId === "cream" && visualProfile === "cream-v7";
  const finishProfile = refined ? "cream-v6" : visualProfile;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(overviewPreview ? 0xf3f0e8 : colors.background);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("aria-label", "户型模型，拖动旋转，滚轮缩放");
  element.append(renderer.domElement);
  const world = new THREE.Scene();
  const layout = new THREE.Group();
  const annotations = new THREE.Group();
  const hemisphere = new THREE.HemisphereLight(0xfffcf2, 0xa4b7ac, 2.25);
  world.add(layout, annotations, hemisphere);
  const light = new THREE.DirectionalLight(0xfff3e8, 1.9);
  light.position.set(-5, 9, 10);
  world.add(light);
  const lighting = createWalkLighting(renderer, world, render, styleId === "cream", { visualProfile: finishProfile, refined });
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 400);
  const walkCamera = new THREE.PerspectiveCamera(62, 1, 0.027, 100);
  walkCamera.rotation.order = "YXZ";
  let appearance;
  let fitout;
  let windows = [];
  let walkPost;
  let postLoading = false;
  let walkFurniture;
  let furnitureReady;
  let capturingPanorama = false;
  let disposed = false;
  let contextLost = false;
  let navigation;
  let walkPosition = null;
  let walkRoomId;
  let walkEyeHeight = eyeHeight;
  let yaw = 0;
  let pitch = 0;
  let walkFieldOfView = 47;
  let lastFrame = null;
  let guide = null;
  const heldKeys = new Set();
  const touchDirections = new Set();
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.011);
  const target = new THREE.Vector3();
  let framePoints = [];
  let theta = Math.PI / 7;
  let phi = Math.PI / 4;
  let zoom = 1;
  let mode = "3d";
  let action = null;
  let focusedItem = null;
  let issue = null;
  let measurements = [];
  let measuring = false;
  let model;
  let itemMeshes = [];
  let doorMeshes = [];
  let frame = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;

  function clearWalkInput() {
    heldKeys.clear();
    touchDirections.clear();
    lastFrame = null;
  }

  function reportWalkPosition() {
    const room = walkPosition ? navigation?.roomAt(walkPosition) : null;
    // Keep the last room active across the shared doorway between its floor and the next room's floor.
    if (walkPosition && !room && walkRoomId) return;
    const id = room?.id || null;
    if (id !== walkRoomId) {
      walkRoomId = id;
      lighting.setRoom(room, windows.some((window) => window.room.id === id));
      onWalkRoom?.(id);
    }
  }

  function applyViewpoint({ position, height, yaw: heading, pitch: tilt, fieldOfView }) {
    walkPosition = [...position];
    walkEyeHeight = height;
    yaw = heading;
    pitch = tilt;
    walkFieldOfView = fieldOfView;
    reportWalkPosition();
  }

  function placeWalker(roomId = null) {
    clearWalkInput();
    const viewpoint = model.viewpoints?.filter((candidate) => !roomId || candidate.roomId === roomId)
      .map((candidate) => viewpointPose(candidate, navigation)).find((pose) => navigation.canOccupy(pose.position));
    if (viewpoint) {
      applyViewpoint(viewpoint);
      onWalkNotice?.("");
      return;
    }
    const nextPosition = navigation?.spawn(roomId);
    if (!nextPosition) {
      if (!walkPosition || !navigation?.canOccupy(walkPosition)) walkPosition = null;
      onWalkNotice?.("当前空间内没有足够的站立位置。可在平面视图调整布局。");
      reportWalkPosition();
      return;
    }
    walkPosition = nextPosition;
    const room = navigation.roomAt(walkPosition);
    const doors = model.openings.filter((opening) => opening.kind !== "window" && !opening.excludedReason && opening.roomIds.includes(room?.id));
    const ahead = doors.find((door) => door.id !== model.entranceId) || doors[0];
    const roomItems = roomId ? model.items.filter((item) => item.roomId === room?.id) : [];
    const sofa = roomItems.find((item) => /沙发|sofa/i.test(item.name));
    const dining = roomItems.find(isDiningTable);
    const tv = roomItems.find((item) => /电视柜|tv.?console/i.test(item.name));
    const bed = roomItems.find((item) => /床(?!头|边|尾)|\bbed\b/i.test(item.name));
    const furnishTarget = sofa || dining || bed || roomItems.find((item) => /台盆柜|浴室柜/i.test(item.name)) ||
      roomItems.find((item) => /橱柜|玄关柜|淋浴隔断/i.test(item.name));
    let aim = furnishTarget?.center || ahead?.segment.reduce(([x, z], [px, pz]) => [x + px / 2, z + pz / 2], [0, 0]);
    let frameType;
    if (furnishTarget) {
      const broadWindow = windows.filter((window) => window.room.id === room.id).sort((a, b) => b.span - a.span)[0];
      if (broadWindow) aim = aim.map((coordinate, index) => coordinate * 0.71 + broadWindow.center[index] * 0.29);
      else if (sofa && dining) aim = aim.map((coordinate, index) => coordinate * 0.63 + dining.center[index] * 0.37);
      const { minX, maxX, minZ, maxZ } = getLayoutBounds({ rooms: [room], walls: [] });
      const anchors = [0.12, 0.34, 0.66, 0.88].flatMap((u) => [0.12, 0.34, 0.66, 0.88].map((v) => [
        THREE.MathUtils.lerp(minX, maxX, u), THREE.MathUtils.lerp(minZ, maxZ, v),
      ]));
      function frameScore([x, z]) {
        const distance = Math.hypot(x - aim[0], z - aim[1]);
        const diagonal = Math.abs(x - aim[0]) * Math.abs(z - aim[1]) / Math.max(0.25, distance);
        const windowDepth = broadWindow
          ? (x - broadWindow.center[0]) * broadWindow.inward[0] + (z - broadWindow.center[1]) * broadWindow.inward[1] : 0;
        return Math.min(distance, 3.9) + 0.23 * diagonal + 0.37 * windowDepth;
      }
      const frame = anchors.filter((point) => navigation.roomAt(point)?.id === room.id && navigation.canOccupy(point))
        .sort((a, b) => frameScore(b) - frameScore(a))[0];
      if (frame) walkPosition = frame;
      if (styleId === "cream" && furnishTarget === bed) {
        const bedroomFrame = findBedroomFrame(bed, room, ahead, broadWindow, navigation);
        if (bedroomFrame) {
          walkPosition = bedroomFrame.position;
          aim = bedroomFrame.aim;
          frameType = "bedroom";
        }
      }
      if (styleId === "cream" && sofa && tv && broadWindow) {
        const diningIds = new Set(model.items.filter(isDiningTable).map((item) => item.roomId));
        const adjoiningDining = doors.find((opening) => opening.kind === "passage" && opening.roomIds
          .some((id) => id !== room.id && diningIds.has(id)));
        if (adjoiningDining) {
          const entry = adjoiningDining.segment.map(([x, z]) => new THREE.Vector2(x, z));
          const center = entry[0].lerp(entry[1], 0.5);
          const { center: [x, z], inward: [nx, nz], span } = broadWindow;
          if (center.distanceTo(new THREE.Vector2(x, z)) > 2.7) {
            const tvSide = Math.sign((tv.center[0] - x) * -nz + (tv.center[1] - z) * nx) || 1;
            const candidate = [0.65, 0.86, 1.06].flatMap((inset) => [0.35, 0.27, 0.16].map((offset) => [
              x + nx * inset - nz * span * offset * tvSide, z + nz * inset + nx * span * offset * tvSide,
            ])).find((position) => navigation.roomAt(position)?.id === room.id && navigation.canOccupy(position));
            if (candidate) {
              walkPosition = candidate;
              aim = [center.x * 0.63 + sofa.center[0] * 0.37, center.y * 0.63 + sofa.center[1] * 0.37];
              frameType = "living-dining";
            }
          }
        }
      }
      if (!frameType && sofa && tv && broadWindow?.span > 2.35) {
        const { center: [x, z], inward: [nx, nz], span } = broadWindow;
        const distance = THREE.MathUtils.clamp(span * 0.95, 2.55, 4.3);
        const sofaSide = Math.sign((sofa.center[0] - x) * -nz + (sofa.center[1] - z) * nx);
        const offsets = [-span * 0.29 * sofaSide, -span * 0.19 * sofaSide, -span * 0.09 * sofaSide];
        const candidate = [distance, distance - 0.35, distance - 0.7].flatMap((depth) => offsets.map((offset) => [
          x + nx * depth - nz * offset, z + nz * depth + nx * offset,
        ])).find((position) => navigation.roomAt(position)?.id === room.id && navigation.canOccupy(position));
        if (candidate) {
          walkPosition = candidate;
          aim = [sofa.center[0] * 0.76 + x * 0.24, sofa.center[1] * 0.76 + z * 0.24];
          frameType = "living";
        }
      }
    }
    yaw = aim ? Math.atan2(walkPosition[0] - aim[0], walkPosition[1] - aim[1]) : Math.PI;
    walkEyeHeight = frameType === "living-dining" ? 1.35 : eyeHeight;
    pitch = frameType === "living-dining" ? -0.095 : frameType === "bedroom" ? -0.19 : furnishTarget ? -0.16 : -0.05;
    walkFieldOfView = frameType === "living-dining" ? 54 : frameType === "living" ? 55 : frameType === "bedroom" ? 52 : 47;
    onWalkNotice?.("");
    reportWalkPosition();
  }

  function stopGuide(message = "") {
    if (!guide) return;
    guide = null;
    lastFrame = null;
    onGuideChange?.(false);
    onWalkNotice?.(message);
  }

  function startGuide() {
    if (mode !== "walk" || !model?.viewpoints || guide) return;
    if (!navigation?.canOccupy(walkPosition)) {
      onWalkNotice?.("请选择一个可站立的房间后开始导览。");
      return;
    }
    clearWalkInput();
    guide = { queue: [...model.viewpoints], total: model.viewpoints.length, arrived: 0, missed: [], stop: null };
    onGuideChange?.(true);
    onWalkNotice?.("正在计算房间之间的动线…");
    render();
  }

  function turnForGuide(heading, tilt, elapsed) {
    const difference = Math.atan2(Math.sin(heading - yaw), Math.cos(heading - yaw));
    yaw += THREE.MathUtils.clamp(difference, -2.05 * elapsed, 2.05 * elapsed);
    pitch += THREE.MathUtils.clamp(tilt - pitch, -0.9 * elapsed, 0.9 * elapsed);
    return Math.abs(difference);
  }

  function stepGuide(elapsed) {
    if (!guide.stop) {
      const viewpoint = guide.queue.shift();
      if (!viewpoint) {
        const { arrived, total, missed } = guide;
        stopGuide(missed.length ? `已导览 ${arrived}/${total} 个机位。无法到达${missed.join("、")}，请检查门扇和通道。`
          : `已完成 ${total} 个机位的动线导览。`);
        return false;
      }
      const pose = viewpointPose(viewpoint, navigation);
      const route = planWalkRoute(model, navigation, walkPosition, pose.position);
      if (route) {
        guide.stop = { viewpoint, pose, route, pause: 1.5, stalled: 0 };
        onWalkNotice?.(`前往${viewpoint.name} · ${guide.total - guide.queue.length}/${guide.total}`);
      } else guide.missed.push(viewpoint.name);
      return true;
    }

    const { stop } = guide;
    const next = stop.route[0];
    walkEyeHeight += THREE.MathUtils.clamp(stop.pose.height - walkEyeHeight, -0.35 * elapsed, 0.35 * elapsed);
    if (!next) {
      turnForGuide(stop.pose.yaw, stop.pose.pitch, elapsed);
      walkFieldOfView += THREE.MathUtils.clamp(stop.pose.fieldOfView - walkFieldOfView, -18 * elapsed, 18 * elapsed);
      stop.pause -= elapsed;
      if (stop.pause <= 0) {
        applyViewpoint(stop.pose);
        guide.arrived += 1;
        guide.stop = null;
      }
      return true;
    }

    const dx = next[0] - walkPosition[0];
    const dz = next[1] - walkPosition[1];
    const gap = Math.hypot(dx, dz);
    if (gap < 0.006) {
      walkPosition = next;
      stop.route.shift();
    } else if (turnForGuide(Math.atan2(-dx, -dz), -0.04, elapsed) < 0.68 && elapsed > 0) {
      const step = Math.min(1, 1.1 * elapsed / gap);
      const reached = navigation.move(walkPosition, [dx * step, dz * step]);
      const progress = Math.hypot(reached[0] - walkPosition[0], reached[1] - walkPosition[1]);
      walkPosition = reached;
      stop.stalled = progress < 0.001 ? stop.stalled + elapsed : 0;
      if (stop.stalled > 0.3) {
        guide.missed.push(stop.viewpoint.name);
        guide.stop = null;
      }
    }
    reportWalkPosition();
    return true;
  }

  function stepWalk(timestamp) {
    const directions = new Set([...heldKeys].map((key) => walkKeys.get(key)).concat([...touchDirections]));
    if (!directions.size && !guide) { lastFrame = null; return false; }
    const elapsed = lastFrame === null ? 0 : Math.min(0.09, Math.max(0, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    if (guide) return stepGuide(elapsed);
    const right = Number(directions.has("right")) - Number(directions.has("left"));
    const forward = Number(directions.has("forward")) - Number(directions.has("backward"));
    const distance = 1.55 * elapsed / (Math.hypot(right, forward) || 1);
    if (walkPosition && distance > 0 && (right || forward)) {
      const toward = [(right * Math.cos(yaw) - forward * Math.sin(yaw)) * distance,
        (-right * Math.sin(yaw) - forward * Math.cos(yaw)) * distance];
      walkPosition = navigation.move(walkPosition, toward);
      reportWalkPosition();
    }
    return true;
  }

  function lookAround(horizontal, vertical) {
    const limit = mode === "panorama" ? Math.PI / 2 - 0.01 : 1.16;
    yaw += horizontal;
    pitch = THREE.MathUtils.clamp(pitch + vertical, -limit, limit);
  }

  function render() {
    if (frame || contextLost || disposed) return;
    frame = requestAnimationFrame((timestamp) => {
      frame = 0;
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width < 2 || height < 2) return;
      const aspect = width / height;
      if (viewportWidth !== width || viewportHeight !== height) {
        viewportWidth = width;
        viewportHeight = height;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(2_100_000 / (width * height))));
        renderer.setSize(width, height, false);
        walkPost?.resize(width, height);
      }
      if (isInteriorView(mode)) {
        if (!walkPosition) {
          renderer.clear();
          return;
        }
        const moving = mode === "walk" && stepWalk(timestamp);
        walkCamera.position.set(walkPosition[0], walkEyeHeight, walkPosition[1]);
        walkCamera.rotation.set(pitch, yaw, 0);
        walkCamera.aspect = aspect;
        walkCamera.fov = Math.min(75, Math.max(walkFieldOfView, 2 * THREE.MathUtils.radToDeg(Math.atan(0.96 / aspect))));
        walkCamera.updateProjectionMatrix();
        if (walkPost) walkPost.render();
        else renderer.render(world, walkCamera);
        if (moving) render();
        return;
      }
      renderOverview(aspect);
    });
  }

  function renderOverview(aspect) {
    const distance = 80;
    if (mode === "plan") {
      camera.up.set(0, 0, -1);
      camera.position.set(target.x, distance, target.z);
    } else {
      camera.up.set(0, 1, 0);
      camera.position.set(target.x + distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(phi), target.z + distance * Math.cos(theta) * Math.sin(phi));
    }
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
    const view = new THREE.Box3();
    if (framePoints.length) {
      const projected = new THREE.Vector3();
      for (const point of framePoints) view.expandByPoint(projected.copy(point).applyMatrix4(camera.matrixWorldInverse));
    } else {
      view.set(new THREE.Vector3(-4, -4, -80), new THREE.Vector3(4, 4, -80));
    }
    const size = view.getSize(new THREE.Vector3());
    const center = view.getCenter(new THREE.Vector3());
    const vertical = Math.max(size.y, size.x / aspect, 1) * 0.59 / zoom;
    camera.left = center.x - vertical * aspect;
    camera.right = center.x + vertical * aspect;
    camera.top = center.y + vertical;
    camera.bottom = center.y - vertical;
    camera.updateProjectionMatrix();
    renderer.render(world, camera);
  }

  function captureOverview({ width, height }) {
    if (!overviewPreview || !model || disposed || contextLost || renderer.getContext().isContextLost()) {
      throw new Error("无法生成整屋 3D 预览。");
    }
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    renderOverview(width / height);
    return new Promise((resolve, reject) => {
      renderer.domElement.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("无法生成整屋 3D 预览。"));
      }, "image/png");
    });
  }

  function mark() {
    disposeGroup(annotations);
    if (measurements.length === 2) line(annotations, ...measurements, colors.selection, 0.04);
    const point = issue?.point;
    if (point) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.21, 32), new THREE.MeshBasicMaterial({ color: colors.issue, side: THREE.DoubleSide, depthTest: false }));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(point[0], 0.051, point[1]);
      annotations.add(ring);
    }
    const highlight = new Set([focusedItem, ...(issue?.itemIds || [])]);
    for (const mesh of itemMeshes) {
      const selected = highlight.has(mesh.userData.id);
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material, idx) => {
        const base = mesh.userData.materialColors?.[idx] ?? mesh.userData.color;
        if (base !== undefined) material.color?.setHex(selected ? colors.selection : base);
      });
    }
    render();
  }

  function focus(points) {
    const bounds = getLayoutBounds(points);
    framePoints = points.rooms.flatMap((room) => room.polygon.map(([x, z]) => new THREE.Vector3(x, 0, z)));
    for (const wall of points.walls) for (const [x, z] of [wall.start, wall.end]) {
      framePoints.push(new THREE.Vector3(x, 0, z), new THREE.Vector3(x, Math.min(wall.heightM, 1.12), z));
    }
    for (const item of points.items || []) {
      const [x, z] = item.center;
      const y = item.bottomM + item.heightM;
      const c = Math.cos(item.rotationRad);
      const s = Math.sin(item.rotationRad);
      for (const a of [-item.widthM / 2, item.widthM / 2]) for (const b of [-item.depthM / 2, item.depthM / 2]) {
        framePoints.push(new THREE.Vector3(x + a * c - b * s, y, z + a * s + b * c));
      }
    }
    target.set((bounds.minX + bounds.maxX) / 2, 0, (bounds.minZ + bounds.maxZ) / 2);
    zoom = 1;
    render();
  }

  function update(scene, { reset = false } = {}) {
    if (reset || model !== scene) stopGuide();
    const priorDoorState = model === scene && navigation ? new Map(doorMeshes.map((mesh) => [mesh.userData.openingId, mesh.userData.isOpen])) : new Map();
    model = scene;
    disposeGroup(layout);
    itemMeshes = [];
    doorMeshes = [];
    if (reset) {
      focus(scene);
      theta = Math.PI / 7;
      phi = Math.PI / 4;
      measurements = [];
    }
    const walking = isInteriorView(mode);
    annotations.visible = !walking;
    hemisphere.visible = light.visible = !walking;
    renderer.toneMapping = walking ? THREE.ACESFilmicToneMapping : THREE.NeutralToneMapping;
    renderer.toneMappingExposure = walking ? (styleId === "cream" ? 1.10 : 1.17) : 1;
    windows = walking ? exteriorWindows(scene) : [];
    lighting.update(scene, walking, windows);
    if (walking && !appearance) {
      appearance = createWalkAppearance(styleId, render, { visualProfile: finishProfile });
      fitout = createWalkFitout({ refined });
    }
    if (walking && !postLoading) {
      postLoading = true;
      import("./walk-post.js?v=cream-v7-interior").then(({ createWalkPost }) => {
        if (disposed || contextLost) return;
        walkPost = createWalkPost(renderer, world, walkCamera, { cream: styleId === "cream", refined });
        if (viewportWidth && viewportHeight) walkPost?.resize(viewportWidth, viewportHeight);
        if (isInteriorView(mode)) render();
      }).catch(() => { /* Direct rendering is still available. */ });
    }
    if (walking && !furnitureReady) {
      furnitureReady = loadWalkFurniture({ cream: styleId === "cream" }).then((assets) => {
        if (disposed) { assets.dispose(); return; }
        walkFurniture = assets;
        if (isInteriorView(mode) && model) update(model);
      }).catch(() => { /* Native furniture remains usable if a GLB cannot load. */ });
    }
    const heights = scene.walls.map((wall) => wall.heightM).filter((height) => height > 1.9).sort((a, b) => a - b);
    const ceiling = heights[Math.floor(heights.length / 2)] || 2.7;
    for (const [index, room] of scene.rooms.entries()) {
      if (walking) {
        const finish = appearance.floor(room);
        layout.add(floor(room, finish.color, finish), floor(room, appearance.ceiling, { height: ceiling }));
      } else {
        const base = colors.floors[index % colors.floors.length];
        const finish = overviewPreview && previewFloorColors[room.editorMaterial];
        layout.add(floor(room, finish || base), roomLabel(room));
      }
    }
    scene.walls.forEach((wall) => addWall(layout, wall, scene.openings.filter((opening) => opening.wallId === wall.id),
      walking ? Infinity : mode === "plan" ? 0.08 : 1.12, walking ? appearance : null, scene.rooms));
    const roomsById = new Map(scene.rooms.map((room) => [room.id, room]));
    const diningTables = walking ? scene.items.filter(isDiningTable) : [];
    for (const item of scene.items) {
      let facing;
      if (walking && /餐椅|dining.?chair/i.test(item.name) && item.roomId) {
        const nearby = diningTables.filter((table) => table.roomId === item.roomId).map((table) => [
          table.center[0] - item.center[0], table.center[1] - item.center[1],
        ]).sort((a, b) => Math.hypot(...a) - Math.hypot(...b))[0];
        if (nearby && Math.hypot(...nearby) <= 1.8) facing = nearby;
      }
      const asset = walking && walkFurniture?.create(item, { facing, appearance });
      if (asset) { layout.add(asset.group); itemMeshes.push(...asset.meshes); }
      else {
        const meshes = furniture(layout, item, !walking, walking ? appearance : null, roomsById.get(item.roomId));
        if (overviewPreview && item.editorColor) {
          const finish = new THREE.Color(item.editorColor);
          for (const mesh of meshes) {
            mesh.material.color.lerp(finish, 0.48);
            mesh.userData.color = mesh.material.color.getHex();
          }
        }
        itemMeshes.push(...meshes);
      }
    }
    if (walking) {
      for (const mesh of itemMeshes) {
        mesh.castShadow = !(Array.isArray(mesh.material) ? mesh.material.every((material) => material.transparent) : mesh.material.transparent);
        mesh.receiveShadow = true;
      }
      fitout.add(layout, scene, windows, ceiling, appearance);
      navigation = createWalkNavigation(scene, { eyeHeight, includeDoorLeaves: true });
      for (const [id, open] of priorDoorState) navigation.setDoorOpen(id, open, walkPosition);
      const living = scene.rooms.find((room) => /客(?:餐)?厅|living|lounge/i.test(room.name + room.id) && !room.excludeFromRoutes);
      if (!walkPosition || reset || !navigation.canOccupy(walkPosition)) placeWalker(living?.id);
      else lighting.setRoom(navigation.roomAt(walkPosition), windows.some((window) => window.room.id === walkRoomId));
      reportWalkPosition();
      scene.openings.forEach((opening) => drawWalkDoor(opening.id));
      mark();
      return;
    }
    for (const opening of scene.openings.filter((opening) => opening.kind !== "window")) {
      line(layout, ...opening.segment, opening.excludedReason ? colors.issue : colors.opening, 0.035);
      if (!opening.hinge || !opening.swingSide || opening.excludedReason || opening.doorType !== "hinged") continue;
      const pin = opening.segment[opening.hinge === "start" ? 0 : 1];
      const end = opening.segment[opening.hinge === "start" ? 1 : 0];
      const width = Math.hypot(end[0] - pin[0], end[1] - pin[1]);
      const dir = new THREE.Vector2(...opening.swingSide).normalize();
      let last = end;
      for (let step = 1; step <= 12; step += 1) {
        const angle = step * Math.PI / 24;
        const next = [pin[0] + (end[0] - pin[0]) * Math.cos(angle) + dir.x * width * Math.sin(angle),
          pin[1] + (end[1] - pin[1]) * Math.cos(angle) + dir.y * width * Math.sin(angle)];
        line(layout, last, next, 0xafab96, 0.036);
        last = next;
      }
    }
    mark();
  }

  function drawWalkDoor(id) {
    const leaf = navigation?.doorLeaf(id);
    if (!leaf) return;
    const { start: [x, z], end: [endX, endZ], sillM, heightM, thicknessM } = leaf;
    const width = Math.hypot(endX - x, endZ - z);
    if (width <= 0.025 || heightM <= 0.06) return;
    const mesh = box(layout, (x + endX) / 2, sillM + heightM / 2, (z + endZ) / 2,
      width, heightM - 0.022, thicknessM, 0xac8e6f, Math.atan2(endZ - z, endX - x), false);
    applyBoxFinish(mesh, appearance.wood, width, heightM, thicknessM);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.openingId = id;
    mesh.userData.isOpen = leaf.open;
    doorMeshes.push(mesh);
  }

  function toggleWalkDoor(mesh) {
    const openingId = mesh.userData.openingId;
    const opened = navigation.setDoorOpen(openingId, !mesh.userData.isOpen, walkPosition);
    if (!opened) { onWalkNotice?.("门扇当前被挡住。请退开或检查附近家具。"); return; }
    layout.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    doorMeshes = doorMeshes.filter((entry) => entry !== mesh);
    drawWalkDoor(openingId);
    lighting.invalidateShadows();
    onWalkNotice?.("");
    render();
  }

  function eventRay(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const point = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(point, isInteriorView(mode) && walkPosition ? walkCamera : camera);
    return raycaster;
  }

  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || action) return;
    stopGuide();
    if (isInteriorView(mode)) canvas.focus({ preventScroll: true });
    action = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (action?.pointerId !== event.pointerId || mode === "plan" || measuring) return;
    const dx = event.clientX - action.x;
    const dy = event.clientY - action.y;
    if (Math.hypot(event.clientX - action.startX, event.clientY - action.startY) > 6) action.dragged = true;
    if (isInteriorView(mode)) {
      lookAround(-dx * 0.0045, -dy * 0.0045);
    } else {
      theta -= dx * 0.012;
      phi = THREE.MathUtils.clamp(phi + dy * 0.007, 0.24, 1.35);
    }
    action.x = event.clientX;
    action.y = event.clientY;
    render();
  });
  canvas.addEventListener("pointerup", (event) => {
    if (action?.pointerId !== event.pointerId) return;
    const dragged = action.dragged || Math.hypot(event.clientX - action.startX, event.clientY - action.startY) > 6;
    action = null;
    if (dragged) return;
    if (isInteriorView(mode)) {
      const hit = eventRay(event).intersectObjects(layout.children, true).find(({ object }) => object.isMesh);
      if (mode === "walk" && hit?.object.userData.openingId && hit.distance <= 2.4) toggleWalkDoor(hit.object);
      else if (hit?.object.userData.id) onItem?.(hit.object.userData.id);
      return;
    }
    if (measuring) {
      const hit = eventRay(event).ray.intersectPlane(ground, new THREE.Vector3());
      if (!hit) return;
      if (measurements.length === 2) measurements = [];
      measurements.push([hit.x, hit.z]);
      onMeasure?.(measurements.length === 2 ? Math.hypot(measurements[0][0] - hit.x, measurements[0][1] - hit.z) : null);
      mark();
      return;
    }
    const mesh = eventRay(event).intersectObjects(itemMeshes)[0]?.object;
    if (mesh) onItem?.(mesh.userData.id);
  });
  for (const name of ["pointercancel", "lostpointercapture"]) canvas.addEventListener(name, (event) => {
    if (action?.pointerId === event.pointerId) action = null;
  });
  canvas.addEventListener("wheel", (event) => {
    if (isInteriorView(mode)) return;
    event.preventDefault();
    zoom = THREE.MathUtils.clamp(zoom * Math.exp(-event.deltaY * 0.0015), 0.55, 4);
    render();
  }, { passive: false });
  canvas.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (mode === "panorama") {
      if (!event.code.startsWith("Arrow")) return;
      const horizontal = 0.14 * (Number(event.code === "ArrowLeft") - Number(event.code === "ArrowRight"));
      const vertical = 0.14 * (Number(event.code === "ArrowUp") - Number(event.code === "ArrowDown"));
      event.preventDefault();
      lookAround(horizontal, vertical);
      render();
      return;
    }
    if (mode === "walk") {
      if (event.code === "Escape") {
        stopGuide();
        clearWalkInput();
      }
      if (!walkKeys.has(event.code)) return;
      event.preventDefault();
      stopGuide();
      heldKeys.add(event.code);
      render();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") theta += event.key === "ArrowLeft" ? 0.16 : -0.16;
    else if (["+", "=", "-"].includes(event.key)) zoom = THREE.MathUtils.clamp(zoom * (event.key === "-" ? 0.85 : 1.18), 0.55, 4);
    else return;
    event.preventDefault();
    render();
  });
  canvas.addEventListener("keyup", (event) => heldKeys.delete(event.code));
  canvas.addEventListener("blur", clearWalkInput);
  canvas.addEventListener("webglcontextlost", () => {
    contextLost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    clearWalkInput();
    stopGuide();
    onWalkNotice?.("正在恢复 3D 画面…");
  });
  canvas.addEventListener("webglcontextrestored", () => {
    contextLost = false;
    walkPost?.dispose();
    walkPost = null;
    postLoading = true;
    lighting.invalidateShadows();
    onWalkNotice?.("");
    render();
  });
  function interruptWalk() {
    stopGuide();
    clearWalkInput();
  }
  window.addEventListener("blur", interruptWalk);
  document.addEventListener("visibilitychange", interruptWalk);
  const observer = new ResizeObserver(render);
  observer.observe(element);

  async function capturePanorama() {
    if (capturingPanorama) throw new Error("正在导出上一张全景。");
    const room = walkPosition && navigation?.roomAt(walkPosition);
    if (mode !== "panorama" || !room || room.excludeFromRoutes || !navigation.canOccupy(walkPosition)) {
      throw new Error("请先在室内选择一个可环视的位置。");
    }
    const source = model;
    const [x, z] = walkPosition;
    const heightAtCapture = walkEyeHeight;
    const heading = yaw;
    capturingPanorama = true;
    try {
      const [{ captureWalkPanorama }, { tagEquirectangularJpeg }] = await Promise.all([
        import("./walk-panorama-capture.js?v=panorama-preview-1"), import("./panorama-xmp.js"),
        furnitureReady, appearance?.ready, lighting.ready(),
      ]);
      if (disposed || model !== source || mode !== "panorama" || navigation.roomAt(walkPosition)?.id !== room.id ||
          !navigation.canOccupy([x, z])) throw new Error("当前站位已经变化，请重新导出。");
      if (contextLost || renderer.getContext().isContextLost()) throw new Error("3D 画面正在恢复，请稍后再导出。");
      const width = 4096;
      const height = width / 2;
      const jpeg = await captureWalkPanorama(renderer, world, { position: [x, heightAtCapture, z], yaw: heading, width });
      const blob = await tagEquirectangularJpeg(jpeg, width, height);
      return { blob, width, height, roomId: room.id, roomName: room.name };
    } finally {
      capturingPanorama = false;
      render();
    }
  }

  return {
    update,
    captureOverview,
    capturePanorama,
    startGuide,
    stopGuide,
    async readyForWalk() {
      await Promise.all([furnitureReady, appearance?.ready]);
    },
    setMode(value) {
      if (mode === value) return;
      const wasInside = isInteriorView(mode);
      stopGuide();
      clearWalkInput();
      action = null;
      mode = value;
      const inside = isInteriorView(mode);
      canvas.setAttribute("aria-label", mode === "walk" ? "第一人称漫游，方向键移动，拖动转向"
        : mode === "panorama" ? "实时全景，拖动或使用方向键环视房间" : "户型模型，拖动旋转，滚轮缩放");
      if (wasInside && inside) {
        if (mode === "walk") lookAround(0, 0);
        render();
      } else if (model) {
        walkRoomId = undefined;
        update(model);
      }
      if (inside) canvas.focus({ preventScroll: true });
    },
    focusRoom(id) {
      if (isInteriorView(mode)) { stopGuide(); placeWalker(id || null); render(); return; }
      const room = model?.rooms.find((room) => room.id === id);
      if (model) focus(room ? { rooms: [room], walls: [] } : model);
    },
    setWalkInput(direction, active) {
      if (mode !== "walk") return;
      if (active) {
        stopGuide();
        touchDirections.add(direction);
      }
      else touchDirections.delete(direction);
      render();
    },
    clearWalkInput,
    setMeasuring(value) { measuring = value; measurements = []; mark(); },
    highlight(id, point, itemIds) {
      focusedItem = id;
      issue = point ? { point, itemIds } : null;
      if (point && !isInteriorView(mode)) {
        const [x, z] = point;
        const extent = 2.15;
        focus({ rooms: [{ polygon: [[x - extent, z - extent], [x + extent, z - extent], [x + extent, z + extent], [x - extent, z + extent]] }], walls: [] });
      }
      mark();
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("blur", interruptWalk);
      document.removeEventListener("visibilitychange", interruptWalk);
      disposeGroup(layout);
      disposeGroup(annotations);
      walkFurniture?.dispose();
      appearance?.dispose();
      fitout?.dispose();
      walkPost?.dispose();
      lighting.dispose();
      renderer.dispose();
      if (overviewPreview) renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
