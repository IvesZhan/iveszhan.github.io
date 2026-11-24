import * as THREE from "./vendor/three.module.min.js";

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

export function createWalkContacts() {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const rectangular = contactTexture(false);
  const radial = contactTexture(true);
  const material = (map, opacity) => new THREE.MeshBasicMaterial({
    color: 0x392819, map, opacity, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1,
  });
  const heavy = material(rectangular, 0.30);
  const light = material(radial, 0.20);

  function add(item, width, depth, finish) {
    const shadow = new THREE.Mesh(geometry, finish);
    shadow.position.set(item.center[0], 0.015, item.center[1]);
    shadow.rotation.set(-Math.PI / 2, 0, -item.rotationRad);
    shadow.scale.set(width, depth, 1);
    group.add(shadow);
  }

  return {
    group,
    update(scene, roomIds) {
      group.clear();
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
      rectangular.dispose();
      radial.dispose();
    },
  };
}
