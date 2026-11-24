import * as THREE from "./vendor/three.module.min.js";
import { mergeGeometries } from "./vendor/addons/utils/BufferGeometryUtils.js";
import { containsPoint, isDiningTable } from "./scene.js";
import { addCreamBedroom } from "./walk-cream-bedroom.js";
import { addCreamCeiling, createCreamCeilingGlow } from "./walk-cream-ceiling.js";
import { makeCreamMillwork } from "./walk-cream-millwork.js?v=cream-v6-3";
import { createCreamDetails } from "./walk-cream-details.js";

export function surfaceMaterial({ color, map = null, roughnessMap = null, normalMap = null, normalScale,
  bumpMap = null, bumpScale = 1, roughness }, properties = {}) {
  const finish = new THREE.MeshStandardMaterial({ color, map, roughnessMap, normalMap, bumpMap, bumpScale, roughness, ...properties });
  if (normalScale) finish.normalScale.copy(normalScale);
  return finish;
}

export function applyBoxFinish(mesh, finish, width, height, depth, along = 0, bottom = 0, sides = []) {
  const uv = mesh.geometry.getAttribute("uv");
  const sizes = [[depth, height], [depth, height], [width, depth], [width, depth], [width, height], [width, height]];
  for (const [side, [u, v]] of sizes.entries()) {
    const [uPeriod, vPeriod] = (sides[side - 4] || finish).repeatM;
    const vertical = side !== 2 && side !== 3;
    for (let index = side * 4; index < side * 4 + 4; index += 1) {
      uv.setXY(index, (uv.getX(index) * u + (side >= 4 ? along : 0)) / uPeriod,
        (uv.getY(index) * v + (vertical ? bottom : 0)) / vPeriod);
    }
  }
  mesh.material.dispose();
  const base = surfaceMaterial(finish);
  mesh.material = sides.some((surface) => surface && surface !== finish)
    ? [base, base, base, base, ...sides.map((surface) => surface && surface !== finish ? surfaceMaterial(surface) : base)]
    : base;
}

function solid(group, geometry, material, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = !material.transparent;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function material(color, roughness = 0.85, properties = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, ...properties });
}

function panel(group, x, y, z, width, height, depth, finish) {
  return solid(group, new THREE.BoxGeometry(width, height, depth), finish, x, y, z);
}

export function makeWalkMillwork(parent, item, room, appearance) {
  if (appearance.cream) {
    const detailed = makeCreamMillwork(parent, item, room, appearance);
    if (detailed.length) return detailed;
  }
  const { name, widthM, depthM, heightM: height, bottomM } = item;
  if (!/柜|\bcabinet\b|\bwardrobe\b|\bsideboard\b/i.test(name) || height < 0.21) return [];
  const length = Math.max(widthM, depthM);
  const depth = Math.min(widthM, depthM);
  if (length < 0.5 || depth < 0.18) return [];
  const unit = new THREE.Group();
  const across = depthM > widthM;
  unit.rotation.y = across ? -Math.PI / 2 : 0;
  parent.add(unit);
  const angle = item.rotationRad + (across ? Math.PI / 2 : 0);
  const centroid = room?.polygon.reduce(([x, z], p) => [x + p[0] / room.polygon.length, z + p[1] / room.polygon.length], [0, 0]);
  const front = !centroid || (centroid[0] - item.center[0]) * -Math.sin(angle) + (centroid[1] - item.center[1]) * Math.cos(angle) >= 0 ? 1 : -1;
  const worktop = /餐边柜|橱柜|电视柜|台盆柜|sideboard|tv.?console/i.test(name) && height < 1.3 ? Math.min(0.035, height * 0.11) : 0;
  const plinth = height > 0.53 && bottomM < 0.09 ? 0.07 : 0;
  const exposed = height - plinth - worktop;
  const doorThickness = 0.019;
  const boxDepth = depth - doorThickness - 0.004;
  const kitchen = /橱柜|厨房吊柜|kitchen/i.test(name);
  const floatingTv = /悬空电视柜|tv.?console/i.test(name) && bottomM > 0.05;
  const painted = /衣柜|玄关|吊柜|台盆柜|wardrobe/i.test(name) || (appearance.cream && (kitchen || floatingTv));
  const baseColor = painted ? (appearance.cream ? 0xe0d0bc : 0xd5cbbd) : 0xbea58a;
  const parts = [];

  function part(width, tall, thick, color, x, y, z, finish, grainX = 0, grainY = 0) {
    const mesh = panel(unit, x, y, z, width, tall, thick, material(color));
    if (finish) applyBoxFinish(mesh, finish, width, tall, thick, grainX, grainY);
    mesh.userData = { id: item.id, color: mesh.material.color.getHex() };
    parts.push(mesh);
  }

  part(length - 0.006, exposed, boxDepth, baseColor, 0, plinth + exposed / 2, -front * (depth - boxDepth) / 2, painted ? null : appearance.wood);
  if (plinth) part(length - 0.076, plinth, depth - 0.095, 0x514536, 0, plinth / 2, -front * 0.021);
  if (worktop) part(length, worktop, depth, 0xe3d6c4, 0, height - worktop / 2, 0, appearance.stone);

  const doors = Math.max(1, Math.min(9, Math.round(length / (height > 1.4 ? 0.56 : 0.53))));
  const pitch = length / doors;
  const faceZ = front * ((depth - doorThickness) / 2 - 0.004);
  const shallowDrawers = exposed > 0.59 && exposed < 1.28 && /餐边|西侧橱|台盆/.test(name);
  const drawer = shallowDrawers ? Math.min(exposed * 0.3, 0.20) : 0;
  const lower = exposed - drawer;
  for (let index = 0; index < doors; index += 1) {
    const along = (index + 0.5 - doors / 2) * pitch;
    const grain = (index - doors / 2) * pitch;
    const finish = painted ? null : appearance.wood;
    part(pitch - 0.004, lower - 0.006, doorThickness, baseColor, along, plinth + lower / 2, faceZ, finish, grain, 0);
    if (drawer) part(pitch - 0.004, drawer - 0.006, doorThickness, baseColor, along, plinth + lower + drawer / 2, faceZ, finish, grain, lower);
    if (height > 1.9) {
      const pullX = along + (index % 2 ? -1 : 1) * Math.min(pitch * 0.31, pitch / 2 - 0.023);
      part(0.010, 0.24, 0.004, 0x77644e, pullX, Math.min(1.16, exposed * 0.52), front * (depth / 2 - 0.002));
    }
  }
  if (appearance.cream && bottomM > 0.05 && (floatingTv || /吊柜/.test(name))) {
    const diffuser = material(0xffe8c7, 0.73, { emissive: 0xffc682, emissiveIntensity: 0.72 });
    panel(unit, 0, 0.004, front * depth * 0.26, length - 0.08, 0.008, 0.014, diffuser);
    for (const direction of [-1, 1]) {
      const wash = new THREE.PointLight(0xffd4a5, 0.23, Math.min(1.2, bottomM + 0.6), 2);
      wash.position.set(direction * length * 0.25, -0.047, front * depth * 0.26);
      unit.add(wash);
    }
  }
  return parts;
}

