const exterior = new URL('../../layout-review/assets/environment/kloofendal-1k.hdr', import.meta.url);

export function createCreamDaylightBackdrop({ THREE, scene, ground }) {
  let texture;
  let loading;
  let enabled = false;

  function show() {
    if (!enabled) return;
    scene.background = texture;
    scene.backgroundIntensity = 0.74;
    scene.backgroundBlurriness = 0.06;
    ground.visible = false;
  }

  return function updateBackdrop(daylightWalk) {
    enabled = daylightWalk;
    ground.visible = true;
    scene.backgroundIntensity = 1;
    scene.backgroundBlurriness = 0;
    if (!enabled) return;
    if (texture) show();
    else if (!loading) {
      loading = import('three/addons/loaders/RGBELoader.js').then(({ RGBELoader }) => {
        return new RGBELoader().loadAsync(exterior.href);
      }).then((environment) => {
        environment.mapping = THREE.EquirectangularReflectionMapping;
        texture = environment;
        show();
      }).catch(() => { /* The neutral sky color remains available. */ });
    }
  };
}

let paintedCanvas;

function canvasMaterial(THREE) {
  if (paintedCanvas) return paintedCanvas;
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 640;
  const context = canvas.getContext('2d');
  const background = context.createLinearGradient(60, 0, 640, 640);
  background.addColorStop(0, '#e8dcc8');
  background.addColorStop(0.55, '#f0e8d6');
  background.addColorStop(1, '#d1bfab');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const forms = [
    ['#b79b81', 0.71, [0, 326], [126, 270, 234, 208, 340, 286], [520, 441, 700, 265, 900, 332]],
    ['#eee2ce', 0.86, [0, 394], [145, 459, 275, 316, 531, 357], [688, 398, 748, 482, 900, 421]],
    ['#8f8c76', 0.44, [0, 517], [194, 465, 314, 466, 481, 495], [711, 548, 821, 470, 900, 501]],
    ['#ad957c', 0.54, [0, 594], [114, 563, 227, 619, 462, 568], [628, 550, 750, 565, 900, 594]],
  ];
  for (const [color, opacity, start, left, right] of forms) {
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.beginPath();
    context.moveTo(...start);
    context.bezierCurveTo(...left);
    context.bezierCurveTo(...right);
    context.lineTo(900, 640);
    context.lineTo(0, 640);
    context.closePath();
    context.fill();
  }
  let seed = 46;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  for (let fiber = 0; fiber < 34000; fiber += 1) {
    context.fillStyle = random() > 0.49 ? '#fff8e9' : '#5f5448';
    context.globalAlpha = 0.06 + random() * 0.10;
    context.fillRect(random() * 900, random() * 640, 0.6 + random() * 1.6, 0.8);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  paintedCanvas = new THREE.MeshStandardMaterial({ map, roughness: 0.94 });
  return paintedCanvas;
}

export function addCreamLivingArtwork({ THREE, group, walls, sofa, wx, wz }) {
  if (!sofa) return;
  const width = 1.08;
  const height = 0.77;
  const angle = -sofa.rot * Math.PI / 180;
  const [nx, nz] = [Math.sin(angle), Math.cos(angle)];
  const axis = Math.abs(nx) > Math.abs(nz) ? 0 : 1;
  const across = 1 - axis;
  const direction = Math.sign(axis === 0 ? nx : nz);
  const origin = [sofa.cx, sofa.cy];
  let face;
  let closest = 1050;
  for (const wall of walls) {
    if (wall[4] === 'low' || wall[5] < 2 || wall[axis + 2] - wall[axis] > 0.45 * 1000) continue;
    if (origin[across] - width * 510 < wall[across] || origin[across] + width * 510 > wall[across + 2]) continue;
    const edge = wall[axis + (direction > 0 ? 2 : 0)];
    const gap = (origin[axis] - edge) * direction;
    if (gap < 0 || gap >= closest) continue;
    closest = gap;
    face = edge;
  }
  if (face === undefined) return;
  const center = [...origin];
  center[axis] = face + direction * 8;
  const artwork = new THREE.Group();
  artwork.position.set(wx(center[0]), 1.54, wz(center[1]));
  artwork.rotation.y = axis === 0 ? direction * Math.PI / 2 : direction > 0 ? 0 : Math.PI;

  const frameDepth = 0.034;
  const border = 0.023;
  const oak = new THREE.MeshStandardMaterial({ color: '#a48a70', roughness: 0.8 });
  for (const side of [-1, 1]) {
    const vertical = new THREE.Mesh(new THREE.BoxGeometry(border, height, frameDepth), oak);
    vertical.position.set(side * (width - border) / 2, 0, frameDepth / 2);
    const horizontal = new THREE.Mesh(new THREE.BoxGeometry(width - 2 * border, border, frameDepth), oak);
    horizontal.position.set(0, side * (height - border) / 2, frameDepth / 2);
    vertical.castShadow = horizontal.castShadow = true;
    if (side === 1) horizontal.userData.creamOwnedMaterial = true;
    artwork.add(vertical, horizontal);
  }
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(width - 2 * border, height - 2 * border), canvasMaterial(THREE));
  painting.position.z = 0.024;
  painting.receiveShadow = true;
  artwork.add(painting);
  group.add(artwork);
}
