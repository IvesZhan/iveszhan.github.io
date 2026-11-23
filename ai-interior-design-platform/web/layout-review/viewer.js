import * as THREE from "./vendor/three.module.min.js";
import { getLayoutBounds } from "./scene.js";

const colors = {
  background: 0xecece4, floors: [0xe9e2d1, 0xe9e2d1, 0xe9e6da, 0xe9e0d1],
  wall: 0xf5f1e7, wallTop: 0xbcb9a7, window: 0xa5b6b3,
  opening: 0x849589, furniture: 0xb19b7e, softFurniture: 0xc4bfae,
  selection: 0x4f826d, issue: 0xad5a4c,
};

function line(scene, a, b, color, height = 0.025) {
  const path = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], height, a[1]), new THREE.Vector3(b[0], height, b[1])]);
  scene.add(new THREE.Line(path, new THREE.LineBasicMaterial({ color })));
}

function box(container, x, y, z, width, height, depth, color, angle = 0) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.84 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = -angle;
  container.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: colors.wallTop, transparent: true, opacity: 0.48 }));
  mesh.add(edges);
  return mesh;
}

function furniture(group, item) {
  const [x, z] = item.center;
  const { widthM: width, depthM: depth, heightM: height, bottomM: bottom, rotationRad: angle } = item;
  const node = new THREE.Group();
  node.position.set(x, bottom, z);
  node.rotation.y = -angle;
  group.add(node);
  const parts = [];
  function part(px, py, pz, w, h, d, color) {
    if (w <= 0.008 || h <= 0.008 || d <= 0.008) return;
    const mesh = box(node, px, py, pz, w, h, d, color);
    mesh.userData = { id: item.id, color };
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
  } else if (/餐桌|茶几|床头几|书桌/.test(item.name) && height > 0.16) {
    const plate = Math.min(0.055, height * 0.18);
    part(0, height - plate / 2, 0, width, plate, depth, 0xbb9b75);
    const leg = Math.min(0.05, width * 0.14, depth * 0.14);
    for (const signX of [-1, 1]) for (const signZ of [-1, 1]) {
      part(signX * (width / 2 - leg), (height - plate) / 2, signZ * (depth / 2 - leg), leg, height - plate, leg, 0xa38769);
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
  } else if (/柜/.test(item.name) && height > 0.34 && Math.max(width, depth) > 0.8) {
    const longAlongX = width > depth;
    const panelCount = Math.max(2, Math.min(5, Math.round(Math.max(width, depth) / 0.48)));
    const pitch = Math.max(width, depth) / panelCount;
    for (let index = 0; index < panelCount; index += 1) {
      const pos = (index + 0.5 - panelCount / 2) * pitch;
      const color = index % 2 ? 0xc2ad92 : 0xcab89d;
      part(longAlongX ? pos : 0, height / 2, longAlongX ? 0 : pos, longAlongX ? pitch - 0.009 : width,
        height, longAlongX ? depth : pitch - 0.009, color);
    }
  } else {
    part(0, height / 2, 0, width, height, depth, /椅|凳/.test(item.name) ? colors.softFurniture : colors.furniture);
  }
  return parts;
}

function floor(room, color) {
  const shape = new THREE.Shape(room.polygon.map(([x, z]) => new THREE.Vector2(x, z)));
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.96, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
  mesh.rotation.x = Math.PI / 2;
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

function addWall(group, wall, openings, heightLimit) {
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
  function section(a, b, bottom, top, color = colors.wall, thickness = wall.thicknessM) {
    if (b - a < 0.012 || top - bottom < 0.01) return;
    const center = (a + b) / (2 * length);
    box(group, ax + center * dx, (bottom + top) / 2, az + center * dz, b - a, top - bottom, thickness, color, angle);
  }
  let cursor = 0;
  for (const { opening, span: [start, end] } of cuts) {
    if (end <= cursor) continue;
    section(cursor, start, 0, height);
    const bottom = Math.min(height, opening.sillM);
    const top = Math.min(height, opening.sillM + opening.heightM);
    section(Math.max(cursor, start), end, 0, bottom);
    section(Math.max(cursor, start), end, top, height);
    if (opening.kind === "window") section(Math.max(cursor, start), end, bottom, top, colors.window, 0.03);
    cursor = end;
  }
  section(cursor, length, 0, height);
}

function disposeGroup(group) {
  group.traverse((object) => {
    object.geometry?.dispose();
    object.material?.map?.dispose();
    object.material?.dispose();
  });
  group.clear();
}

export function createLayoutViewer(element, { onItem, onMeasure } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(colors.background);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("aria-label", "户型模型，拖动旋转，滚轮缩放");
  element.append(renderer.domElement);
  const world = new THREE.Scene();
  const layout = new THREE.Group();
  const annotations = new THREE.Group();
  world.add(layout, annotations, new THREE.HemisphereLight(0xfffcf2, 0xa4b7ac, 2.25));
  const light = new THREE.DirectionalLight(0xfff3e8, 1.9);
  light.position.set(-5, 9, 10);
  world.add(light);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 400);
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
  let frame = 0;

  function render() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (element.clientWidth < 2 || element.clientHeight < 2) return;
      const aspect = element.clientWidth / element.clientHeight;
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
      renderer.setSize(element.clientWidth, element.clientHeight, false);
      renderer.render(world, camera);
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
    itemMeshes.forEach((mesh) => mesh.material.color.setHex(highlight.has(mesh.userData.id) ? colors.selection : mesh.userData.color));
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
    model = scene;
    disposeGroup(layout);
    itemMeshes = [];
    if (reset) {
      focus(scene);
      theta = Math.PI / 7;
      phi = Math.PI / 4;
      measurements = [];
    }
    scene.rooms.forEach((room, index) => layout.add(floor(room, colors.floors[index % colors.floors.length]), roomLabel(room)));
    scene.walls.forEach((wall) => addWall(layout, wall, scene.openings.filter((opening) => opening.wallId === wall.id), mode === "plan" ? 0.08 : 1.12));
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
    for (const item of scene.items) itemMeshes.push(...furniture(layout, item));
    mark();
  }

  function eventRay(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const point = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(point, camera);
    return raycaster;
  }

  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    action = { startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!action || mode === "plan" || measuring) return;
    theta -= (event.clientX - action.x) * 0.012;
    phi = THREE.MathUtils.clamp(phi + (event.clientY - action.y) * 0.007, 0.24, 1.35);
    action.x = event.clientX;
    action.y = event.clientY;
    render();
  });
  canvas.addEventListener("pointerup", (event) => {
    if (!action) return;
    const moved = Math.hypot(event.clientX - action.startX, event.clientY - action.startY);
    action = null;
    if (moved > 6) return;
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
  canvas.addEventListener("pointercancel", () => { action = null; });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = THREE.MathUtils.clamp(zoom * Math.exp(-event.deltaY * 0.0015), 0.55, 4);
    render();
  }, { passive: false });
  canvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") theta += event.key === "ArrowLeft" ? 0.16 : -0.16;
    else if (["+", "=", "-"].includes(event.key)) zoom = THREE.MathUtils.clamp(zoom * (event.key === "-" ? 0.85 : 1.18), 0.55, 4);
    else return;
    event.preventDefault();
    render();
  });
  const observer = new ResizeObserver(render);
  observer.observe(element);
  return {
    update,
    setMode(value) { mode = value; if (model) update(model); },
    focusRoom(id) { const room = model?.rooms.find((room) => room.id === id); if (model) focus(room ? { rooms: [room], walls: [] } : model); },
    setMeasuring(value) { measuring = value; measurements = []; mark(); },
    highlight(id, point, itemIds) {
      focusedItem = id;
      issue = point ? { point, itemIds } : null;
      if (point) {
        const [x, z] = point;
        const extent = 2.15;
        focus({ rooms: [{ polygon: [[x - extent, z - extent], [x + extent, z - extent], [x + extent, z + extent], [x - extent, z + extent]] }], walls: [] });
      }
      mark();
    },
    dispose() { observer.disconnect(); cancelAnimationFrame(frame); disposeGroup(layout); disposeGroup(annotations); renderer.dispose(); canvas.remove(); },
  };
}