export function makeCreamCoffeeTable(parent, item, appearance) {
  const { widthM: width, depthM: depth, heightM: height } = item;
  const length = Math.max(width, depth);
  const narrow = Math.min(width, depth);
  if (!/茶几|coffee.?table/i.test(item.name) || length < 0.73 || narrow < 0.39 || height < 0.18) return [];
  const root = new THREE.Group();
  root.rotation.y = width > depth ? Math.PI / 2 : 0;
  parent.add(root);
  const parts = [];
  const large = Math.min(narrow * 0.96, length * 0.65);
  const small = Math.min(narrow * 0.72, length * 0.37);
  const tables = [
    [large, height, (large - length) / 2, -narrow * 0.012],
    [small, height * 0.73, (length - small) / 2, narrow * 0.115],
  ];
  const stone = appearance.furnitureStone;
  const [stoneU, stoneV] = appearance.visualProfile === "cream-v6" ? stone.repeatM : [0.57, 0.69];
  for (const [diameter, tall, z, x] of tables) {
    const r = diameter / 2;
    const t = Math.min(0.052, tall * 0.24);
    const curves = [
      [[0, 0], [r * 0.61, 0], [r * 0.66, 0.013], [r * 0.64, tall - t], [0, tall - t]],
      [[0, tall - t], [r * 0.94, tall - t], [r, tall - t * 0.66], [r, tall - t * 0.21], [r * 0.97, tall], [0, tall]],
    ];
    for (const curve of curves) {
      const geometry = new THREE.LatheGeometry(curve.map(([horizontal, y]) => new THREE.Vector2(horizontal, y)), 56);
      const position = geometry.getAttribute("position");
      const normals = geometry.getAttribute("normal");
      const uv = geometry.getAttribute("uv");
      for (let index = 0; index < position.count; index += 1) {
        if (Math.abs(normals.getY(index)) > 0.55) {
          uv.setXY(index, position.getX(index) / stoneU + 0.5, position.getZ(index) / stoneU + 0.5);
        } else {
          uv.setXY(index, uv.getX(index) * Math.PI * diameter / stoneV, position.getY(index) / stoneV);
        }
      }
      const mesh = solid(root, geometry, surfaceMaterial(stone), x, 0, z);
      mesh.userData = { id: item.id, color: mesh.material.color.getHex() };
      parts.push(mesh);
    }
  }
  return parts;
}

