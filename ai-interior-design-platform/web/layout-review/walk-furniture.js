import * as THREE from "./vendor/three.module.min.js";
import { GLTFLoader } from "./vendor/addons/loaders/GLTFLoader.js";
import { isDiningTable } from "./scene.js";
import { finishCreamUpholstery } from "./walk-cream-textiles.js";
import { makeCreamV6Sofa } from "./walk-cream-v6-sofa.js?v=cream-v6-3";

function assetType(item) {
  const key = `${item.name} ${item.id}`;
  if (/沙发|sofa/i.test(key)) return "sofa";
  if ((/床|(?:^|[-_])bed\b/i.test(key) && !/床头|床边|床尾|bedside/i.test(key)) && Math.min(item.widthM, item.depthM) > 0.70) return "bed";
  if (/餐椅|dining[-_ ]?chair/i.test(key)) return "dining-chair";
  if (isDiningTable(item) || /dining[-_ ]?table/i.test(item.id)) {
    if (item.shape === "rectangular" || Math.max(item.widthM, item.depthM) / Math.min(item.widthM, item.depthM) > 1.2) return "dining-table";
  }
  if (/茶几|coffee[-_ ]?table/i.test(key)) return "coffee-table";
  if (/盆栽|绿植|(?:^|[-_])plant\b/i.test(key)) return "plant";
  return null;
}

export async function loadWalkFurniture({ cream = false } = {}) {
  const loader = new GLTFLoader();
  const files = {
    sofa: "seoul-sofa", bed: "seoul-bed", "dining-chair": "seoul-dining-chair",
    "dining-table": "seoul-dining-table", "coffee-table": "studio-coffee-table", plant: "studio-plant",
  };
  const creamFiles = { sofa: "cream-crescent-sofa", "dining-chair": "cream-arc-chair" };
  const load = (name) => loader.loadAsync(new URL(`./assets/models/${name}.glb`, import.meta.url).href);
  const results = await Promise.allSettled(Object.entries(files).map(async ([type, file]) => {
    if (cream && creamFiles[type]) {
      const preferred = await load(creamFiles[type]).catch(() => null);
      if (preferred) return [type, { scene: preferred.scene, creamVariant: true }];
    }
    const scene = type === "plant" ? await load(file).catch(() => load("seoul-plant")) : await load(file);
    return [type, { scene: scene.scene, creamVariant: false }];
  }));
  const entries = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  const models = new Map(entries);
  const creamModels = new Map();
  return {
    create(item, { facing, appearance } = {}) {
      const type = assetType(item);
      if (appearance?.cream && type === "coffee-table" && Math.max(item.widthM, item.depthM) >= 0.73 &&
          Math.min(item.widthM, item.depthM) >= 0.39 && item.heightM >= 0.18) return null;
      const model = models.get(type);
      if (!model) return null;
      let template = model.scene;
      if (type === "sofa" && model.creamVariant && appearance?.visualProfile === "cream-v6") {
        if (!creamModels.has("cream-v6-sofa")) creamModels.set("cream-v6-sofa", makeCreamV6Sofa(template));
        template = creamModels.get("cream-v6-sofa");
      } else if (appearance?.cream && !model.creamVariant && (type === "sofa" || type === "bed")) {
        if (!creamModels.has(type)) creamModels.set(type, finishCreamUpholstery(template, type));
        template = creamModels.get(type);
      }
      const rotated = new THREE.Group();
      rotated.add(template.clone(true));
      const w = item.widthM;
      const d = item.depthM;
      if ((type === "bed" && w > d) || ((type === "sofa" || type === "dining-table") && d > w)) rotated.rotation.y = Math.PI / 2;
      if (type === "coffee-table" && w > d) rotated.rotation.y = Math.PI / 2;
      if (type === "dining-chair" && facing && Math.abs(w / d - 1) <= 0.05 && Math.hypot(...facing) > 0.04) {
        rotated.rotation.y = Math.atan2(...facing) + item.rotationRad;
      }
      const bounds = new THREE.Box3().setFromObject(rotated, type === "dining-chair" && Boolean(facing));
      const size = bounds.getSize(new THREE.Vector3());
      if (!(size.x > 0 && size.y > 0 && size.z > 0)) return null;
      const center = bounds.getCenter(new THREE.Vector3());
      rotated.position.set(-center.x, -bounds.min.y, -center.z);
      const group = new THREE.Group();
      group.add(rotated);
      group.position.set(item.center[0], item.bottomM, item.center[1]);
      group.rotation.y = -item.rotationRad;
      group.scale.set(w / size.x, item.heightM / size.y, d / size.z);
      const meshes = [];
      group.traverse((mesh) => {
        if (!mesh.isMesh) return;
        const original = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const cloned = original.map((material) => {
          const finish = material.clone();
          if (type === "sofa" && /fabric|piping|accent/.test(finish.name)) {
            finish.normalScale?.multiplyScalar(1.65);
            if (finish.name === "accent") finish.color.setHex(appearance?.cream ? 0xb99877 : 0x8e8c75);
            finish.roughness = 0.98;
          }
          if (appearance?.cream && ["sofa", "bed", "dining-chair"].includes(type)) {
            if (finish.name === "fabric") finish.color.setHex(type === "sofa" ? 0xe1cfb6 : 0xd6c2a6);
            if (finish.name === "piping") finish.color.setHex(0xc1ac91);
            if (finish.name === "linen") finish.color.setHex(0xeee0c9);
          }
          return finish;
        });
        mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
        mesh.userData = { id: item.id, walkAsset: true, materialColors: cloned.map((material) => material.color?.getHex()) };
        meshes.push(mesh);
      });
      return { group, meshes };
    },
    dispose() {
      const resources = new Set();
      const templates = [...Array.from(models.values(), ({ scene }) => scene), ...creamModels.values()];
      for (const model of templates) model.traverse((mesh) => {
        if (!mesh.isMesh) return;
        resources.add(mesh.geometry);
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          resources.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
        }
      });
      for (const resource of resources) resource.dispose();
      models.clear();
      creamModels.clear();
    },
  };
}
