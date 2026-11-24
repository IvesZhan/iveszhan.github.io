import * as THREE from "./vendor/three.module.min.js";

const finishes = {
  cream: [0xf4e8d6, 0xc39770, 0xe4d5bf, 0xd8cfc0],
  modern: [0xeeeae2, 0xae8e71, 0xcec8b8, 0x645b51],
  wood: [0xeee4d5, 0xae7d52, 0xd3bfa8, 0x71573d],
  wabi_sabi: [0xe6dac7, 0xab8b71, 0xc2b39e, 0x756556],
  vintage: [0xece4d2, 0x9e6e4a, 0xd0b990, 0x604733],
  modern_luxury: [0xf1eee6, 0xb3a28b, 0xd8d4c7, 0x655548],
  italian: [0xe6e2d9, 0x9b816b, 0xbab0a3, 0x554b42],
  new_chinese: [0xf1e8d8, 0x8e6547, 0xd9ccbc, 0x654a3b],
  french: [0xf5eee3, 0xc29b75, 0xd8cbb7, 0x84735a],
  scandinavian: [0xf4f0e6, 0xc5a176, 0xded8c9, 0x716451],
  industrial: [0xded9cf, 0x886f5b, 0xb1ada4, 0x4f4e49],
  american: [0xece1d2, 0xac7b59, 0xd2c2ad, 0x735846],
};

function swatch(color) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 2;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, 2, 2);
  }
  return canvas;
}

function materialTint(color, strength) {
  return new THREE.Color(0xffffff).lerp(new THREE.Color(color), strength).getHex();
}

export function createWalkAppearance(styleId, onChanged, { visualProfile } = {}) {
  const cream = styleId === "cream";
  const v6 = cream && visualProfile === "cream-v6";
  const palette = v6 ? [0xf5d9bb, 0xca9e73, 0xddc5ab, 0xd2bfaa] : (finishes[styleId] || finishes.cream);
  const [wall, wood, tile, trim] = palette;
  const loader = new THREE.ImageLoader();
  const textures = [];
  const pending = [];
  const normalPlaceholder = swatch("#8080ff");
  const roughnessPlaceholder = swatch("#dddddd");
  let disposed = false;

  function texture(name, placeholder, colorSpace) {
    const map = new THREE.CanvasTexture(placeholder);
    map.colorSpace = colorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 8;
    textures.push(map);
    const url = new URL(`./assets/finishes/${name}.jpg`, import.meta.url);
    pending.push(new Promise((settle) => {
      loader.load(url.href, (source) => {
        settle();
        if (disposed) return;
        // WebGL allocates immutable storage at the dimensions of the initial swatch.
        map.dispose();
        map.source = new THREE.Source(source);
        map.needsUpdate = true;
        onChanged?.();
      }, undefined, () => settle());
    }));
    return map;
  }

  function surface(name, { color, fallback, repeatM, roughness, relief }) {
    return {
      color, repeatM, roughness,
      map: texture(`${name}-color`, swatch(fallback), THREE.SRGBColorSpace),
      roughnessMap: texture(`${name}-roughness`, roughnessPlaceholder, THREE.NoColorSpace),
      normalMap: texture(`${name}-normal`, normalPlaceholder, THREE.NoColorSpace),
      normalScale: new THREE.Vector2(relief, relief),
    };
  }

  const parquet = surface("oak-plank", {
    color: materialTint(wood, 0.2), fallback: "#c0ad91", repeatM: [2.08, 2.08], roughness: 0.85, relief: 0.28,
  });
  const wetTile = surface("wet-tile", {
    color: materialTint(tile, 0.26), fallback: "#d5ccbd", repeatM: [1.2, 1.2], roughness: 0.9, relief: 0.51,
  });
  const plaster = surface("chalk-plaster", {
    color: materialTint(wall, v6 ? 0.76 : 0.52), fallback: "#eeebe4", repeatM: [1, 1], roughness: 0.98, relief: 0.06,
  });
  const stone = surface("ivory-stone", {
    color: materialTint(tile, 0.12), fallback: "#d8d2c7", repeatM: [1.35, 1.35], roughness: 0.82, relief: 0.14,
  });
  const millwork = surface("oak-veneer", {
    color: materialTint(wood, 0.27), fallback: "#ad9779", repeatM: [1.8, 1.8], roughness: 0.88, relief: 0.23,
  });
  const porcelain = {
    ...stone, color: materialTint(v6 ? 0xf1ba90 : 0xe5cdb4, v6 ? 0.70 : 0.58), roughness: v6 ? 0.55 : 0.61,
    normalScale: new THREE.Vector2(0.11, 0.11), tileSizeM: 0.90,
  };
  const rug = cream ? surface("woven-cream-rug", {
    color: v6 ? 0xdbc0a6 : materialTint(0xc8af95, 0.28), fallback: "#c8b6a0",
    repeatM: [1.7, 1.7], roughness: 0.97, relief: v6 ? 0.75 : 0.62,
  }) : null;
  const travertine = v6 ? texture("v6-honed-travertine-color", swatch("#d8bc99"), THREE.SRGBColorSpace) : null;
  const furnitureStone = travertine ? {
    color: 0xfffaf2, repeatM: [0.70, 0.70], roughness: 0.66, map: travertine, bumpMap: travertine, bumpScale: 0.00085,
  } : stone;

  return {
    cream, visualProfile, wall, trim, ceiling: v6 ? 0xf6e5ce : cream ? 0xf3eadc : 0xf6f3ed,
    stone, furnitureStone, wood: millwork, rug,
    ready: Promise.all(pending),
    floor(room) {
      const key = `${room?.name} ${room?.id}`;
      if (/卫|bath|toilet/i.test(key) || (!cream && /厨|kitchen/i.test(key))) return wetTile;
      const bedroom = /卧|儿童|bed/i.test(key) && !/过道|走廊|corridor|hall/i.test(key);
      return cream && !bedroom ? porcelain : parquet;
    },
    wallFinish(room) {
      return /卫|浴|bath|toilet/i.test(`${room?.name} ${room?.id}`) ? wetTile : plaster;
    },
    dispose() {
      disposed = true;
      textures.forEach((texture) => texture.dispose());
    },
  };
}