function kitchenBacksplash(group, scene, room, items, appearance) {
  const top = items.find((item) => /厨房吊柜|kitchen.?upper/i.test(item.name));
  if (!top) return;
  const angle = top.rotationRad + (top.widthM >= top.depthM ? 0 : Math.PI / 2);
  const [ux, uz] = [Math.cos(angle), Math.sin(angle)];
  const [x, z] = top.center;
  const base = items.filter((item) => /橱柜|kitchen.?base/i.test(item.name) && item.heightM < 1.2 &&
    Math.abs((item.center[0] - x) * ux + (item.center[1] - z) * uz) < 0.22)
    .sort((a, b) => Math.hypot(a.center[0] - x, a.center[1] - z) - Math.hypot(b.center[0] - x, b.center[1] - z))[0];
  if (!base) return;
  const sameDirection = Math.abs(Math.sin(angle - base.rotationRad - (base.widthM >= base.depthM ? 0 : Math.PI / 2))) < 0.10;
  const lower = base.heightM + base.bottomM;
  const height = top.bottomM - lower;
  if (!sameDirection || height < 0.26 || height > 0.86) return;
  const width = Math.min(Math.max(top.widthM, top.depthM), Math.max(base.widthM, base.depthM) - 0.11);
  const depth = Math.min(base.widthM, base.depthM);
  const [bx, bz] = base.center;
  const center = room.polygon.reduce(([cx, cz], [px, pz]) => [cx + px / room.polygon.length, cz + pz / room.polygon.length], [0, 0]);
  const front = Math.sign((center[0] - bx) * -uz + (center[1] - bz) * ux) || 1;
  const back = (depth / 2 - 0.008) * front;
  const px = bx + uz * back;
  const pz = bz - ux * back;
  const crossesOpening = scene.openings.some((opening) => opening.roomIds.includes(room.id) && !opening.excludedReason &&
    opening.sillM < top.bottomM && opening.sillM + opening.heightM > lower && opening.segment.some(([ox, oz]) =>
      Math.abs((ox - px) * -uz + (oz - pz) * ux) < 0.18 && Math.abs((ox - px) * ux + (oz - pz) * uz) < width / 2));
  if (crossesOpening) return;
  const slab = panel(group, px, lower + height / 2, pz, width, height, 0.016, material(0xd9c6ae));
  slab.rotation.y = -angle;
  applyBoxFinish(slab, appearance.furnitureStone, width, height, 0.016);
}

export function makeWalkRoundTable(parent, item, appearance) {
  const { widthM: width, depthM: depth, heightM: height } = item;
  if (!isDiningTable(item) || item.shape === "rectangular" ||
      Math.max(width, depth) / Math.min(width, depth) > 1.2 || height < 0.42) return [];
  const radius = width / 2;
  const top = Math.min(0.045, height * 0.07);
  const leg = height - top + 0.001;
  const grown = radius * 0.40;
  const woodProfile = [[0, 0], [grown * 0.94, 0], [grown, 0.018], [grown * 0.94, leg * 0.12], [grown * 0.81, leg * 0.63],
    [grown * 0.85, leg * 0.91], [grown * 0.98, leg], [0, leg]];
  const topProfile = [[0, 0], [radius - 0.01, 0], [radius - 0.004, 0.006], [radius, 0.015],
    [radius, top - 0.008], [radius - 0.008, top], [0, top]];
  const parts = [];

  for (const [profile, finish, baseY, grooves] of [[woodProfile, appearance.wood, 0, 28], [topProfile, appearance.stone, height - top, 0]]) {
    const geometry = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 140);
    const position = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index);
      const z = position.getZ(index);
      const y = position.getY(index);
      if (grooves) {
        const angle = Math.atan2(x, z);
        const fade = Math.min(1, Math.max(0, (y - 0.018) / 0.035), Math.max(0, (leg - y) / 0.035));
        const pleat = 1 - (1 + Math.cos(angle * grooves)) * 0.012 * fade;
        position.setXYZ(index, x * pleat, y, z * pleat);
        uv.setXY(index, uv.getX(index) * (2 * Math.PI * grown) / finish.repeatM[0], y / finish.repeatM[1]);
      } else {
        uv.setXY(index, (x + radius) / finish.repeatM[0], (z + radius) / finish.repeatM[1]);
      }
    }
    geometry.computeVertexNormals();
    const mesh = solid(parent, geometry, surfaceMaterial(finish), 0, baseY, 0);
    mesh.scale.z = depth / width;
    mesh.userData = { id: item.id, color: mesh.material.color.getHex() };
    parts.push(mesh);
  }
  return parts;
}

