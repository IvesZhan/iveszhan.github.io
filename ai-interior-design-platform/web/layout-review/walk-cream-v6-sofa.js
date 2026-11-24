import * as THREE from "./vendor/three.module.min.js";

function clothTexture(looped) {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const cellX = Math.floor(x / 8);
      const cellY = Math.floor(y / 8);
      const shift = ((cellY + cellX * 7) % 4) / 7;
      const u = (x % 8) / 8 - 0.5 + shift * 0.35;
      const v = (y % 8) / 8 - 0.5;
      const loop = Math.exp(-((Math.hypot(u * 1.1, v * 0.86) - 0.26) ** 2) * 87);
      const warp = Math.cos(x * Math.PI / 2) * Math.sin(y * Math.PI / 4 + cellX * Math.PI);
      const thread = ((x * 37 + y * 17 + x * y * 19) % 23 - 11) * 0.7;
      const shade = Math.round(226 + (looped ? loop * 21 : warp * 8) + thread);
      const index = (y * size + x) * 4;
      pixels[index] = pixels[index + 1] = pixels[index + 2] = shade;
      pixels[index + 3] = 255;
    }
  }
  const map = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  map.generateMipmaps = true;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.anisotropy = 8;
  map.needsUpdate = true;
  return map;
}

function fabric(color, map, bumpScale) {
  return new THREE.MeshPhysicalMaterial({
    color, map, bumpMap: map, bumpScale,
    roughness: 0.91, sheen: 0.55, sheenRoughness: 0.77,
    sheenColor: new THREE.Color(0xd5bca0),
  });
}

const seatCenters = [-0.736, 0, 0.736];

function seatCurve(x) {
  return -0.089 + 0.214 * (1 - Math.exp(-2.8 * x * x)) + 0.033 * x * x;
}

function softSeat(centerX) {
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const positions = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const softEdge = (value, exponent) => Math.sign(value) * Math.pow(Math.abs(value), exponent);
  for (let i = 0; i < positions.count; i += 1) {
    const localX = softEdge(positions.getX(i), 0.57);
    const localY = softEdge(positions.getY(i), 0.72);
    const localZ = softEdge(positions.getZ(i), 0.60);
    const x = centerX + localX * 0.379;
    const compression = Math.max(0, localY) * Math.cos(localX * 3) * Math.cos(localZ * 4) * 0.005;
    const y = 0.443 + localY * 0.092 + compression;
    const z = seatCurve(x) + localZ * 0.352;
    positions.setXYZ(i, x, y, z);
    uv.setXY(i, uv.getX(i) * 9.5, uv.getY(i) * 4.4);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function makeThrow(material, frame) {
  const folds = new THREE.CatmullRomCurve3([
    [-0.84, 0.558, -0.126], [-0.80, 0.570, -0.026], [-0.77, 0.540, 0.104],
    [-0.744, 0.543, 0.258], [-0.721, 0.530, 0.391], [-0.712, 0.474, 0.449],
    [-0.701, 0.334, 0.478], [-0.681, 0.174, 0.487], [-0.659, 0.050, 0.516],
    [-0.637, 0.010, 0.531],
  ].map((point) => new THREE.Vector3(...point)));
  const across = 44;
  const length = 64;
  const geometry = new THREE.PlaneGeometry(0.55, 1, across, length);
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const hem = [];
  const ray = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const backward = new THREE.Vector3(0, 0, -1);
  for (let row = 0; row <= length; row += 1) {
    const v = row / length;
    const center = folds.getPoint(v);
    const tangent = folds.getTangent(v);
    for (let i = 0; i <= across; i += 1) {
      const u = i / across;
      const p = 2 * u - 1;
      const flat = THREE.MathUtils.smoothstep(v, 0.83, 1);
      const amplitude = 0.011 + 0.023 * Math.sin(v * Math.PI);
      const fold = amplitude * (0.56 * Math.sin(u * 31 + 1.8 * v + Math.sin(u * 8)) +
        0.33 * Math.sin(u * 54 - 3.6 * v) + 0.11 * Math.cos(u * 96 + v * 7));
      const gathering = 0.48 + Math.sin(v * Math.PI * 0.75) * 0.11;
      const x = center.x + p * gathering * 0.5 + Math.sin(v * 8 + p * 5) * 0.012;
      let y = Math.max(0.009, center.y + tangent.z * fold + flat * 0.004 * Math.sin(u * 37));
      let z = Math.min(0.548, center.z - tangent.y * fold - (0.015 + 0.030 * (1 - v)) * p);
      const localX = Math.min(...seatCenters.map((seatX) => Math.abs(x - seatX))) / 0.379;
      const seatX2 = Math.pow(localX, 2 / 0.57);
      // Invert the rounded seat surface to support the cloth without raycasting every seat triangle.
      if (v < 0.56 && y > 0.43) {
        const localZ = Math.abs((z - seatCurve(x)) / 0.352);
        const inner = 1 - seatX2 - Math.pow(localZ, 2 / 0.60);
        if (inner > 0) y = Math.max(y, 0.450 + Math.pow(inner, 0.72 / 2) * 0.092);
      }
      if (v > 0.39 && y < 0.51 && y > 0.13) {
        const localY = Math.max(0, Math.abs(y - 0.443) - 0.005) / 0.092;
        const inner = 1 - seatX2 - Math.pow(localY, 2 / 0.72);
        const front = inner > 0 ? seatCurve(x) + Math.pow(inner, 0.60 / 2) * 0.352 : z;
        ray.set(origin.set(x, y, 0.8), backward);
        const platform = ray.intersectObjects(frame, false)[0];
        const envelope = Math.max(front, platform?.point.z ?? z);
        if (envelope > z) z = Math.min(0.549, envelope + 0.004 + Math.abs(fold) * 0.24);
      }
      const vertex = row * (across + 1) + i;
      position.setXYZ(vertex, x, y, z);
      uv.setXY(vertex, u * 2.6, v * 5.1);
      if (row === length) hem.push([x, y, z]);
    }
  }
  geometry.computeVertexNormals();

  const fringe = [];
  for (let i = 0; i < hem.length - 1; i += 1) {
    for (const fraction of [0.12, 0.49, 0.82]) {
      const [x, y, z] = hem[i].map((value, axis) => THREE.MathUtils.lerp(value, hem[i + 1][axis], fraction));
      const variation = (Math.sin(i * 23 + fraction * 7) + 1) / 2;
      const xEnd = x + (variation - 0.5) * 0.015;
      const zEnd = Math.min(0.55, z + 0.014 + variation * 0.013);
      const yEnd = 0.003 + variation * 0.003;
      const w = 0.0011;
      fringe.push(x - w, y, z, x + w, y, z, xEnd - w, yEnd, zEnd,
        x + w, y, z, xEnd + w, yEnd, zEnd, xEnd - w, yEnd, zEnd);
    }
  }
  const fringeGeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(fringe, 3));
  fringeGeometry.computeVertexNormals();
  const root = new THREE.Group();
  root.name = "Draped linen throw";
  root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(fringeGeometry, new THREE.MeshStandardMaterial({
    color: 0xc6a988, roughness: 0.96, side: THREE.DoubleSide,
  })));
  return root;
}

