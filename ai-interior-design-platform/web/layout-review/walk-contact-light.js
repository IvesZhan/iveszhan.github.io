import * as THREE from "./vendor/three.module.min.js";
import { containsPoint, isDiningTable } from "./scene.js";

const sofaType = /沙发|couch|sofa/i;
const coffeeType = /茶几|coffee[-_ ]?table/i;
const chairType = /餐椅|dining[-_ ]?chair/i;
const sideboardType = /餐边柜|sideboard/i;

function pointAt(item, x, z, angle = item.rotationRad) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [item.center[0] + x * c - z * s, item.center[1] + x * s + z * c];
}

function rugSurface(room, sofa, coffee) {
  if (!sofa || !coffee) return null;
  const narrow = Math.min(sofa.widthM, sofa.depthM);
  const factor = Math.min(1, narrow / 0.85);
  const across = Math.min(3.45, Math.max(sofa.widthM, sofa.depthM) + 0.46) * factor;
  const between = (Math.hypot(sofa.center[0] - coffee.center[0], sofa.center[1] - coffee.center[1]) + 1.15) * factor;
  const [width, depth] = sofa.widthM >= sofa.depthM ? [across, between] : [between, across];
  const center = sofa.center.map((value, axis) => value * 0.36 + coffee.center[axis] * 0.64);
  const rug = { center, rotationRad: sofa.rotationRad };
  const fits = [-1, 1].every((x) => [-1, 1].every((z) =>
    containsPoint(pointAt(rug, x * width / 2, z * depth / 2), room.polygon)));
  if (!fits) return null;
  const c = Math.cos(rug.rotationRad);
  const s = Math.sin(rug.rotationRad);
  return ([x, z], margin) => {
    const dx = x - center[0];
    const dz = z - center[1];
    return Math.abs(dx * c + dz * s) < width / 2 - margin &&
      Math.abs(-dx * s + dz * c) < depth / 2 - margin;
  };
}