function curtain(parent, { opening, room, wall, span, center, inward, angle }, ceiling, cream) {
  if (!/厅|卧|儿童|bed|living|dining/i.test(room.name + room.id) || span < 0.8) return;
  const node = new THREE.Group();
  const inset = wall.thicknessM / 2 + 0.039;
  node.position.set(center[0] + inward[0] * inset, 0, center[1] + inward[1] * inset);
  node.rotation.y = -angle;
  parent.add(node);
  const innerSign = new THREE.Vector2(-Math.sin(angle), Math.cos(angle)).dot(new THREE.Vector2(...inward));
  const top = Math.min(ceiling - 0.065, opening.sillM + opening.heightM + 0.16);
  const hem = opening.sillM < 0.5 ? 0.024 : Math.max(0.12, opening.sillM - 0.14);
  const height = top - hem;
  if (height <= 0.3) return;
  const sideWidth = Math.min(0.54, Math.max(0.13, span * 0.146));
  const casing = material(0xebe6df);
  panel(node, 0, top + 0.021, innerSign * 0.025, span - 0.024, 0.057, 0.15, casing);
  const living = /客厅|living/i.test(room.name + room.id);
  const linen = material(cream ? 0xc5b19b : living ? 0xb2a794 : 0xc5b9a7, 0.98, {
    side: THREE.DoubleSide, emissive: 0x635a4d, emissiveIntensity: 0.09,
  });
  const voile = material(0xfff7e8, 0.97, {
    side: THREE.DoubleSide, transparent: true, opacity: cream ? 0.35 : 0.42, depthWrite: false, emissive: 0xccbcab, emissiveIntensity: 0.21,
  });

  function fabric(x, width, offset, folds, amplitude, cloth) {
    const geometry = new THREE.PlaneGeometry(width, height, folds * 8, 12);
    const position = geometry.getAttribute("position");
    for (let index = 0; index < position.count; index += 1) {
      const u = position.getX(index) / width + 0.5;
      const v = position.getY(index) / height + 0.5;
      const phase = u * Math.PI * 2 * folds + 0.27 * Math.sin(v * 3 + u * 7);
      const wave = amplitude * (Math.cos(phase) * 0.78 + Math.cos(phase * 2) * 0.22);
      position.setZ(index, innerSign * (wave * (1.12 - 0.22 * v) + 0.004 * Math.sin(u * 21 + v * 4)));
    }
    geometry.computeVertexNormals();
    const mesh = solid(node, geometry, cloth, x, (top + hem) / 2, innerSign * offset);
    mesh.castShadow = false;
  }
  const sheerWidth = cream ? span * 0.483 : Math.min(span * 0.23, sideWidth * 1.65);
  for (const side of [-1, 1]) {
    fabric(side * (span - sheerWidth - 0.022) / 2, sheerWidth, 0.016, Math.ceil(sheerWidth / 0.071), 0.013, voile);
    fabric(side * (span - sideWidth - 0.022) / 2, sideWidth, 0.078, 6, 0.028, linen);
  }
}

function diningLight(group, item, ceiling, cream) {
  const [x, z] = item.center;
  const lower = Math.min(ceiling - 0.29, Math.max(1.83, item.heightM + item.bottomM + 1.05));
  if (ceiling - lower < 0.26 || lower < 1.78) return;
  const metal = material(0x6d5840, 0.41, { metalness: 0.62 });
  const radius = Math.min(cream ? 0.30 : 0.36, Math.min(item.widthM, item.depthM) * (cream ? 0.272 : 0.31));
  solid(group, new THREE.CylinderGeometry(0.058, 0.058, 0.025, 32), metal, x, ceiling - 0.016, z);
  solid(group, new THREE.CylinderGeometry(0.004, 0.004, ceiling - lower - 0.2, 12), metal, x, (ceiling + lower + 0.2) / 2, z);
  const silhouette = (cream
    ? [[radius * 0.10, 0], [radius * 0.43, 0.017], [radius * 0.74, 0.038], [radius * 0.93, 0.076],
      [radius, 0.109], [radius * 0.93, 0.145], [radius * 0.71, 0.176], [radius * 0.38, 0.194], [0.026, 0.203]]
    : [[radius * 0.96, 0], [radius, 0.012], [radius * 0.94, 0.042], [radius * 0.78, 0.102],
      [radius * 0.54, 0.152], [radius * 0.29, 0.184], [0.026, 0.203]]).map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(silhouette, 144);
  const position = geometry.getAttribute("position");
  for (let index = 0; index < position.count; index += 1) {
    const angle = Math.atan2(position.getX(index), position.getZ(index));
    const fluted = 1 + (cream ? 0.010 : 0.022) * Math.cos(angle * 36);
    position.setX(index, position.getX(index) * fluted);
    position.setZ(index, position.getZ(index) * fluted);
  }
  geometry.computeVertexNormals();
  solid(group, geometry, material(cream ? 0xf3e5cf : 0xdac6a8, 0.88, {
    side: THREE.DoubleSide, emissive: cream ? 0xffd5a1 : 0x7e5533, emissiveIntensity: cream ? 0.18 : 0.15,
  }), x, lower, z);
  const diffuser = solid(group, new THREE.CircleGeometry(radius * (cream ? 0.11 : 0.86), 64), material(0xf6ead6, 0.87, {
    emissive: 0xffdbb5, emissiveIntensity: 0.28,
  }), x, lower + 0.013, z);
  diffuser.rotation.x = Math.PI / 2;
  const light = new THREE.SpotLight(0xffddb6, 5.2, 3.8, Math.PI / 3, 0.82, 2);
  light.position.set(x, lower - 0.045, z);
  light.target.position.set(x, item.bottomM + item.heightM, z);
  group.add(light);
  group.add(light.target);
}