export function makeCreamV6Sofa(template) {
  const root = template.clone(true);
  const boucle = clothTexture(true);
  const upholstery = fabric(0xead8bf, boucle, 0.0033);
  const oldSeats = [];
  const platform = [];
  // Keep the authored crescent frame and pillows, while softening its seats and reworking the upholstery.
  root.traverse((mesh) => {
    if (!mesh.isMesh) return;
    if (/separate.*crowned.*seat/i.test(mesh.name)) {
      oldSeats.push(mesh);
    } else if (/continuous.*crescent.*back|upholstered.*platform/i.test(mesh.name)) {
      mesh.material = upholstery;
      mesh.geometry = mesh.geometry.clone();
      const uv = mesh.geometry.getAttribute("uv");
      for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) * 2.35, uv.getY(i) * 2.35);
      if (/platform/i.test(mesh.name)) {
        const position = mesh.geometry.getAttribute("position");
        for (let i = 0; i < position.count; i += 1) {
          const x = position.getX(i);
          const y = position.getY(i);
          const z = position.getZ(i);
          const beneathThrow = THREE.MathUtils.smoothstep(x, -1.02, -0.91) *
            (1 - THREE.MathUtils.smoothstep(x, -0.53, -0.43));
          const frontLip = THREE.MathUtils.smoothstep(z, 0.37, 0.51);
          position.setY(i, y - 0.053 * (1 - THREE.MathUtils.smoothstep(y, 0.18, 0.35)));
          // Recess the upholstered lip under the fabric so its folds stay within the furniture footprint.
          position.setZ(i, z - 0.027 * beneathThrow * frontLip);
        }
        mesh.geometry.computeVertexNormals();
        platform.push(mesh);
      }
    } else if (/circular.*foot/i.test(mesh.name)) {
      mesh.material = mesh.material.clone();
      mesh.material.color.set(0x32251d);
      mesh.position.x *= 0.94;
      mesh.position.z *= 0.89;
    }
  });
  for (const seat of oldSeats) seat.removeFromParent();
  const seats = seatCenters.map((x) => new THREE.Mesh(softSeat(x), upholstery));
  root.add(...seats);
  root.updateMatrixWorld(true);
  const linen = fabric(0xd6b891, clothTexture(false), 0.0028);
  linen.side = THREE.DoubleSide;
  root.add(makeThrow(linen, platform));
  return root;
}
