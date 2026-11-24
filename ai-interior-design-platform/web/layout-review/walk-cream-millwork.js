import * as THREE from "./vendor/three.module.min.js";

function cabinetKind(item, room) {
  const name = item.name;
  const kitchen = /厨房|kitchen/i.test(`${name} ${room?.name ?? ""} ${room?.id ?? ""}`);
  if (/餐边柜|sideboard/i.test(name)) return "sideboard";
  if (kitchen && /吊柜|(?:upper|wall)[-_ ]?cabinet/i.test(name)) return "upper";
  if (kitchen && /橱柜|地柜|(?:base|kitchen)[-_ ]?cabinet|counter/i.test(name)) return "base";
  return null;
}

function finishMaterial(finish, color, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: finish?.roughness ?? 0.76,
    map: finish?.map ?? null,
    roughnessMap: finish?.roughnessMap ?? null,
    normalMap: finish?.normalMap ?? null,
    bumpMap: finish?.bumpMap ?? null,
    bumpScale: finish?.bumpScale ?? 1,
    ...options,
  });
  if (finish?.normalScale) material.normalScale.copy(finish.normalScale);
  return material;
}

function cabinetDoorGeometry(width, height, thickness) {
  const bevel = Math.min(0.0025, thickness / 4);
  const u = width / 2 - bevel;
  const v = height / 2 - bevel;
  const edge = new THREE.Shape();
  edge.moveTo(-u, -v).lineTo(u, -v).lineTo(u, v).lineTo(-u, v).closePath();
  return new THREE.ExtrudeGeometry(edge, {
    depth: thickness - bevel * 2,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelEnabled: true,
    bevelSegments: 1,
  }).translate(0, 0, -(thickness - bevel * 2) / 2);
}