function carpet(group, room, seat, table, rugMap, finish) {
  const factor = Math.min(1, Math.min(seat.widthM, seat.depthM) / 0.85);
  const [x, z] = seat.center.map((coordinate, index) => coordinate * 0.36 + table.center[index] * 0.64);
  const wide = seat.widthM >= seat.depthM;
  const alongSeat = Math.min(3.45, Math.max(seat.widthM, seat.depthM) + 0.46);
  const acrossSeat = Math.hypot(seat.center[0] - table.center[0], seat.center[1] - table.center[1]) + 1.15;
  const width = (wide ? alongSeat : acrossSeat) * factor;
  const depth = (wide ? acrossSeat : alongSeat) * factor;
  const cos = Math.cos(seat.rotationRad);
  const sin = Math.sin(seat.rotationRad);
  const corners = [-1, 1].flatMap((u) => [-1, 1].map((v) => [
    x + u * width / 2 * cos - v * depth / 2 * sin,
    z + u * width / 2 * sin + v * depth / 2 * cos,
  ]));
  if (!corners.every((point) => containsPoint(point, room.polygon))) return;
  const rug = new THREE.Group();
  rug.position.set(x, 0.007, z);
  rug.rotation.y = -seat.rotationRad;
  group.add(rug);
  if (finish) {
    const w = width / 2 - 0.004;
    const d = depth / 2 - 0.004;
    const r = 0.046;
    const outline = new THREE.Shape().moveTo(-w + r, -d).lineTo(w - r, -d)
      .quadraticCurveTo(w, -d, w, -d + r).lineTo(w, d - r)
      .quadraticCurveTo(w, d, w - r, d).lineTo(-w + r, d)
      .quadraticCurveTo(-w, d, -w, d - r).lineTo(-w, -d + r)
      .quadraticCurveTo(-w, -d, -w + r, -d);
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: 0.006, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2,
    });
    const uv = geometry.getAttribute("uv");
    const position = geometry.getAttribute("position");
    for (let index = 0; index < uv.count; index += 1) {
      uv.setXY(index, position.getX(index) / finish.repeatM[0], position.getY(index) / finish.repeatM[1]);
    }
    geometry.rotateX(-Math.PI / 2);
    const surface = new THREE.Mesh(geometry, [surfaceMaterial(finish), material(0xb19e87, 0.96)]);
    surface.receiveShadow = true;
    rug.add(surface);
    return;
  }
  const edge = material(0xcbbda7);
  const fabric = material(0xdfd3bd, 1, { map: rugMap, bumpMap: rugMap, bumpScale: 0.0014 });
  const base = panel(rug, 0, 0, 0, width, 0.012, depth, edge);
  const top = solid(rug, new THREE.PlaneGeometry(width - 0.028, depth - 0.028), fabric, 0, 0.0061, 0);
  top.rotation.x = -Math.PI / 2;
  const uv = top.geometry.getAttribute("uv");
  for (let index = 0; index < uv.count; index += 1) uv.setXY(index, uv.getX(index) * width * 2.1, uv.getY(index) * depth * 2.1);
  base.castShadow = top.castShadow = false;
}

function ceilingSpots(group, room, ceiling) {
  const [x, z] = room.polygon.reduce(([cx, cz], [px, pz]) =>
    [cx + px / room.polygon.length, cz + pz / room.polygon.length], [0, 0]);
  const finish = material(0xf9eddb, 0.8, { emissive: 0xffdab2, emissiveIntensity: 0.55 });
  for (const dz of [-0.48, 0.48]) {
    if (!containsPoint([x, z + dz], room.polygon)) continue;
    solid(group, new THREE.CylinderGeometry(0.034, 0.034, 0.009, 20), finish.clone(), x, ceiling - 0.005, z + dz);
  }
  finish.dispose();
}

function screen(group, scene, cabinet, room, appearance, ceiling) {
  const longX = cabinet.widthM >= cabinet.depthM;
  const length = Math.max(cabinet.widthM, cabinet.depthM);
  if (length < 1.15 || cabinet.bottomM + cabinet.heightM > 1.15) return;
  const angle = cabinet.rotationRad + (longX ? 0 : Math.PI / 2);
  const normal = [-Math.sin(angle), Math.cos(angle)];
  const [x, z] = cabinet.center;
  const [cx, cz] = room.polygon.reduce(([cx, cz], [px, pz]) => [cx + px / room.polygon.length, cz + pz / room.polygon.length], [0, 0]);
  const front = (cx - x) * normal[0] + (cz - z) * normal[1] >= 0 ? 1 : -1;
  const width = Math.min(1.74, length * 0.71);
  const depth = Math.min(cabinet.widthM, cabinet.depthM);
  const y = cabinet.bottomM + cabinet.heightM;
  let surroundWidth = appearance.cream ? Math.min(length, width * 1.42) : width * 1.18;
  let pose = decorWall(scene, room, cabinet, surroundWidth / 2);
  if (appearance.cream && !pose) {
    surroundWidth = width * 1.15;
    pose = decorWall(scene, room, cabinet, surroundWidth / 2);
  }
  if (pose) {
    const wall = new THREE.Group();
    wall.position.set(pose.point[0], 0, pose.point[1]);
    wall.rotation.y = -pose.angle;
    group.add(wall);
    const header = Math.min(ceiling - 0.18, y + width * 0.66 + 0.56);
    const base = Math.max(0.08, y - 0.16);
    const surround = panel(wall, 0, (header + base) / 2, 0.016, surroundWidth, header - base, 0.03, material(0xe1d5c3));
    applyBoxFinish(surround, appearance.stone, surroundWidth, header - base, 0.03);
    if (appearance.cream) surround.material.color.setHex(0xc8b49f);
    const bezel = material(0x272624, 0.36, { metalness: 0.32 });
    const display = material(0x252422, 0.24, { metalness: 0.31, envMapIntensity: appearance.cream ? 0.55 : 0.3 });
    const middle = y + width * 0.32 + 0.19;
    panel(wall, 0, middle, 0.055, width, width * 0.563, 0.026, bezel);
    panel(wall, 0, middle, 0.07, width - 0.021, width * 0.563 - 0.021, 0.005, display);
    return;
  }
  const node = new THREE.Group();
  node.rotation.y = -angle;
  node.position.set(x, y, z);
  group.add(node);
  const casing = material(0x242523, 0.42, { metalness: 0.22 });
  const glass = material(0x262a29, 0.22, { metalness: 0.36 });
  panel(node, 0, 0.04, 0, width * 0.42, 0.024, depth * 0.72, casing);
  panel(node, 0, 0.078, -front * depth * 0.15, 0.082, 0.08, 0.031, casing);
  panel(node, 0, width * 0.281 + 0.12, -front * depth * 0.15, width, width * 0.562, 0.035, casing);
  panel(node, 0, width * 0.281 + 0.12, -front * (depth * 0.15 - 0.018), width - 0.02, width * 0.562 - 0.02, 0.003, glass);
}