function contactTexture(round) {
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let row = 0; row < size; row += 1) {
    const z = Math.abs(2 * (row + 0.5) / size - 1);
    for (let column = 0; column < size; column += 1) {
      const x = Math.abs(2 * (column + 0.5) / size - 1);
      const distance = round ? Math.hypot(x, z) : 0.65 + Math.hypot(Math.max(0, x - 0.65), Math.max(0, z - 0.65));
      const alpha = 1 - THREE.MathUtils.smoothstep(distance, round ? 0.22 : 0.65, 0.98);
      pixels.set([255, 255, 255, Math.round(255 * alpha * alpha)], (row * size + column) * 4);
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createWalkContacts({ detailed = false } = {}) {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const rectangular = contactTexture(false);
  const radial = contactTexture(true);
  const material = (map, opacity) => new THREE.MeshBasicMaterial({
    color: 0x392819, map, opacity, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1,
  });
  const heavy = material(rectangular, 0.30);
  const light = material(radial, 0.20);
  const base = detailed ? material(rectangular, 0.23) : null;
  const support = detailed ? material(radial, 0.40) : null;

  function add(item, width, depth, finish, { x = 0, z = 0, angle = item.rotationRad, rug } = {}) {
    const shadow = new THREE.Mesh(geometry, finish);
    const point = pointAt(item, x, z, angle);
    const height = detailed ? (rug?.(point, Math.max(width, depth) * 0.40) ? 0.0185 : 0.0025) : 0.015;
    shadow.position.set(point[0], height, point[1]);
    shadow.rotation.set(-Math.PI / 2, 0, -angle);
    shadow.scale.set(width, depth, 1);
    group.add(shadow);
  }

  function addChair(item, tables) {
    const { widthM, depthM, rotationRad } = item;
    const nearby = tables.map((table) => [table.center[0] - item.center[0], table.center[1] - item.center[1]])
      .sort((a, b) => Math.hypot(...a) - Math.hypot(...b))[0];
    const facing = nearby && Math.abs(widthM / depthM - 1) <= 0.05 && Math.hypot(...nearby) <= 1.8;
    const yaw = facing ? Math.atan2(...nearby) + rotationRad : 0;
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    // The cream chair has splayed rear legs. Scale its glides like the rotated asset envelope.
    const scaleX = widthM / (0.502 * Math.abs(c) + 0.58 * Math.abs(s));
    const scaleZ = depthM / (0.58 * Math.abs(c) + 0.502 * Math.abs(s));
    for (const sign of [-1, 1]) {
      for (const [across, along] of [[0.231, 0.268], [0.217, -0.220]]) {
        const x = across * sign;
        add(item, 0.14, 0.14, support, { x: (x * c + along * s) * scaleX, z: (along * c - x * s) * scaleZ });
      }
    }
  }

  function addDetailed(item, tableItems, rug) {
    const { id, name, widthM, depthM, heightM, rotationRad } = item;
    const label = `${id} ${name}`;
    const narrow = Math.min(widthM, depthM);
    const length = Math.max(widthM, depthM);
    if (sofaType.test(label)) {
      const angle = rotationRad - (depthM > widthM ? Math.PI / 2 : 0);
      // The broad occlusion sits below the rug. Local contact follows the six inset feet.
      add(item, length * 0.98, narrow * 0.82, base, { angle });
      for (const [x, z] of [[-0.27, 0.31], [-0.38, 0.01], [0, 0.09], [0, -0.30], [0.27, 0.31], [0.38, 0.01]]) {
        add(item, 0.24, 0.19, support, { x: x * length, z: z * narrow, angle, rug });
      }
    } else if (coffeeType.test(label) && length >= 0.73 && narrow >= 0.39 && heightM >= 0.18) {
      const angle = rotationRad - (widthM > depthM ? Math.PI / 2 : 0);
      const large = Math.min(narrow * 0.96, length * 0.65);
      const small = Math.min(narrow * 0.72, length * 0.37);
      for (const [diameter, x, z] of [[large, -narrow * 0.012, (large - length) / 2], [small, narrow * 0.115, (length - small) / 2]]) {
        const spread = diameter * 0.66 + 0.15;
        add(item, spread, spread, support, { x, z, angle, rug });
      }
    } else if (chairType.test(label)) {
      addChair(item, tableItems);
    } else if (isDiningTable(item) || coffeeType.test(label)) {
      if (item.shape !== "rectangular" && length / narrow <= 1.2 && heightM >= 0.42) {
        add(item, widthM * 0.40 + 0.20, depthM * 0.40 + 0.20, support);
      } else {
        const leg = Math.min(0.05, widthM * 0.14, depthM * 0.14);
        for (const u of [-1, 1]) for (const v of [-1, 1]) {
          add(item, 0.15, 0.15, support, { x: u * (widthM / 2 - leg), z: v * (depthM / 2 - leg), rug });
        }
      }
    } else if (sideboardType.test(label)) {
      add(item, widthM + 0.10, depthM + 0.08, base);
    }
  }

  return {
    group,
    update(scene, roomIds) {
      group.clear();
      if (detailed) {
        for (const room of scene.rooms.filter(({ id }) => roomIds.includes(id))) {
          const items = scene.items.filter((item) => item.bottomM <= 0.04 && item.roomId === room.id);
          const tables = items.filter(isDiningTable);
          const rug = rugSurface(room, items.find(({ name }) => sofaType.test(name)), items.find(({ name }) => coffeeType.test(name)));
          for (const item of items) addDetailed(item, tables, rug);
        }
        return;
      }
      for (const item of scene.items) {
        if (item.bottomM > 0.04 || !roomIds.includes(item.roomId)) continue;
        const { widthM, depthM } = item;
        if (/沙发|couch|sofa|餐边柜|sideboard/i.test(item.name)) {
          add(item, widthM + 0.22, depthM + 0.25, heavy);
        } else if (/餐桌|茶几|coffee|dining.*table/i.test(item.name) && !/椅|glass/i.test(item.name)) {
          add(item, widthM * 0.78, depthM * 0.82, light);
        }
      }
    },
    dispose() {
      group.clear();
      geometry.dispose();
      heavy.dispose();
      light.dispose();
      base?.dispose();
      support?.dispose();
      rectangular.dispose();
      radial.dispose();
    },
  };
}
