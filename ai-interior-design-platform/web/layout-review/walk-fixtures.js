import * as THREE from "./vendor/three.module.min.js";

export function makeWalkFixture(parent, item) {
  const { name, widthM: width, depthM: depth, heightM: height } = item;
  const kind = /水槽/.test(name) ? "sink" : /电磁灶|灶台/.test(name) ? "hob" : /淋浴隔断/.test(name) ? "shower" : null;
  if (!kind) return [];
  const parts = [];
  const metal = new THREE.MeshStandardMaterial({ color: 0xa5a198, metalness: 0.73, roughness: 0.33 });
  const black = new THREE.MeshStandardMaterial({ color: 0x363936, metalness: 0.19, roughness: 0.27 });

  function mesh(geometry, material, x, y, z) {
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, z);
    part.userData = { id: item.id, color: material.color.getHex() };
    parts.push(part);
    parent.add(part);
    return part;
  }
  function box(w, h, d, material, x = 0, y = 0, z = 0) {
    return mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z);
  }

  if (kind === "sink") {
    const rim = height * 0.37;
    box(width, 0.009, depth, metal, 0, rim);
    box(width * 0.88, 0.005, depth * 0.71, black, 0, rim + 0.006, -depth * 0.022);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, rim, -depth * 0.42),
      new THREE.Vector3(0, height * 0.81, -depth * 0.42),
      new THREE.Vector3(0, height * 0.95, -depth * 0.21),
      new THREE.Vector3(0, height * 0.88, depth * 0.03),
      new THREE.Vector3(0, height * 0.76, depth * 0.08),
    ]);
    mesh(new THREE.TubeGeometry(curve, 24, Math.min(0.011, depth * 0.04), 10, false), metal, 0, 0, 0);
    mesh(new THREE.CylinderGeometry(0.023, 0.027, 0.015, 21), metal, 0, rim + 0.008, -depth * 0.42);
  } else if (kind === "hob") {
    box(width, height * 0.78, depth, black, 0, height * 0.39);
    const ring = new THREE.MeshStandardMaterial({ color: 0x82827a, roughness: 0.54 });
    const major = Math.max(width, depth);
    const radius = Math.min(major * 0.16, Math.min(width, depth) * 0.32);
    for (const side of [-1, 1]) {
      const burner = mesh(new THREE.TorusGeometry(radius, 0.0023, 5, 32), ring, width > depth ? major * 0.24 * side : 0,
        height * 0.84, depth >= width ? major * 0.24 * side : 0);
      burner.rotation.x = -Math.PI / 2;
    }
  } else {
    const glass = new THREE.MeshStandardMaterial({
      color: 0xaabcb7, metalness: 0.12, roughness: 0.11, transparent: true, opacity: 0.16, depthWrite: false,
    });
    const rail = Math.min(0.019, width / 10, depth / 10, height / 8);
    const fixedEdge = -width / 2 + rail;
    const pane = box(rail * 0.42, height - rail, depth - rail * 2, glass, fixedEdge, height / 2);
    pane.renderOrder = 1;
    for (const z of [-depth / 2 + rail, depth / 2 - rail]) box(rail, height, rail, metal, fixedEdge, height / 2, z);
    box(rail, rail, depth - rail, metal, fixedEdge, height - rail / 2);
  }
  return parts;
}