function decorWall(scene, room, item, halfWidth) {
  const [x, z] = item.center;
  const poses = [];
  for (const wall of scene.walls) {
    const [ax, az] = wall.start;
    const dx = wall.end[0] - ax;
    const dz = wall.end[1] - az;
    const length = Math.hypot(dx, dz);
    if (length < halfWidth * 2 + 0.2) continue;
    const u = dx / length;
    const v = dz / length;
    const along = (x - ax) * u + (z - az) * v;
    if (along < halfWidth + 0.1 || along > length - halfWidth - 0.1) continue;
    const distance = (x - ax) * -v + (z - az) * u;
    if (Math.abs(distance) > 0.88 || Math.abs(distance) < wall.thicknessM / 2) continue;
    const intersectsOpening = scene.openings.some((opening) => {
      if (opening.wallId !== wall.id || opening.excludedReason) return false;
      const [start, end] = opening.segment.map(([px, pz]) => (px - ax) * u + (pz - az) * v).sort((a, b) => a - b);
      return start < along + halfWidth + 0.08 && end > along - halfWidth - 0.08;
    });
    if (intersectsOpening) continue;
    const side = Math.sign(distance);
    const probe = wall.thicknessM / 2 + 0.12;
    if (!containsPoint([ax + along * u - v * probe * side, az + along * v + u * probe * side], room.polygon)) continue;
    const inset = wall.thicknessM / 2 + 0.008;
    poses.push({
      point: [ax + along * u - v * inset * side, az + along * v + u * inset * side],
      angle: Math.atan2(dz, dx) + (side === -1 ? Math.PI : 0), distance: Math.abs(distance),
    });
  }
  return poses.sort((a, b) => a.distance - b.distance)[0];
}

function wallMount(group, pose, height = 0) {
  const root = new THREE.Group();
  root.position.set(pose.point[0], height, pose.point[1]);
  root.rotation.y = -pose.angle;
  group.add(root);
  return root;
}

function oakSlatWall(group, pose, width, ceiling, finish) {
  const lower = 0.075;
  const height = ceiling - lower - 0.16;
  if (width < 1.3 || height < 1.8) return false;
  const root = wallMount(group, pose, lower + height / 2);
  panel(root, 0, 0, 0.0015, width, height, 0.003, material(0x665544));

  const count = Math.floor(width / 0.047);
  const pitch = width / count;
  const slatWidth = pitch * 0.75;
  const slatDepth = 0.008;
  const profile = new THREE.Mesh(new THREE.BoxGeometry(slatWidth, height, slatDepth), material(finish.color));
  applyBoxFinish(profile, finish, slatWidth, height, slatDepth);
  profile.material.color.multiply(new THREE.Color(0xf8ead7));

  const slats = Array.from({ length: count }, (_, index) => {
    const geometry = profile.geometry.clone();
    const uv = geometry.getAttribute("uv");
    const grainOffset = ((index * 19) % 37) / 37;
    for (let vertex = 0; vertex < uv.count; vertex += 1) uv.setX(vertex, uv.getX(vertex) + grainOffset);
    return geometry.translate((index + 0.5 - count / 2) * pitch, 0, 0.003 + slatDepth / 2);
  });
  const geometry = mergeGeometries(slats);
  for (const slat of slats) slat.dispose();
  profile.geometry.dispose();
  solid(root, geometry, profile.material, 0, 0, 0);
  return true;
}

