import * as THREE from "./vendor/three.module.min.js";

const toneMappingFunctions = new Map([
  [THREE.LinearToneMapping, "LinearToneMapping"],
  [THREE.ReinhardToneMapping, "ReinhardToneMapping"],
  [THREE.CineonToneMapping, "CineonToneMapping"],
  [THREE.ACESFilmicToneMapping, "ACESFilmicToneMapping"],
  [THREE.AgXToneMapping, "AgXToneMapping"],
  [THREE.NeutralToneMapping, "NeutralToneMapping"],
]);

function projectionMaterial(texture, yaw, renderer) {
  const toneMapping = toneMappingFunctions.get(renderer.toneMapping);
  return new THREE.RawShaderMaterial({
    name: "WalkPanoramaProjection",
    uniforms: {
      sceneCube: { value: texture },
      yaw: { value: yaw },
      toneMappingExposure: { value: renderer.toneMappingExposure },
    },
    vertexShader: `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 panoramaUV;

      void main() {
        panoramaUV = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform samplerCube sceneCube;
      uniform float yaw;
      varying vec2 panoramaUV;
      #include <tonemapping_pars_fragment>
      #include <colorspace_pars_fragment>

      void main() {
        float longitude = yaw - (panoramaUV.x - 0.5) * 6.283185307179586;
        // WebGL readback starts at the bottom row, which becomes the top of the JPEG.
        float latitude = (0.5 - panoramaUV.y) * 3.141592653589793;
        float horizontal = cos(latitude);
        vec3 ray = vec3(-sin(longitude) * horizontal, sin(latitude), -cos(longitude) * horizontal);
        vec3 color = textureCube(sceneCube, ray).rgb;
        ${toneMapping ? `color = ${toneMapping}(color);` : ""}
        gl_FragColor = sRGBTransferOETF(vec4(max(color, vec3(0.0)), 1.0));
      }
    `,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
}

async function encodeJpeg(pixels, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("当前浏览器无法编码全景图片。");
  try {
    const data = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
    context.putImageData(data, 0, 0);
    const jpeg = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
    if (!jpeg || jpeg.type !== "image/jpeg") throw new Error("全景图片编码失败。");
    return jpeg;
  } finally {
    canvas.width = canvas.height = 0;
  }
}

export async function captureWalkPanorama(renderer, scene, { position, yaw, width = 4096 }) {
  const location = position?.isVector3 ? position.toArray() : position;
  if (!Array.isArray(location) || location.length !== 3 || !location.every(Number.isFinite) || !Number.isFinite(yaw)) {
    throw new Error("当前视角没有可用的全景机位。");
  }
  if (!Number.isInteger(width) || width % 2 || width < 512 || width > 4096) {
    throw new Error("全景图片宽度须为 512 至 4096 之间的偶数。");
  }
  const gl = renderer.getContext();
  if (gl.isContextLost()) throw new Error("3D 画面正在恢复，请稍后再导出。");

  const height = width / 2;
  const faceSize = Math.ceil(width / 4);
  if (width > renderer.capabilities.maxTextureSize || faceSize > renderer.capabilities.maxCubemapSize) {
    throw new Error("当前设备的图形尺寸限制无法生成该全景。");
  }
  const cube = new THREE.WebGLCubeRenderTarget(faceSize, {
    type: renderer.extensions.has("EXT_color_buffer_float") ? THREE.HalfFloatType : THREE.UnsignedByteType,
    colorSpace: THREE.LinearSRGBColorSpace,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: false,
  });
  const output = new THREE.WebGLRenderTarget(width, height, { depthBuffer: false, colorSpace: THREE.NoColorSpace });
  const material = projectionMaterial(cube.texture, yaw, renderer);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const projected = new THREE.Mesh(geometry, material);
  projected.frustumCulled = false;
  const panorama = new THREE.Scene();
  panorama.add(projected);
  const camera = new THREE.CubeCamera(0.027, 100, cube);
  camera.position.set(...location);
  const pixels = new Uint8Array(width * height * 4);

  const target = renderer.getRenderTarget();
  const face = renderer.getActiveCubeFace();
  const mip = renderer.getActiveMipmapLevel();
  const xr = renderer.xr.enabled;
  const autoClear = renderer.autoClear;
  const autoClearColor = renderer.autoClearColor;
  const autoClearDepth = renderer.autoClearDepth;
  const { shadowMap } = renderer;
  const updateShadows = shadowMap.autoUpdate;
  const pendingShadows = shadowMap.needsUpdate;
  try {
    renderer.xr.enabled = false;
    renderer.autoClear = renderer.autoClearColor = renderer.autoClearDepth = true;
    shadowMap.autoUpdate = false;
    shadowMap.needsUpdate = pendingShadows || updateShadows;
    camera.update(renderer, scene);

    renderer.setRenderTarget(output);
    renderer.render(panorama, new THREE.Camera());
    renderer.readRenderTargetPixels(output, 0, 0, width, height, pixels);
    if (gl.isContextLost()) throw new Error("导出时 3D 画面中断，请恢复画面后重试。");
    if (pixels[3] !== 255 || pixels[pixels.length - 1] !== 255) {
      throw new Error("未能读取完整的全景画面，请重试。");
    }
  } finally {
    renderer.setRenderTarget(target, face, mip);
    renderer.xr.enabled = xr;
    renderer.autoClear = autoClear;
    renderer.autoClearColor = autoClearColor;
    renderer.autoClearDepth = autoClearDepth;
    shadowMap.autoUpdate = updateShadows;
    shadowMap.needsUpdate = pendingShadows;
    geometry.dispose();
    material.dispose();
    output.dispose();
    cube.dispose();
  }
  return encodeJpeg(pixels, width, height);
}
