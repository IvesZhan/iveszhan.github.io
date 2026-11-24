import * as THREE from "./vendor/three.module.min.js";

const tau = Math.PI * 2;
const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);
const smooth = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function randomAt(x, y, seed) {
  let number = Math.imul(x + seed * 13, 1597334677) ^ Math.imul(y - seed * 71, 3812015801);
  number = Math.imul(number ^ (number >>> 16), 2246822507);
  return ((number ^ (number >>> 13)) >>> 0) / 4294967295;
}

function noise(x, y, seed) {
  const column = Math.floor(x);
  const row = Math.floor(y);
  const u = smooth(x - column);
  const v = smooth(y - row);
  const top = THREE.MathUtils.lerp(randomAt(column, row, seed), randomAt(column + 1, row, seed), u);
  const bottom = THREE.MathUtils.lerp(randomAt(column, row + 1, seed), randomAt(column + 1, row + 1, seed), u);
  return THREE.MathUtils.lerp(top, bottom, v);
}

function texture(pixels, width, height, colorSpace) {
  const result = new THREE.DataTexture(pixels, width, height);
  result.colorSpace = colorSpace;
  result.minFilter = THREE.LinearMipmapLinearFilter;
  result.magFilter = THREE.LinearFilter;
  result.generateMipmaps = true;
  result.anisotropy = 4;
  result.needsUpdate = true;
  return result;
}

function textile() {
  const size = 96;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const fiber = Math.sin(x * Math.PI / 2) * 6 + Math.cos(y * Math.PI / 3) * 3;
      const uneven = (randomAt(x, y, 6) - 0.5) * 14;
      const slub = noise(x / 7, y / 17, 8) * 10;
      const gray = Math.round(228 + fiber + uneven + slub);
      pixels.set([gray, gray, gray, 255], (y * size + x) * 4);
    }
  }
  const cloth = texture(pixels, size, size, THREE.SRGBColorSpace);
  cloth.wrapS = cloth.wrapT = THREE.RepeatWrapping;
  return cloth;
}

function hangingPanel(parent, material, { from, to, length, top, depth, folds, amplitude, seed, sign, gathered }) {
  const width = to - from;
  const geometry = new THREE.PlaneGeometry(width, length, Math.max(24, Math.ceil(folds * 10)), 32);
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const center = (from + to) / 2;
  for (let i = 0; i < position.count; i += 1) {
    const u = position.getX(i) / width + 0.5;
    const down = 0.5 - position.getY(i) / length;
    const wander = 0.27 * Math.sin(u * 12 + seed) + 0.17 * Math.sin(u * 27 - down * 3) + 0.18 * down * Math.sin(u * 7 + seed);
    const phase = u * folds * tau + wander;
    const fold = Math.sin(phase) + 0.16 * Math.sin(phase * 2 + 0.8) + 0.08 * Math.cos(phase * 3);
    const tail = Math.pow(down, 4);
    const spread = 1 - gathered * 0.11 * (1 - down) + 0.012 * Math.sin(down * Math.PI);
    const vertical = top - down * length + tail * (0.007 * Math.sin(phase) + 0.008 * Math.sin(u * 12 + seed));
    const pleatDepth = depth + amplitude * (fold * (0.76 + 0.30 * down) + tail * Math.sin(u * 10 + seed) * 0.17);
    position.setXYZ(i, center + (u - 0.5) * width * spread, vertical, sign * pleatDepth);
    uv.setXY(i, (u * width + 0.003 * Math.sin(phase)) / 0.11, 0.5 + (1 - down) * length / 0.13);
  }
  geometry.computeVertexNormals();
  const drape = new THREE.Mesh(geometry, material);
  drape.receiveShadow = true;
  parent.add(drape);
}

function makeWindow(parent, detail, ceiling, weave) {
  const { opening, room, wall, span, center, inward, angle } = detail;
  if (!/厅|卧|儿童|bed|living|dining/i.test(`${room.name} ${room.id}`) || span < 0.8) return false;
  const top = Math.min(ceiling - 0.08, opening.sillM + opening.heightM + 0.15);
  const full = span > 1.85 && opening.sillM < 0.56;
  const length = top - (full ? 0.03 : Math.max(0.12, opening.sillM - 0.16));
  if (length <= 0.3) return false;
  const node = new THREE.Group();
  const wallFace = wall.thicknessM / 2 + 0.018;
  node.position.set(center[0] + inward[0] * wallFace, 0, center[1] + inward[1] * wallFace);
  node.rotation.y = -angle;
  parent.add(node);
  const sign = Math.sign(-Math.sin(angle) * inward[0] + Math.cos(angle) * inward[1]) || 1;
  const casing = new THREE.Mesh(
    new THREE.BoxGeometry(span - 0.014, 0.027, full ? 0.14 : 0.08),
    new THREE.MeshStandardMaterial({ color: 0xe5dac9, roughness: 0.94 }),
  );
  casing.position.set(0, top + 0.012, sign * (full ? 0.060 : 0.035));
  node.add(casing);

  const sheer = new THREE.MeshStandardMaterial({
    color: 0xf4eee2, map: weave, side: THREE.DoubleSide, transparent: true, opacity: full ? 0.60 : 0.73,
    depthWrite: false, roughness: 0.97, emissive: 0xf6e8cd, emissiveIntensity: 0.31,
  });
  hangingPanel(node, sheer, {
    from: -span / 2 + 0.012, to: span / 2 - 0.012, length, top, depth: 0.034, folds: Math.max(4, span / 0.205),
    amplitude: full ? 0.013 : 0.009, seed: 1.7, sign, gathered: 0.12,
  });
  if (full) {
    const linen = new THREE.MeshPhysicalMaterial({
      color: 0xc8b79c, map: weave, bumpMap: weave, bumpScale: 0.00065, side: THREE.DoubleSide,
      roughness: 0.92, sheen: 0.34, sheenColor: 0xc5ae8d, sheenRoughness: 0.79,
    });
    const edge = span / 2 - 0.023;
    const width = Math.min(0.57, span * 0.167);
    for (const side of [-1, 1]) {
      const limits = [side * edge, side * (edge - width)].sort((a, b) => a - b);
      hangingPanel(node, linen, {
        from: limits[0], to: limits[1], top, length, depth: 0.104, folds: 4.15, amplitude: 0.024,
        seed: side * 1.6, sign, gathered: 0.70,
      });
    }
  }
  return true;
}