function wallRelief(group, pose, width, middle, design, cream) {
  const root = wallMount(group, pose, middle);
  const height = width * (cream ? (design === "dining" ? 0.61 : 1.27) : design === "dining" ? 0.46 : 0.38);
  const frame = material(cream ? 0xa98a69 : 0x73604b, 0.72);
  const backing = material(cream ? 0xece2d1 : 0xe2d6c0, 0.98);
  panel(root, 0, 0, 0.019, width, height, 0.037, frame);
  panel(root, 0, 0, 0.039, width - 0.023, height - 0.023, 0.012, backing);
  if (design === "dining") {
    const colors = cream ? [0xceb89e, 0xe2d2b9, 0xb7a58e] : [0x998d76, 0xc0ad8e, 0x888d7a];
    for (const [index, color] of colors.entries()) {
      const x = (index - 1) * width * 0.22;
      const radius = height * (index % 2 ? 0.24 : 0.17);
      const top = height * (index === 0 ? 0.05 : index === 2 ? 0.09 : 0.14);
      const bottom = -height * 0.32;
      const arch = new THREE.Shape().moveTo(-radius, bottom).lineTo(-radius, top);
      arch.quadraticCurveTo(-radius, top + radius, 0, top + radius);
      arch.quadraticCurveTo(radius, top + radius, radius, top);
      arch.lineTo(radius, bottom).closePath();
      solid(root, new THREE.ExtrudeGeometry(arch, {
        depth: 0.003, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 1,
      }), material(color, 0.92), x, 0, 0.048);
    }
    return;
  }
  const bands = cream ? [
    { floor: -0.21, phase: 0.1, color: 0xe6d7c2, depth: 0.004 },
    { floor: -0.43, phase: -0.55, color: 0xcab69c, depth: 0.006 },
    { floor: -0.59, phase: -1.4, color: 0xdcc8ae, depth: 0.008 },
  ] : [
    { floor: -0.39, phase: 0.1, color: 0xb6a08a, depth: 0.004 },
    { floor: -0.52, phase: -0.55, color: 0x8c9380, depth: 0.006 },
    { floor: -0.66, phase: -1.4, color: 0xcfbea3, depth: 0.008 },
  ];
  for (const { floor, phase, color, depth } of bands) {
    const form = new THREE.Shape().moveTo(-0.478 * width, -0.46 * height);
    for (let i = 0; i <= 24; i += 1) {
      const u = i / 24;
      const y = 0.12 * Math.sin(u * 5.7 + phase) + 0.12 * u + floor * 0.47;
      form.lineTo((u * 0.956 - 0.478) * width, y * height);
    }
    form.lineTo(0.478 * width, -0.46 * height).closePath();
    solid(root, new THREE.ExtrudeGeometry(form, {
      depth: 0.002, bevelEnabled: true, bevelSize: 0.001, bevelThickness: 0.001, bevelSegments: 1,
    }), material(color, 0.98), 0, 0, 0.045 + depth);
  }
}

function coveDetail(group, pose, width, ceiling, appearance) {
  if (ceiling < 2.49 || width < 1.3) return;
  const root = wallMount(group, pose, ceiling);
  const ceilingFinish = material(appearance.ceiling);
  panel(root, 0, -0.061, 0.105, width, 0.122, 0.21, ceilingFinish);
  panel(root, 0, -0.12, 0.218, width, 0.038, 0.032, ceilingFinish);
  const diffuser = material(0xffedcf, 0.86, { emissive: 0xffcc99, emissiveIntensity: 0.67 });
  panel(root, 0, -0.096, 0.236, width - 0.026, 0.007, 0.012, diffuser);
  for (const direction of [-1, 1]) {
    const x = width * 0.28 * direction;
    const wash = new THREE.PointLight(0xffdeb9, 0.55, 1.35, 2);
    wash.position.set(x, -0.086, 0.269);
    root.add(wash);
    const trim = material(0xb8aea1, 0.72);
    const emitter = material(0xfff0d9, 0.86, { emissive: 0xffe2ba, emissiveIntensity: 0.19 });
    solid(root, new THREE.CylinderGeometry(0.035, 0.035, 0.008, 36), trim, x, -0.007, 0.42);
    solid(root, new THREE.CylinderGeometry(0.024, 0.024, 0.006, 36), emitter, x, -0.011, 0.42);
  }
}

function tabletop(group, item, dining = false) {
  const root = new THREE.Group();
  root.position.set(item.center[0], item.bottomM + item.heightM + 0.002, item.center[1]);
  root.rotation.y = -item.rotationRad;
  group.add(root);
  const edge = Math.min(item.widthM, item.depthM);
  if (edge < 0.34) return;
  const x = edge * 0.21;
  const vaseRadius = Math.min(0.071, edge * 0.12);
  const vaseHeight = dining ? 0.225 : 0.135;
  const profile = [[0, 0], [0.64, 0], [0.88, 0.14], [0.98, 0.42], [0.72, 0.75], [0.42, 0.85], [0.39, 1], [0.28, 1], [0.27, 0.9]];
  solid(root, new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r * vaseRadius, y * vaseHeight)), 36),
    material(0xd9c8ab, 0.72, { side: THREE.DoubleSide }), x, 0, 0);
  const stems = material(0x747856, 0.92);
  const foliage = material(0x858972, 0.83);
  for (const [index, bend] of [-0.17, -0.09, 0.045, 0.13, 0.18].entries()) {
    const length = (dining ? 0.28 : 0.17) + (index % 3) * 0.037;
    const tip = new THREE.Vector3(x + Math.sin(bend * 3) * length, vaseHeight + length, Math.cos(index * 2) * 0.065);
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x, vaseHeight - 0.025, 0),
      new THREE.Vector3(x, vaseHeight + length * 0.6, 0), tip);
    solid(root, new THREE.TubeGeometry(curve, 8, 0.0019, 5, false), stems, 0, 0, 0);
    for (let leaf = 0; leaf < 3; leaf += 1) {
      const point = curve.getPoint(0.5 + leaf * 0.22);
      const sprig = solid(root, new THREE.SphereGeometry(1, 10, 6), foliage, point.x, point.y, point.z);
      sprig.scale.set(0.023, 0.012, 0.003);
      sprig.rotation.set(index, leaf, bend * 3);
    }
  }
  if (dining && edge > 0.82) {
    const stoneware = material(0xc4b695, 0.74, { side: THREE.DoubleSide });
    const radius = Math.min(0.114, edge * 0.13);
    const plateProfile = [[0, 0.005], [radius * 0.67, 0.006], [radius * 0.95, 0.021], [radius, 0.022],
      [radius * 0.98, 0.015], [radius * 0.7, 0.002], [0, 0.001]].map(([r, y]) => new THREE.Vector2(r, y));
    for (const side of [-1, 1]) solid(root, new THREE.LatheGeometry(plateProfile, 36), stoneware, -edge * 0.13, 0, edge * 0.28 * side);
  } else if (!dining) {
    const book = material(0x817c68);
    panel(root, -edge * 0.13, 0.012, -edge * 0.12, edge * 0.28, 0.023, edge * 0.37, book);
    panel(root, -edge * 0.13, 0.01, -edge * 0.116, edge * 0.25, 0.014, edge * 0.37, material(0xe0d7c4));
  }
}

