import { HalfFloatType, WebGLRenderTarget } from "./vendor/three.module.min.js";
import { EffectComposer } from "./vendor/addons/postprocessing/EffectComposer.js";
import { GTAOPass } from "./vendor/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "./vendor/addons/postprocessing/OutputPass.js";
import { RenderPass } from "./vendor/addons/postprocessing/RenderPass.js";

class InteriorGTAOPass extends GTAOPass {
  setSize(width, height) {
    super.setSize(Math.max(1, Math.ceil(width * 0.6)), Math.max(1, Math.ceil(height * 0.6)));
  }

  _overrideVisibility() {
    super._overrideVisibility();
    this.scene.traverseVisible((object) => {
      if (!object.isMesh || (!object.userData.excludeWalkOcclusion && (!object.material.transparent || object.material.depthWrite))) return;
      object.visible = false;
      this._visibilityCache.push(object);
    });
  }
}

export function createWalkPost(renderer, world, camera, { cream = false, refined = false } = {}) {
  if (!renderer.extensions.has("EXT_color_buffer_float") || window.matchMedia("(pointer: coarse)").matches) return null;
  const gl = renderer.getContext();
  const availableSamples = Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA16F, gl.SAMPLES) || []);
  const samples = Math.max(0, ...availableSamples.filter((value) => value <= 4));
  const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(1);
  const geometry = new RenderPass(world, camera);
  const occlusion = new InteriorGTAOPass(world, camera, 64, 64);
  const creamOcclusion = { radius: 0.35, thickness: 0.24, distanceFallOff: 0.83, samples: 16, scale: 1.16 };
  if (refined) Object.assign(creamOcclusion, { radius: 0.27, thickness: 0.16, scale: 1.02 });
  occlusion.updateGtaoMaterial(cream ? creamOcclusion
    : { radius: 0.49, thickness: 0.36, distanceFallOff: 0.78, samples: 12, scale: 1.0 });
  occlusion.updatePdMaterial({ radius: cream ? 4 : 6, samples: 12 });
  occlusion.blendIntensity = cream && !refined ? 1 : 0.9;
  const output = new OutputPass();
  for (const pass of [geometry, occlusion, output]) composer.addPass(pass);
  return {
    resize(width, height) {
      const maxWidth = refined ? 2240 : 1650;
      const scale = Math.min(1.35, renderer.getPixelRatio(), maxWidth / width);
      composer.setSize(Math.round(width * scale), Math.round(height * scale));
    },
    render() { composer.render(); },
    dispose() {
      occlusion.blendMaterial.dispose();
      occlusion.gtaoMaterial.dispose();
      occlusion.dispose();
      output.dispose();
      composer.dispose();
    },
  };
}