export function makeCreamMillwork(parent, item, room, appearance) {
  if (!appearance.cream) return [];
  const kind = cabinetKind(item, room);
  const length = Math.max(item.widthM, item.depthM);
  const depth = Math.min(item.widthM, item.depthM);
  const height = item.heightM;
  if (!kind || length < 0.55 || depth < 0.22 || height < 0.40) return [];
  if (kind === "sideboard" && (length < 1.06 || height < 0.62)) return [];

  const across = item.depthM > item.widthM;
  const turn = across ? Math.PI / 2 : 0;
  const angle = item.rotationRad + turn;
  const xNormal = -Math.sin(angle);
  const zNormal = Math.cos(angle);
  const inward = room?.polygon.reduce((sum, [x, z]) =>
    sum + (x - item.center[0]) * xNormal + (z - item.center[1]) * zNormal, 0) ?? 1;
  const cabinet = new THREE.Group();
  cabinet.rotation.y = -turn + (inward < 0 ? Math.PI : 0);
  parent.add(cabinet);

  const parts = [];
  const v6 = appearance.visualProfile === "cream-v6";
  const paintColor = v6 ? (kind === "sideboard" ? 0xe6ceb2 : 0xddc2a4) : (kind === "sideboard" ? 0xeadbc7 : 0xe8d9c6);
  const paint = finishMaterial(null, paintColor, { roughness: v6 ? 0.63 : 0.57 });
  const innerWood = finishMaterial(appearance.wood, 0xf7e1c2, {
    emissive: 0x9f6c42, emissiveIntensity: kind === "sideboard" ? 0.14 : 0,
  });
  const recess = finishMaterial(null, 0x917c65, { roughness: 0.88 });
  const worktopFinish = v6 ? appearance.furnitureStone : appearance.stone;
  const worktop = finishMaterial(worktopFinish, v6 ? 0xfff9ee : 0xffeed6);
  const lamp = finishMaterial(null, 0xffe7c1, { emissive: 0xffba77, emissiveIntensity: 0.88 });

  function part(geometry, finish, x, y, z) {
    const mesh = new THREE.Mesh(geometry, finish);
    mesh.position.set(x, y, z);
    mesh.castShadow = finish !== lamp;
    mesh.receiveShadow = true;
    mesh.userData = { id: item.id, color: finish.color.getHex() };
    parts.push(mesh);
    cabinet.add(mesh);
  }

  function box(w, h, d, finish, x, y, z) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const periods = finish === worktop ? worktopFinish?.repeatM : finish === innerWood ? appearance.wood?.repeatM : null;
    if (periods) {
      const uv = geometry.getAttribute("uv");
      const scales = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
      for (const [side, [u, v]] of scales.entries()) for (let corner = 0; corner < 4; corner += 1) {
        const index = side * 4 + corner;
        uv.setXY(index, (uv.getX(index) * u + x + length / 2) / periods[0], uv.getY(index) * v / periods[1]);
      }
    }
    part(geometry, finish, x, y, z);
  }

  const floating = kind === "upper";
  const plinth = floating ? 0.026 : Math.min(0.078, height * 0.095);
  const slab = floating ? 0.019 : 0.029;
  const stile = 0.021;
  const face = 0.018;
  const front = depth / 2 - face / 2 - 0.001;
  const main = height - plinth - slab;
  const open = kind === "sideboard";
  const nicheHeight = open ? Math.min(0.218, main * 0.32) : 0;
  const shelf = height - slab - nicheHeight - (open ? 0.02 : 0);
  const inside = length - 2 * stile;

  box(length, slab, depth, floating ? paint : worktop, 0, height - slab / 2, 0);
  box(length - stile * 2, plinth, depth - (floating ? 0.055 : 0.11),
    floating ? paint : recess, 0, plinth / 2, -0.026);
  for (const direction of [-1, 1]) {
    box(stile, main, depth - 0.003, paint, direction * (length - stile) / 2, plinth + main / 2, -0.001);
  }

  const bodyDepth = depth - face - 0.017;
  box(inside, shelf - plinth, bodyDepth, recess, 0, (shelf + plinth) / 2, (bodyDepth - depth) / 2);
  const bays = Math.min(8, Math.max(2, Math.round(inside / (floating ? 0.46 : 0.55))));
  const pitch = inside / bays;
  const gap = 0.004;
  const band = floating ? 0 : Math.min(0.16, (shelf - plinth) * 0.25);
  const panelBase = plinth + gap;
  const panelTop = shelf - gap;
  const bottomPanelHeight = panelTop - panelBase - band;

  for (let index = 0; index < bays; index += 1) {
    const along = (index + 0.5 - bays / 2) * pitch;
    part(cabinetDoorGeometry(pitch - gap, bottomPanelHeight, face), paint, along, panelBase + bottomPanelHeight / 2, front);
    if (band) {
      const gapHeight = 0.014;
      const drawerHeight = band - gapHeight;
      part(cabinetDoorGeometry(pitch - gap, drawerHeight, face), paint, along, panelTop - drawerHeight / 2, front);
      box(pitch - gap, 0.006, 0.008, innerWood, along, panelTop - band + gapHeight * 0.32, front - 0.009);
    }
  }

  if (floating) {
    const channel = 0.014;
    const lip = depth / 2 - 0.028;
    box(inside - 0.08, 0.009, channel + 0.012, recess, 0, 0.010, lip);
    box(inside - 0.12, 0.004, channel, lamp, 0, 0.004, lip);
  } else if (open) {
    const inset = depth * 0.28;
    const base = shelf + 0.02;
    box(inside, 0.020, depth - 0.017, innerWood, 0, shelf + 0.010, -0.008);
    box(inside, nicheHeight, 0.018, innerWood, 0, base + nicheHeight / 2, -depth / 2 + 0.017);
    box(inside - 0.04, 0.011, 0.030, recess, 0, height - slab - 0.005, inset);
    box(inside - 0.08, 0.004, 0.014, lamp, 0, height - slab - 0.011, inset - 0.004);

    const ceramic = finishMaterial(null, 0xd4bda1, { roughness: 0.69 });
    const radius = 0.064;
    const potteryHeight = nicheHeight * 0.76;
    const profile = [[0, 0], [0.62, 0.02], [0.95, 0.29], [1, 0.48], [0.64, 0.83], [0.52, 1], [0.40, 1], [0.40, 0.84]];
    const shape = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r * radius, y * potteryHeight)), 32);
    part(shape, ceramic, inside * 0.26, base, -depth * 0.10);
    box(0.22, 0.025, 0.135, finishMaterial(null, 0xbfaa8f), -inside * 0.29, base + 0.0125, -depth * 0.08);
    box(0.175, 0.020, 0.112, finishMaterial(null, 0xede1ce), -inside * 0.29 + 0.021, base + 0.035, -depth * 0.09);
  }

  // Some painted cabinet types do not use every finish.
  const used = new Set(parts.map(({ material }) => material));
  for (const finish of [paint, innerWood, recess, worktop, lamp]) if (!used.has(finish)) finish.dispose();
  return parts;
}