function weave() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const i = (y * size + x) * 4;
    const rib = 1.4 * Math.cos(x * Math.PI / 8) + 0.6 * Math.cos(y * Math.PI / 16);
    const thread = Math.round(239 + rib + ((x * 17 + y * 11 + x * y) % 9) - ((x + y) % 4 === 0 ? 8 : 0));
    pixels.set([thread, thread, thread, 255], i);
  }
  const map = new THREE.DataTexture(pixels, size, size);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.magFilter = THREE.LinearFilter;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.generateMipmaps = true;
  map.needsUpdate = true;
  return map;
}

export function createWalkFitout() {
  const rugMap = weave();
  let ceilingGlow;
  let creamDetails;
  return {
    add(group, scene, windows, ceiling, appearance) {
      const decor = new THREE.Group();
      group.add(decor);
      if (appearance.cream) {
        creamDetails ??= createCreamDetails();
        ceilingGlow ??= createCreamCeilingGlow();
        addCreamCeiling(decor, scene, ceiling, appearance, ceilingGlow);
      }
      for (const window of windows) {
        if (appearance.cream && creamDetails.addWindow(decor, window, ceiling)) continue;
        curtain(decor, window, ceiling, false);
      }
      for (const room of scene.rooms) {
        const items = scene.items.filter((item) => item.roomId === room.id);
        const table = items.find(isDiningTable);
        if (table) {
          diningLight(decor, table, ceiling, appearance.cream);
          tabletop(decor, table, true);
        }
        const seat = items.find((item) => /沙发|sofa/i.test(item.name));
        const coffee = items.find((item) => /茶几|coffee.?table/i.test(item.name));
        if (seat && coffee) carpet(decor, room, seat, coffee, rugMap, appearance.rug);
        if (coffee) tabletop(decor, coffee);
        if (seat) {
          const coveWidth = Math.min(3.82, Math.max(seat.widthM, seat.depthM) + 0.86);
          const covePose = !appearance.cream && decorWall(scene, room, seat, coveWidth / 2);
          const slatted = covePose && oakSlatWall(decor, covePose, coveWidth, ceiling, appearance.wood);
          const width = Math.min(appearance.cream ? 0.95 : 1.62, Math.max(seat.widthM, seat.depthM) * 0.68);
          const pose = !slatted && decorWall(scene, room, seat, width / 2);
          if (pose && width > 0.8) {
            const middle = Math.min(1.62, ceiling * 0.62);
            if (appearance.cream) creamDetails.addArtwork(decor, pose, width, middle, "living");
            else wallRelief(decor, pose, width, middle, "living", false);
          }
          if (covePose) coveDetail(decor, covePose, coveWidth, ceiling, appearance);
        }
        const sideboard = items.find((item) => /餐边柜|sideboard/i.test(item.name));
        if (sideboard && sideboard.heightM + sideboard.bottomM < 1.1) {
          const width = Math.min(1.56, Math.max(sideboard.widthM, sideboard.depthM) * 0.71);
          const pose = decorWall(scene, room, sideboard, width / 2);
          if (pose && width > 0.8) {
            const middle = Math.min(1.57, ceiling * 0.57);
            if (appearance.cream) creamDetails.addArtwork(decor, pose, width, middle, "dining");
            else wallRelief(decor, pose, width, middle, "dining", false);
          }
        }
        const tv = items.find((item) => /电视柜|tv.?console/i.test(item.name));
        if (tv) screen(decor, scene, tv, room, appearance, ceiling);
        if (appearance.visualProfile === "cream-v6") kitchenBacksplash(decor, scene, room, items, appearance);
        if (appearance.cream) {
          addCreamBedroom(decor, scene, room, items, appearance, decorWall);
          if (!room.excludeFromRoutes && /过道|玄关|厨房|corridor|entry|kitchen/i.test(room.name + room.id)) ceilingSpots(decor, room, ceiling);
        }
      }
    },
    dispose() { rugMap.dispose(); ceilingGlow?.dispose(); creamDetails?.dispose(); },
  };
}
