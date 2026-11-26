function stoneMesh(THREE, profile, material, radius, grainOffset) {
  const points = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(points, 72);
  const { position, normal, uv } = geometry.attributes;
  const circumference = 2 * Math.PI * radius;

  for (let index = 0; index < position.count; index += 1) {
    if (Math.abs(normal.getY(index)) > 0.65) {
      uv.setXY(index, position.getX(index) + grainOffset, position.getZ(index) + 0.4);
    } else {
      uv.setXY(index, uv.getX(index) * circumference + grainOffset, position.getY(index));
    }
  }
  uv.needsUpdate = true;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

export function coffeeTableFootprint(width, depth) {
  const length = Math.max(width, depth);
  const span = Math.min(width, depth);
  const largeRadius = Math.min(span * 0.47, length * 0.36);
  const smallRadius = Math.min(span * 0.35, length * 0.26);
  const separation = Math.min(length - largeRadius - smallRadius, (largeRadius + smallRadius) * 0.78);
  const halfExtent = (separation + largeRadius + smallRadius) / 2;
  return [
    { x: largeRadius - halfExtent, z: 0, radius: largeRadius },
    { x: halfExtent - smallRadius, z: span * 0.07, radius: smallRadius },
  ];
}

export function makeCreamCoffeeTable({ THREE, width, depth, height = 0.36, stone }) {
  const group = new THREE.Group();
  group.name = '双圆洞石茶几';
  if (depth > width) group.rotation.y = -Math.PI / 2;
  const tables = coffeeTableFootprint(width, depth);

  for (const [index, { x, z, radius }] of tables.entries()) {
    const top = index === 0 ? height : height * 0.71;
    const grain = index === 0 ? 0.2 : 0.79;
    const thickness = Math.min(top * 0.15, radius * 0.16, 0.043);
    const edge = Math.min(thickness * 0.35, 0.009);
    const underside = top - thickness;
    const pedestal = radius * 0.59;
    const plinth = Math.min(0.013, top * 0.08);
    const base = stoneMesh(THREE, [
      [0, 0], [pedestal * 0.91, 0], [pedestal * 0.91, plinth * 0.45], [pedestal * 0.98, plinth * 0.62],
      [pedestal, plinth], [pedestal, underside - plinth * 0.44], [pedestal * 0.97, underside], [0, underside],
    ], stone, pedestal, grain + 0.2);
    const slab = stoneMesh(THREE, [
      [0, underside], [radius - edge, underside], [radius - edge * 0.35, underside + edge * 0.35],
      [radius, underside + edge], [radius, top - edge], [radius - edge * 0.35, top - edge * 0.35],
      [radius - edge, top], [0, top],
    ], stone, radius, grain);
    base.position.set(x, 0, z);
    slab.position.set(x, 0, z);
    group.add(base, slab);
  }

  return group;
}
