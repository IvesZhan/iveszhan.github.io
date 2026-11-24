import * as THREE from "./vendor/three.module.min.js";
import { containsPoint } from "./scene.js";

const publicRoom = /客厅|客餐|餐厅|living|lounge|dining/i;

function clearRuns(scene, ceiling) {
  const rooms = scene.rooms.filter((room) => !room.excludeFromRoutes && publicRoom.test(`${room.name} ${room.id}`));
  const runs = [];
  for (const wall of scene.walls) {
    const [x, z] = wall.start;
    const [dx, dz] = [wall.end[0] - x, wall.end[1] - z];
    const length = Math.hypot(dx, dz);
    if (length < 0.65 || wall.heightM < ceiling - 0.12) continue;
    const ux = dx / length;
    const uz = dz / length;
    const cuts = scene.openings.filter((opening) => opening.wallId === wall.id && !opening.excludedReason &&
      opening.sillM + opening.heightM >= ceiling - 0.15)
      .map((opening) => opening.segment.map(([px, pz]) => (px - x) * ux + (pz - z) * uz).sort((a, b) => a - b))
      .sort((a, b) => a[0] - b[0]);
    const spaces = [];
    let start = 0;
    for (const [from, to] of cuts) {
      if (from > start) spaces.push([start, from - 0.05]);
      start = Math.max(start, to + 0.05);
    }
    if (start < length) spaces.push([start, length]);

    for (const sign of [-1, 1]) {
      const nx = -uz * sign;
      const nz = ux * sign;
      const inset = wall.thicknessM / 2 + 0.003;
      for (const [from, to] of spaces) {
        if (to - from < 0.62) continue;
        const inRoom = (value) => rooms.some((room) =>
          containsPoint([x + ux * value + nx * (inset + 0.37), z + uz * value + nz * (inset + 0.37)], room.polygon));
        if (![from + 0.24, (from + to) / 2, to - 0.24].every(inRoom)) continue;
        const ends = [from, to].map((value) => [x + ux * value + nx * inset, z + uz * value + nz * inset]);
        if (sign < 0) ends.reverse();
        runs.push({ ends, angle: Math.atan2(dz, dx) + (sign < 0 ? Math.PI : 0) });
      }
    }
  }
  return runs;
}

function joinedRuns(runs) {
  const result = [];
  for (const run of runs) {
    let [[ax, az], [bx, bz]] = run.ends;
    for (let i = result.length - 1; i >= 0; i -= 1) {
      const previous = result[i];
      if (Math.abs(Math.sin((run.angle - previous.angle) / 2)) > 0.004) continue;
      const [[px, pz], [qx, qz]] = previous.ends;
      if (Math.hypot(ax - qx, az - qz) < 0.018) {
        [ax, az] = [px, pz];
      } else if (Math.hypot(bx - px, bz - pz) < 0.018) {
        [bx, bz] = [qx, qz];
      } else continue;
      result.splice(i, 1);
    }
    result.push({ ends: [[ax, az], [bx, bz]], angle: run.angle });
  }
  return result;
}

export function createCreamCeilingGlow() {
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    const across = y / (size - 1);
    for (let x = 0; x < size; x += 1) {
      const along = Math.min(x, size - 1 - x);
      const ends = THREE.MathUtils.smoothstep(along, 0, 4);
      const fade = Math.pow(Math.sin(Math.PI * Math.pow(across, 0.53)), 2.6);
      pixels.set([255, 255, 255, Math.round(255 * fade * ends)], (y * size + x) * 4);
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function addCreamCeiling(group, scene, ceiling, appearance, glow) {
  if (ceiling < 2.49) return;
  const finish = new THREE.MeshStandardMaterial({ color: appearance.ceiling, roughness: 0.94 });
  const diffuser = new THREE.MeshStandardMaterial({
    color: 0xffefdc, roughness: 0.8, emissive: 0xffc294, emissiveIntensity: 0.65,
  });
  const bounced = new THREE.MeshBasicMaterial({ color: 0xffc79c, map: glow, transparent: true, opacity: 0.47, depthWrite: false });
  const runs = joinedRuns(clearRuns(scene, ceiling));
  for (const { ends: [[ax, az], [bx, bz]], angle } of runs) {
    const width = Math.hypot(bx - ax, bz - az) - 0.038;
    const root = new THREE.Group();
    root.position.set((ax + bx) / 2, ceiling, (az + bz) / 2);
    root.rotation.y = -angle;
    group.add(root);
    const profile = new THREE.Shape().moveTo(0, 0).lineTo(0.088, 0).lineTo(0.088, -0.082)
      .lineTo(0.245, -0.082).lineTo(0.245, -0.133).lineTo(0, -0.133).closePath();
    const extrusion = new THREE.ExtrudeGeometry(profile, { depth: width, bevelEnabled: false });
    extrusion.translate(0, 0, -width / 2);
    extrusion.rotateY(-Math.PI / 2);
    const trim = new THREE.Mesh(extrusion, finish);
    trim.castShadow = trim.receiveShadow = true;
    root.add(trim);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(width - 0.02, 0.006, 0.022), diffuser);
    strip.position.set(0, -0.078, 0.209);
    root.add(strip);
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.08, 0.58), bounced);
    wash.rotation.x = Math.PI / 2;
    wash.position.set(0, -0.003, 0.408);
    root.add(wash);
  }
  if (!runs.length) {
    finish.dispose();
    diffuser.dispose();
    bounced.dispose();
  }
}
