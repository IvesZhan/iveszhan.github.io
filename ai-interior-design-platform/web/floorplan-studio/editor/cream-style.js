// The scan textures share the platform's existing CC0 library and provenance.
const finishDirectory = new URL('../../layout-review/assets/finishes/', import.meta.url);

export const creamPalette = Object.freeze({
  wall: '#f2eee6',
  ceiling: '#faf7f1',
  cut: '#b5ab9a',
  frame: '#d1c6b5',
  baseboard: '#e6ded0',
  glass: '#edf4f1',
  floor: '#e6ded2',
  fabric: '#eae0d0',
});

const floorFinishes = {
  wood: { source: 'oak-plank', size: 2.08, color: '#e1cbae', grain: 0.68, roughness: 0.86, relief: 0.21 },
  tile800: { source: 'wet-tile', size: 1.6, color: '#e3ded6', grain: 0.54, roughness: 0.86, relief: 0.26 },
  tile600: { source: 'wet-tile', size: 1.2, color: '#dbd9d3', grain: 0.69, roughness: 0.87, relief: 0.30 },
  antislip: { source: 'wet-tile', size: 0.6, color: '#d2cbc0', grain: 0.60, roughness: 0.95, relief: 0.35 },
  marble: { source: 'ivory-stone', size: 1.35, color: '#e9e2d8', grain: 0.85, roughness: 0.73, relief: 0.15 },
};

