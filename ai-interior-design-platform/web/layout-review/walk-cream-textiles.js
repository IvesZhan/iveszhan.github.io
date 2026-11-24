import * as THREE from "./vendor/three.module.min.js";

function weaveTexture() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const crosses = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
      const thread = Math.sin((crosses ? x : y) * Math.PI / 2 - Math.PI / 4);
      const fibre = ((x * 19 + y * 37 + x * y * 17) % 17) - 8;
      const shade = Math.round(231 + thread * 8 + fibre);
      pixels[index] = pixels[index + 1] = pixels[index + 2] = shade;
      pixels[index + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function textile(color, texture, grain = 0.0013) {
  return new THREE.MeshStandardMaterial({
    color, map: texture, bumpMap: texture, bumpScale: grain, roughness: 0.97,
  });
}

function cushion(root, texture, { color, center, size: [width, height, thickness], tilt, angle }) {
  const geometry = new THREE.SphereGeometry(1, 40, 24);
  const vertices = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const round = (coordinate) => Math.sign(coordinate) * Math.pow(Math.abs(coordinate), 0.57);
  for (let i = 0; i < vertices.count; i += 1) {
    const x = round(vertices.getX(i));
    const y = round(vertices.getY(i));
    const z = vertices.getZ(i);
    const pinch = Math.pow(1 - Math.abs(z), 3);
    const crease = Math.sin(x * 23 + y * 9) * pinch * 0.002;
    vertices.setXYZ(i, width * x / 2 + crease, height * y / 2, thickness * z / 2 + crease);
    uv.setXY(i, uv.getX(i) * width * 12, uv.getY(i) * height * 11);
  }
  geometry.computeVertexNormals();
  const pillow = new THREE.Mesh(geometry, textile(color, texture, 0.001));
  pillow.position.set(...center);
  pillow.rotation.set(tilt, angle, angle * 0.64);
  root.add(pillow);
}

function throwBlanket(root, texture, { color, center, width, section, depthLimit, folds }) {
  const line = new THREE.CatmullRomCurve3(section.map(([height, depth]) => new THREE.Vector3(center, height, depth)));
  const geometry = new THREE.PlaneGeometry(width, 1, 32, 56);
  const vertices = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const length = line.getLength();
  for (let row = 0; row <= 56; row += 1) {
    const v = 1 - row / 56;
    const base = line.getPointAt(v);
    const tangent = line.getTangentAt(v);
    for (let column = 0; column <= 32; column += 1) {
      const i = row * 33 + column;
      const u = column / 32;
      const undulation = 0.56 * Math.sin(u * 28 + v * 2.8) + 0.31 * Math.cos(u * 47 - v * 4.3);
      const hem = Math.max(0, 1 - Math.min(u, 1 - u, v, 1 - v) * 55) * 0.003;
      const raise = folds * undulation * (0.5 + 0.5 * v) + hem;
      const x = base.x + width * ((u - 0.5) * (1 - 0.06 * v)) + 0.009 * Math.sin(v * 7 + u * 3);
      vertices.setXYZ(i, x, base.y + tangent.z * raise, Math.min(depthLimit, base.z - tangent.y * raise));
      uv.setXY(i, u * width * 11, v * length * 11);
    }
  }
  geometry.computeVertexNormals();
  const material = textile(color, texture);
  material.side = THREE.DoubleSide;
  root.add(new THREE.Mesh(geometry, material));
}

export function finishCreamUpholstery(template, type) {
  const root = template.clone(true);
  const texture = weaveTexture();
  // Measurements are in the original Seoul models' local coordinates, before layout scale and rotation.
  if (type === "sofa") {
    root.getObjectByName("seoul-sofa-accent")?.removeFromParent();
    cushion(root, texture, {
      color: 0xbda084, center: [-0.68, 0.661, -0.042], size: [0.35, 0.34, 0.15], tilt: -0.33, angle: 0.17,
    });
    cushion(root, texture, {
      color: 0xe0cfb6, center: [0.65, 0.655, -0.073], size: [0.35, 0.32, 0.136], tilt: -0.32, angle: -0.22,
    });
    throwBlanket(root, texture, {
      color: 0xb29a81, center: 0.45, width: 0.42, depthLimit: 0.469, folds: 0.008,
      section: [[0.525, 0.015], [0.52, 0.29], [0.51, 0.387], [0.483, 0.437], [0.411, 0.454], [0.288, 0.464], [0.161, 0.458]],
    });
  } else {
    cushion(root, texture, {
      color: 0xbea384, center: [0.04, 0.663, -0.403], size: [0.52, 0.248, 0.126], tilt: -0.54, angle: -0.08,
    });
    throwBlanket(root, texture, {
      color: 0xb8a187, center: -0.028, width: 1.26, depthLimit: 1.074, folds: 0.018,
      section: [[0.588, 0.455], [0.587, 0.73], [0.59, 0.91], [0.576, 1.007], [0.521, 1.052], [0.453, 1.065], [0.373, 1.07]],
    });
  }
  return root;
}
