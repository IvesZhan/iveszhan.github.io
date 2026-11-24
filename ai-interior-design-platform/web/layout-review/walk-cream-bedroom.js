import * as THREE from "./vendor/three.module.min.js";
import { containsPoint } from "./scene.js";

function standard(color, properties = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...properties });
}

function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function lamp(parent, table) {
  const width = Math.min(table.widthM, table.depthM);
  if (width < 0.24 || table.bottomM + table.heightM > 0.9) return;

  const root = new THREE.Group();
  root.position.set(table.center[0], table.bottomM + table.heightM, table.center[1]);
  parent.add(root);

  const radius = Math.min(width * 0.34, 0.15);
  const height = radius * 2.34;
  const profile = (points) => new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r * radius, y * height)), 40);
  const ceramic = standard(0xe0c9a8, { roughness: 0.67 });
  const shade = standard(0xf7e7ce, { emissive: 0xffd6a0, emissiveIntensity: 0.35 });
  const diffuser = standard(0xf4e4cb, { emissive: 0xffd6a0, emissiveIntensity: 0.5 });

  mesh(root, profile([[0, 0], [0.31, 0], [0.36, 0.035], [0.36, 0.38], [0.29, 0.5], [0.22, 0.57]]), ceramic);
  mesh(root, profile([[0.98, 0.56], [1, 0.62], [0.96, 0.72], [0.83, 0.82], [0.67, 0.9], [0.43, 0.97], [0.19, 1], [0, 1]]), shade);
  const underside = mesh(root, new THREE.CircleGeometry(radius * 0.98, 40), diffuser, 0, height * 0.562);
  underside.rotation.x = Math.PI / 2;
  underside.castShadow = false;

  const light = new THREE.PointLight(0xffdfb5, 2.5, 1.55, 2);
  light.position.set(0, height * 0.52, 0);
  root.add(light);
}

function bedroomArt(parent, scene, room, bed, across, along, appearance, decorWall) {
  const long = Math.max(bed.widthM, bed.depthM);
  const anchor = { ...bed, center: [bed.center[0] - along[0] * long / 2, bed.center[1] - along[1] * long / 2] };
  const width = Math.min(across * 0.34, 0.6);
  let count = across >= 1.45 ? 2 : 1;
  const gap = 0.095;
  function host(count) {
    const pose = decorWall(scene, room, anchor, (count * width + (count - 1) * gap) / 2);
    if (pose && Math.abs(along[0] * Math.cos(pose.angle) + along[1] * Math.sin(pose.angle)) < 0.28) return pose;
    return null;
  }
  let pose = host(count);
  if (!pose && count === 2) {
    count = 1;
    pose = host(count);
  }
  if (!pose) return;

  const root = new THREE.Group();
  const height = width * 1.13;
  const artCenter = Math.max(1.4, bed.bottomM + bed.heightM + height / 2 + 0.24);
  root.position.set(pose.point[0], artCenter, pose.point[1]);
  root.rotation.y = -pose.angle;
  parent.add(root);
  const wood = standard(appearance.wood?.color ?? 0xb69572, { map: appearance.wood?.map ?? null });
  const mat = standard(0xf1e7d7);
  const sand = standard(0xd1b99b);
  const accent = standard(/儿童|child|kids/i.test(room.name + room.id) ? 0x8c9277 : 0xba987c);
  for (let index = 0; index < count; index += 1) {
    const x = (index - (count - 1) / 2) * (width + gap);
    const sign = index === 0 ? -1 : 1;
    mesh(root, new THREE.BoxGeometry(width, height, 0.022), wood, x, 0, 0.013);
    mesh(root, new THREE.PlaneGeometry(width - 0.028, height - 0.028), mat, x, 0, 0.025);
    mesh(root, new THREE.CircleGeometry(width * 0.16, 32), sand, x - sign * width * 0.15, height * 0.15, 0.027);
    const toneBlock = mesh(root, new THREE.PlaneGeometry(width * 0.31, height * 0.36), accent, x + sign * width * 0.06, -height * 0.095, 0.029);
    toneBlock.rotation.z = sign * 0.12;
  }
}

function bedsideRug(parent, room, bed, along) {
  const long = Math.max(bed.widthM, bed.depthM);
  const width = Math.min(bed.widthM, bed.depthM);
  const cross = [-along[1], along[0]];
  const center = bed.center.map((coordinate, axis) => coordinate + along[axis] * long * 0.16);
  const sizes = [[long * 0.78, width + 0.48], [long * 0.74, width + 0.26]];
  const fits = ([length, across]) => [-1, 1].every((u) => [-1, 1].every((v) => containsPoint([
    center[0] + u * length / 2 * along[0] + v * across / 2 * cross[0],
    center[1] + u * length / 2 * along[1] + v * across / 2 * cross[1],
  ], room.polygon)));
  const size = sizes.find(fits);
  if (!size) return;
  const [length, across] = size;
  const rug = new THREE.Group();
  rug.position.set(center[0], 0.008, center[1]);
  rug.rotation.y = -Math.atan2(along[1], along[0]);
  parent.add(rug);
  const hem = mesh(rug, new THREE.BoxGeometry(length, 0.012, across), standard(0xc6b098));
  hem.castShadow = false;
  const wool = mesh(rug, new THREE.PlaneGeometry(length - 0.034, across - 0.034), standard(0xd9c6ab), 0, 0.0065);
  wool.rotation.x = -Math.PI / 2;
  wool.castShadow = false;
}

export function addCreamBedroom(parent, scene, room, items, appearance, decorWall) {
  const bed = items.find(({ name, widthM, depthM }) =>
    /床(?!头|边|尾)|\bbed\b/i.test(name) && !/bedside/i.test(name) && Math.min(widthM, depthM) > 0.75);
  if (!bed) return;
  const angle = bed.rotationRad + (bed.widthM >= bed.depthM ? 0 : Math.PI / 2);
  const along = [Math.cos(angle), Math.sin(angle)];
  const bedside = items.find(({ name }) => /床头几|床头柜|bedside|nightstand/i.test(name));
  if (bedside) lamp(parent, bedside);
  bedroomArt(parent, scene, room, bed, Math.min(bed.widthM, bed.depthM), along, appearance, decorWall);
  bedsideRug(parent, room, bed, along);
}