export function createCreamFinishes({ THREE, renderer }) {
  const textures = new Map();
  const materials = new Map();
  const loader = new THREE.TextureLoader();
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  function texture(source, channel, scale) {
    const key = `${source}-${channel}-${scale}`;
    if (!textures.has(key)) {
      const map = loader.load(new URL(`${source}-${channel}.jpg`, finishDirectory).href);
      map.colorSpace = channel === 'color' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.setScalar(scale);
      map.anisotropy = anisotropy;
      textures.set(key, map);
    }
    return textures.get(key);
  }

  function surface(key, { source, size, color, grain = 0, roughness, relief, side = THREE.FrontSide }) {
    if (!materials.has(key)) {
      const scale = 1 / size;
      const material = new THREE.MeshStandardMaterial({
        color, roughness, side,
        map: grain ? texture(source, 'color', scale) : null,
        normalMap: texture(source, 'normal', scale),
        normalScale: new THREE.Vector2(relief, relief),
      });
      // Keep color editable and soften the scanned albedo without losing the physical grain scale.
      if (grain) {
        material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
            vec4 creamBase = diffuseColor;
            #include <map_fragment>
            diffuseColor = mix(creamBase, diffuseColor, ${grain.toFixed(2)});
          `);
        };
        material.customProgramCacheKey = () => `cream-grain-${grain}`;
      }
      materials.set(key, material);
    }
    return materials.get(key);
  }

  return {
    floorMaterial(kind) {
      return floorFinishes[kind] ? surface(`floor-${kind}`, floorFinishes[kind]) : null;
    },
    wallMaterial() {
      return surface('plaster', {
        source: 'chalk-plaster', size: 1, color: creamPalette.wall, grain: 0.28, roughness: 0.96, relief: 0.12,
      });
    },
    woodMaterial(color) {
      return surface(`wood-${color}`, {
        source: 'oak-veneer', size: 0.62, color, grain: 0.34, roughness: 0.70, relief: 0.17,
      });
    },
    fabricMaterial(color, doubleSided = false) {
      return surface(`fabric-${color}-${doubleSided}`, {
        source: 'woven-cream-rug', size: 0.22, color, grain: 0.20, roughness: 0.97, relief: 0.22,
        side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      });
    },
    rugMaterial(color) {
      return surface(`rug-${color}`, {
        source: 'woven-cream-rug', size: 0.31, color, grain: 0.55, roughness: 0.98, relief: 0.50,
      });
    },
  };
}

export function applyCreamWallUv(mesh) {
  const { position, normal, uv } = mesh.geometry.attributes;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index) + mesh.position.x;
    const y = position.getY(index) + mesh.position.y;
    const z = position.getZ(index) + mesh.position.z;
    const side = Math.abs(normal.getX(index)) > 0.5;
    uv.setXY(index, side ? z : x, Math.abs(normal.getY(index)) > 0.5 ? z : y);
  }
  uv.needsUpdate = true;
}

export function applyCreamStyle({ THREE, renderer, scene, hemisphere, sunlight, ground, lamps, night, hour, daylightWindow }) {
  const midday = Math.sin(Math.PI * THREE.MathUtils.clamp((hour - 6) / 12, 0, 1));
  const warmth = 1 - midday;
  if (daylightWindow) {
    const { center: [x, z], inward: [nx, nz] } = daylightWindow;
    const azimuth = THREE.MathUtils.clamp((hour - 12) / 5, -1, 1) * 0.67;
    const directionX = nx * Math.cos(azimuth) - nz * Math.sin(azimuth);
    const directionZ = nz * Math.cos(azimuth) + nx * Math.sin(azimuth);
    sunlight.position.set(x - directionX * 12, 4.7 + midday * 5.4, z - directionZ * 12);
    sunlight.target.position.set(x + nx * 1.4, 0, z + nz * 1.4);
  }
  sunlight.color.set(0xfffbf6).lerp(new THREE.Color(0xffead7), warmth * 0.34);
  sunlight.intensity = night ? 0.025 : 0.56 + midday * 0.77;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  sunlight.shadow.radius = 4;
  sunlight.shadow.normalBias = 0.010;
  sunlight.shadow.bias = -0.00016;
  hemisphere.color.set(night ? 0xd2d9ed : 0xfffdf8);
  hemisphere.groundColor.set(night ? 0x746f68 : 0xcec8be);
  hemisphere.intensity = night ? 0.27 : 1.74;
  scene.background = new THREE.Color(night ? 0x292b32 : 0xe9e9e4);
  ground.material.color.set(night ? 0x515057 : 0xe9e5dd);
  renderer.toneMappingExposure = night ? 1.14 : 1.04;
  lamps.traverse((object) => {
    if (object.isPointLight) {
      object.color.set(0xffe3c6);
      object.intensity = night ? 12 : 0;
      object.distance = 5.5;
      object.decay = 2;
    } else if (object.isMesh && object.material.emissive) {
      object.material.emissiveIntensity = night ? 1.35 : 0.14;
    }
  });
}

function ownedMesh(THREE, geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.creamOwnedMaterial = true;
  return mesh;
}

export function addCreamWindowDressing({ THREE, group, center, inward, span, ceiling, finishes }) {
  if (span < 1.8) return;
  const [x, z] = center;
  const [nx, nz] = inward;
  const railY = ceiling - 0.075;
  const height = railY - 0.035;
  const dressing = new THREE.Group();
  dressing.position.set(x + nx * 0.19, railY, z + nz * 0.19);
  dressing.rotation.y = Math.atan2(nx, nz);
  const rail = ownedMesh(THREE, new THREE.BoxGeometry(span + 0.18, 0.025, 0.06),
    new THREE.MeshStandardMaterial({ color: creamPalette.ceiling, roughness: 0.6 }));
  dressing.add(rail);

  const voile = new THREE.MeshStandardMaterial({
    color: '#f8f5ed', opacity: 0.35, side: THREE.DoubleSide, transparent: true, depthWrite: false,
    roughness: 0.97, emissive: '#e5ded2', emissiveIntensity: 0.05,
  });
  const drape = finishes.fabricMaterial('#d0c5b4', true);
  const edgeWidth = Math.min(0.43, span * 0.14);

  function panel(width, offset, depth, folds, material, shadow) {
    const geometry = new THREE.PlaneGeometry(width, height, folds * 12, 10);
    const points = geometry.attributes.position;
    for (let index = 0; index < points.count; index += 1) {
      const across = points.getX(index) / width + 0.5;
      const down = 0.5 - points.getY(index) / height;
      const angle = across * Math.PI * 2 * folds;
      points.setZ(index, depth * (0.75 + down * 0.25) * Math.sin(angle + down * 0.34));
      points.setY(index, points.getY(index) + 0.008 * Math.cos(angle) * down * down);
    }
    geometry.computeVertexNormals();
    const mesh = shadow ? new THREE.Mesh(geometry, material) : ownedMesh(THREE, geometry, material);
    mesh.position.set(offset, -height / 2, shadow ? 0.059 : 0.025);
    mesh.castShadow = shadow;
    mesh.receiveShadow = shadow;
    dressing.add(mesh);
  }

  for (const side of [-1, 1]) {
    panel(span / 2 - 0.02, side * span / 4, 0.022, Math.max(6, Math.round(span * 2.5)), voile, false);
    panel(edgeWidth, side * (span / 2 + 0.06 - edgeWidth / 2), 0.033, 4, drape, true);
  }
  group.add(dressing);
}

export function createCreamPendant({ THREE, position, roomId }) {
  if (roomId !== 'dining') return null;
  const group = new THREE.Group();
  group.position.set(...position);
  const hardware = new THREE.MeshStandardMaterial({ color: '#837261', roughness: 0.58, metalness: 0.32 });
  const shade = new THREE.MeshStandardMaterial({
    color: '#ece0ca', emissive: '#e4caa5', emissiveIntensity: 0.14, roughness: 0.94, side: THREE.DoubleSide,
  });
  const diffuser = new THREE.MeshStandardMaterial({
    color: '#fff6e7', emissive: '#ffdead', emissiveIntensity: 0.14, roughness: 0.95, side: THREE.DoubleSide,
  });
  const canopy = ownedMesh(THREE, new THREE.CylinderGeometry(0.082, 0.082, 0.028, 32), hardware);
  canopy.position.y = -0.014;
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.52, 12), hardware);
  cord.position.y = -0.285;
  const profile = [[0.30, -0.722], [0.313, -0.707], [0.317, -0.68], [0.307, -0.642], [0.279, -0.608],
    [0.235, -0.572], [0.174, -0.548], [0.098, -0.529], [0.021, -0.522]];
  const geometry = new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), 72);
  const points = geometry.attributes.position;
  for (let index = 0; index < points.count; index += 1) {
    const x = points.getX(index);
    const z = points.getZ(index);
    const pleat = 1 + 0.022 * Math.cos(Math.atan2(z, x) * 24);
    points.setX(index, x * pleat);
    points.setZ(index, z * pleat);
  }
  geometry.computeVertexNormals();
  const body = ownedMesh(THREE, geometry, shade);
  const lens = ownedMesh(THREE, new THREE.CircleGeometry(0.292, 56), diffuser);
  lens.rotation.x = Math.PI / 2;
  lens.position.y = -0.714;
  const lamp = new THREE.PointLight(0xffe3c6, 0, 5.5, 2);
  lamp.position.y = -0.733;
  group.add(canopy, cord, body, lens, lamp);
  return group;
}

export function buildCreamSofa({ THREE, width, depth, color, finishes, roundedBox }) {
  if (width < 1.25 || depth < 0.62) return null;
  const group = new THREE.Group();
  const upholstery = finishes.fabricMaterial(color || creamPalette.fabric);
  const piping = finishes.fabricMaterial('#d9cebc');
  const platform = finishes.woodMaterial('#6b5d50');
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  // The sofa is editable on the same footprint and faces the upstream furniture +Z direction.
  group.add(roundedBox(width * 0.79, 0.086, depth * 0.73, platform, 0, 0, 0.018, 0.031));
  const plan = new THREE.Shape();
  plan.moveTo(-halfWidth + 0.029, 0);
  plan.bezierCurveTo(-halfWidth + 0.031, halfDepth * 0.72, -halfWidth * 0.82, halfDepth - 0.032, -halfWidth * 0.67, halfDepth - 0.029);
  plan.bezierCurveTo(-halfWidth * 0.25, halfDepth - 0.008, halfWidth * 0.25, halfDepth - 0.008, halfWidth * 0.67, halfDepth - 0.029);
  plan.bezierCurveTo(halfWidth * 0.82, halfDepth - 0.032, halfWidth - 0.031, halfDepth * 0.72, halfWidth - 0.029, 0);
  plan.bezierCurveTo(halfWidth - 0.026, -halfDepth * 0.79, halfWidth * 0.84, -halfDepth + 0.026, halfWidth * 0.59, -halfDepth + 0.03);
  plan.bezierCurveTo(halfWidth * 0.24, -halfDepth + 0.016, -halfWidth * 0.24, -halfDepth + 0.016, -halfWidth * 0.59, -halfDepth + 0.03);
  plan.bezierCurveTo(-halfWidth * 0.84, -halfDepth + 0.026, -halfWidth + 0.026, -halfDepth * 0.79, -halfWidth + 0.029, 0);
  const baseGeometry = new THREE.ExtrudeGeometry(plan, { depth: 0.188, bevelSize: 0.022, bevelThickness: 0.024, bevelSegments: 4, curveSegments: 20 });
  baseGeometry.rotateX(-Math.PI / 2);
  const base = new THREE.Mesh(baseGeometry, upholstery);
  base.position.y = 0.10;
  base.castShadow = base.receiveShadow = true;
  group.add(base);

  // A continuous bent upholstered back connects both arms, with a rounded cap at each end.
  const curve = new THREE.CatmullRomCurve3([
    [-0.82, 0.49], [-0.87, 0.01], [-0.81, -0.59], [-0.50, -0.75], [0, -0.78],
    [0.50, -0.75], [0.81, -0.59], [0.87, 0.01], [0.82, 0.49],
  ].map(([x, z]) => new THREE.Vector3(x * halfWidth, 0, z * halfDepth)));
  const slices = 88;
  const sides = 20;
  const positions = [];
  const coordinates = [];
  const triangles = [];
  for (let slice = 0; slice <= slices; slice += 1) {
    const t = slice / slices;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const acrossBack = THREE.MathUtils.smoothstep(-point.z / halfDepth, 0.18, 0.76);
    const taper = Math.max(0.018, Math.sin(Math.PI / 2 * Math.min(t / 0.045, (1 - t) / 0.045, 1)));
    const radius = Math.min(0.138, halfWidth * 0.12, halfDepth * 0.20) * taper;
    const height = (0.153 + acrossBack * 0.095) * taper;
    const middle = 0.425 + acrossBack * 0.057;
    for (let side = 0; side <= sides; side += 1) {
      const angle = side / sides * Math.PI * 2;
      const across = Math.cos(angle);
      const top = Math.sin(angle);
      const normal = Math.sign(across) * Math.pow(Math.abs(across), 0.73) * radius;
      positions.push(point.x - tangent.z * normal, middle + Math.sign(top) * Math.pow(Math.abs(top), 0.78) * height, point.z + tangent.x * normal);
      coordinates.push(t * width, side / sides);
      if (slice === slices || side === sides) continue;
      const a = slice * (sides + 1) + side;
      const b = a + sides + 1;
      triangles.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }
  const backGeometry = new THREE.BufferGeometry();
  backGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  backGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(coordinates, 2));
  backGeometry.setIndex(triangles);
  backGeometry.computeVertexNormals();
  const back = new THREE.Mesh(backGeometry, upholstery);
  back.castShadow = back.receiveShadow = true;
  group.add(back);

  const count = width > 2.1 ? 3 : 2;
  const pitch = width * 0.81 / count;
  const cushionWidth = pitch - 0.012;
  const cushionDepth = depth * 0.68;
  for (let index = 0; index < count; index += 1) {
    const x = (index - (count - 1) / 2) * pitch;
    const z = depth * 0.107 - Math.abs(x) * 0.018;
    group.add(roundedBox(cushionWidth, 0.145, cushionDepth, upholstery, x, 0.302, z, 0.067));
    const seamWidth = cushionWidth / 2 - 0.008;
    const seamDepth = cushionDepth / 2 - 0.008;
    const corner = 0.071;
    const path = new THREE.Path();
    path.moveTo(-seamWidth + corner, -seamDepth);
    path.lineTo(seamWidth - corner, -seamDepth);
    path.quadraticCurveTo(seamWidth, -seamDepth, seamWidth, -seamDepth + corner);
    path.lineTo(seamWidth, seamDepth - corner);
    path.quadraticCurveTo(seamWidth, seamDepth, seamWidth - corner, seamDepth);
    path.lineTo(-seamWidth + corner, seamDepth);
    path.quadraticCurveTo(-seamWidth, seamDepth, -seamWidth, seamDepth - corner);
    path.lineTo(-seamWidth, -seamDepth + corner);
    path.quadraticCurveTo(-seamWidth, -seamDepth, -seamWidth + corner, -seamDepth);
    const contour = new THREE.CatmullRomCurve3(path.getSpacedPoints(40).slice(0, -1)
      .map((point) => new THREE.Vector3(x + point.x, 0.367, z + point.y)), true);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(contour, 64, 0.0017, 5, true), piping));
  }

  const pillowWidth = Math.min(0.4, width * 0.27);
  const cushions = [
    { x: -width * 0.28, z: -depth * 0.16, angle: -0.24, color: '#d9c7ae' },
    { x: width * 0.26, z: -depth * 0.20, angle: 0.28, color: '#c8ccc0' },
  ];
  for (const cushion of cushions) {
    const pillow = roundedBox(pillowWidth, 0.33, 0.155, finishes.fabricMaterial(cushion.color), cushion.x, 0.429, cushion.z, 0.074);
    pillow.rotation.set(-0.42, -cushion.angle * 0.4, cushion.angle);
    group.add(pillow);
  }
  return group;
}

export function buildCreamDiningChair({ THREE, width, depth, color, finishes, roundedBox }) {
  if (width < 0.34 || depth < 0.32) return null;
  const group = new THREE.Group();
  const oak = finishes.woodMaterial('#d7c2a3');
  const upholstery = finishes.fabricMaterial(color || creamPalette.fabric);
  const seatHeight = 0.445;

  function member(start, end, topRadius, bottomRadius) {
    const tip = new THREE.Vector3(...end);
    const foot = new THREE.Vector3(...start);
    const axis = tip.clone().sub(foot);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(topRadius, bottomRadius, axis.length(), 16), oak);
    mesh.position.copy(tip).lerp(foot, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.normalize());
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }

  for (const side of [-1, 1]) {
    member([side * width * 0.386, 0, depth * 0.364],
      [side * width * 0.324, seatHeight - 0.03, depth * 0.299], 0.021, 0.013);
    member([side * width * 0.397, 0, -depth * 0.429],
      [side * width * 0.327, seatHeight - 0.01, -depth * 0.294], 0.019, 0.0135);
    member([side * width * 0.327, seatHeight - 0.012, -depth * 0.294],
      [side * width * 0.343, 0.749, -depth * 0.372], 0.017, 0.019);
  }

  group.add(roundedBox(width * 0.89, 0.043, depth * 0.813, oak, 0, seatHeight - 0.058, depth * 0.026, 0.018));
  group.add(roundedBox(width * 0.884, 0.047, depth * 0.807, upholstery, 0, seatHeight - 0.02, depth * 0.04, 0.022));

  function backrest(memberWidth, height, thickness, material, bottom, forward) {
    const mesh = roundedBox(memberWidth, height, thickness, material, 0, bottom, -depth * 0.379 + forward, thickness * 0.43);
    const { position: points, normal: normals } = mesh.geometry.attributes;
    const normal = new THREE.Vector3();
    const bend = 0.078 / (width / 2) ** 2;
    for (let i = 0; i < points.count; i += 1) {
      const x = points.getX(i);
      const y = points.getY(i);
      points.setZ(i, points.getZ(i) + bend * x * x - 0.11 * y);
      const nz = normals.getZ(i);
      normal.set(normals.getX(i) - 2 * bend * x * nz, normals.getY(i) + 0.11 * nz, nz).normalize();
      normals.setXYZ(i, normal.x, normal.y, normal.z);
    }
    return mesh;
  }

  group.add(backrest(width * 0.968, 0.191, 0.050, oak, 0.633, 0));
  group.add(backrest(width * 0.89, 0.155, 0.044, upholstery, 0.651, 0.023));
  return group;
}