function plasterStudy(dining) {
  const width = dining ? 480 : 352;
  const height = dining ? 304 : 480;
  const colors = new Uint8Array(width * height * 4);
  const heights = new Uint8Array(width * height * 4);
  const seed = dining ? 19 : 42;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);
      const cloud = noise(u * 3.3, v * 4.8, seed);
      const mottling = noise(u * 15, v * 20, seed + 1);
      const trowel = noise(u * 8 + v * 6, v * 62, seed + 2);
      const grain = randomAt(x, y, seed) - 0.5;
      const bed = v + 0.067 * Math.sin(u * 4.8 + (dining ? 1.6 : 0.35)) + (mottling - 0.5) * 0.019;
      const mineralBand = smooth((bed - 0.46) * 7) - smooth((bed - 0.77) * 8);
      const lip = Math.exp(-Math.pow((bed - 0.395 - 0.013 * noise(u * 14, 1, seed)) * 43, 2));
      const drag = noise(u * 28 + v * 8, v * 116, seed + 3);
      const marks = 20 * cloud + 11 * mottling + 10 * trowel + 9 * drag + 6 * grain;
      const warm = mineralBand * 24 + (1 - v) * 13;
      const red = 207 + marks - 0.64 * warm + 8 * lip;
      const green = 195 + marks - warm + 10 * lip;
      const blue = 175 + marks - 1.16 * warm + 11 * lip;
      const raised = Math.round(68 + 58 * cloud + 29 * mottling + 28 * trowel + 22 * drag + 34 * lip + 12 * grain);
      const i = (y * width + x) * 4;
      colors.set([Math.min(255, red), Math.min(255, green), Math.min(255, blue), 255], i);
      heights.set([raised, raised, raised, 255], i);
    }
  }
  return {
    color: texture(colors, width, height, THREE.SRGBColorSpace),
    relief: texture(heights, width, height, THREE.NoColorSpace),
  };
}

function mountArtwork(parent, pose, width, middle, design, maps) {
  const height = width * (design === "dining" ? 0.64 : 1.28);
  const clip = Math.min(0.018, width * 0.023);
  const group = new THREE.Group();
  group.position.set(pose.point[0], middle, pose.point[1]);
  group.rotation.y = -pose.angle;
  parent.add(group);

  const border = new THREE.Shape().moveTo(-width / 2, -height / 2);
  border.lineTo(width / 2, -height / 2).lineTo(width / 2, height / 2).lineTo(-width / 2, height / 2).closePath();
  const innerX = width / 2 - clip;
  const innerY = height / 2 - clip;
  border.holes.push(new THREE.Path().moveTo(-innerX, -innerY).lineTo(-innerX, innerY)
    .lineTo(innerX, innerY).lineTo(innerX, -innerY).closePath());
  const frame = new THREE.Mesh(
    new THREE.ExtrudeGeometry(border, { depth: 0.029, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: 0xaa8c6d, roughness: 0.78 }),
  );
  frame.position.z = 0.006;
  frame.castShadow = frame.receiveShadow = true;
  group.add(frame);
  const canvas = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 2 * clip + 0.004, height - 2 * clip + 0.004),
    new THREE.MeshStandardMaterial({ map: maps.color, bumpMap: maps.relief, bumpScale: 0.013, roughness: 0.96 }),
  );
  canvas.position.z = 0.024;
  canvas.receiveShadow = true;
  group.add(canvas);
}

export function createCreamDetails() {
  let weave;
  const studies = new Map();
  return {
    addWindow(group, descriptor, ceiling) {
      weave ??= textile();
      return makeWindow(group, descriptor, ceiling, weave);
    },
    addArtwork(group, pose, width, middle, design) {
      if (!studies.has(design)) studies.set(design, plasterStudy(design === "dining"));
      mountArtwork(group, pose, width, middle, design, studies.get(design));
    },
    dispose() {
      weave?.dispose();
      for (const { color, relief } of studies.values()) {
        color.dispose();
        relief.dispose();
      }
      studies.clear();
    },
  };
}
