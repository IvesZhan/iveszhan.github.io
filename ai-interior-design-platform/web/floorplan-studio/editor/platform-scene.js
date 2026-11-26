import { containsPoint, loadLayoutScene } from "../../layout-review/scene.js?v=studio-version-save";
import { createWalkNavigation } from "../../layout-review/walk-navigation.js?v=cream-v7";
import { adaptJindiDesign } from "./jindi-adapter.js";

const validType = new Set([
  "bed", "crib", "nightstand", "wardrobe", "dresser", "desk", "chair", "bookshelf", "baycushion",
  "sofa", "cornersofa", "armchair", "beanbag", "coffeetable", "sidetable", "tvstand", "rug",
  "shoecab", "floorlamp", "plant", "table", "roundtable", "island", "barstool", "counter", "stove",
  "ksink", "fridge", "cabinet", "toilet", "vanity", "shower", "bathtub", "washer", "waterheater",
  "tv", "aircon", "acwall", "dishwasher", "ovencol", "dryer", "purifier", "officechair", "piano", "treadmill",
]);
const validColor = (value) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
const defaultHeights = {
  bed: 1.08, crib: 0.92, nightstand: 0.52, wardrobe: 2.36, dresser: 0.81, desk: 0.75,
  chair: 0.83, bookshelf: 1.8, sofa: 0.85, cornersofa: 0.85, armchair: 0.85, coffeetable: 0.4,
  sidetable: 0.52, tvstand: 0.38, rug: 0.013, shoecab: 2.3, floorlamp: 1.6, plant: 1.25, table: 0.74,
  roundtable: 0.74, island: 0.9, barstool: 0.88, counter: 0.86, stove: 0.023, ksink: 0.285,
  fridge: 1.8, cabinet: 0.9, toilet: 0.8, vanity: 1.15, shower: 2.05, bathtub: 0.6, washer: 0.85,
  waterheater: 0.55, tv: 0.8, dishwasher: 0.85, dryer: 0.85,
};

function defaultType({ shape, name, id }) {
  if (shape === "round") return "roundtable";
  const value = `${name} ${id}`;
  return [
    [/床头|nightstand/i, "nightstand"], [/床|\bbed\b/i, "bed"], [/沙发|sofa/i, "sofa"],
    [/衣柜|wardrobe/i, "wardrobe"], [/电视柜|tvstand/i, "tvstand"], [/鞋柜|玄关柜|shoecab/i, "shoecab"],
    [/吧椅|barstool/i, "barstool"], [/椅|chair/i, "chair"], [/茶几|coffeetable/i, "coffeetable"],
    [/餐桌|dining.?table/i, "table"], [/书桌|desk/i, "desk"], [/地毯|rug/i, "rug"],
    [/冰箱|fridge/i, "fridge"], [/橱柜|counter/i, "counter"], [/马桶|座便|toilet/i, "toilet"],
    [/台盆|浴室柜|vanity/i, "vanity"], [/淋浴|shower/i, "shower"], [/绿植|盆栽|plant/i, "plant"],
  ].find(([pattern]) => pattern.test(value))?.[1] ?? "cabinet";
}

export function createPlatformDesign(source, { readOnly, styleId }) {
  const scene = loadLayoutScene(source);
  const rawRooms = new Map(source.rooms.map((room) => [room.id, room]));
  const rawItems = new Map((source.items ?? []).map((item) => [item.id, item]));
  scene.rooms.forEach((room) => {
    const initial = rawRooms.get(room.id);
    const name = `${room.id} ${room.name}`;
    room.editorMaterial = initial.editorMaterial ??
      (/卫|沐浴|bath/i.test(name) ? "antislip" : /卧|bedroom|master|child/i.test(name) ? "wood" : "tile800");
  });
  scene.items.forEach((item) => {
    const initial = rawItems.get(item.id);
    item.editorType = validType.has(initial.editorType) ? initial.editorType : defaultType(item);
    item.editorColor = validColor(initial.editorColor) ? initial.editorColor : styleId === "cream" ? "#d6c2a6" : "#b9b8af";
    if (Number.isFinite(initial.editorRotationDeg)) item.editorRotationDeg = initial.editorRotationDeg;
  });
  const wallHeights = scene.walls.map(({ heightM }) => heightM).sort((a, b) => a - b);
  const ceilingHeightM = wallHeights[Math.floor(wallHeights.length / 2)];
  const design = adaptJindiDesign({ ...scene, source: { ceilingHeightM } });
  design.furniture.forEach((item, index) => {
    item.elevation = scene.items[index].bottomM;
    item.modelHeight = scene.items[index].heightM;
  });
  if (scene.rooms.length) {
    const navigation = createWalkNavigation(scene);
    for (const room of scene.rooms) {
      if (room.excludeFromRoutes || Object.hasOwn(design.walkFrames, room.id)) continue;
      const position = navigation.spawn(room.id);
      if (!position) continue;
      const polygon = room.polygon;
      const target = polygon.reduce((farthest, point) =>
        Math.hypot(point[0] - position[0], point[1] - position[1]) >
        Math.hypot(farthest[0] - position[0], farthest[1] - position[1]) ? point : farthest, polygon[0]);
      const height = Math.min(1.55, Math.max(.40, ceilingHeightM - .15));
      Object.defineProperty(design.walkFrames, room.id, {
        enumerable: true,
        value: { positionM: [position[0], height, position[1]], targetM: [target[0], height, target[1]] },
      });
    }
    const entryStart = navigation.spawn();
    if (entryStart) design.firstWalkRoom = navigation.roomAt(entryStart)?.id;
    design.walkRoomAt = (point) => navigation.roomAt(point)?.id;
    design.walkNavigation = (state) => createWalkNavigation(mergePlatformScene(scene, design, state));
  }
  return { ...design, title: scene.name, embedded: true, readOnly, styleId };
}

export function mergePlatformScene(source, design, state) {
  const canonical = structuredClone(source);
  const initialRoomById = new Map(design.rooms.map((room) => [room.id, room]));
  canonical.rooms.forEach((room) => {
    const initial = initialRoomById.get(room.id);
    const updated = state.rooms[room.id];
    if (updated.name !== initial.name) room.name = updated.name;
    if (updated.mat !== initial.mat) room.editorMaterial = updated.mat;
  });

  const existing = new Map((canonical.items ?? []).map((item) => [item.id, item]));
  const initialItemById = new Map(design.furniture.map((item) => [item.id, item]));
  const modified = state.furniture.map((item) => {
    const original = existing.get(item.id);
    const display = initialItemById.get(item.id);
    const center = [
      display && item.cx === display.cx ? original.center[0] : item.cx / 1000,
      display && item.cy === display.cy ? original.center[1] : item.cy / 1000,
    ];
    const changedPosition = !display || item.cx !== display.cx || item.cy !== display.cy;
    const roomId = changedPosition ? canonical.rooms.find(({ polygon }) => containsPoint(center, polygon))?.id ?? null : original.roomId;
    const rotation = !display || item.rot !== display.rot ? item.rot * Math.PI / 180 : original.rotationRad;
    const width = !display || item.w !== display.w ? item.w / 1000 : original.widthM;
    const depth = !display || item.d !== display.d ? item.d / 1000 : original.depthM;
    const edited = original ? { ...original } : {
      id: item.id, heightM: defaultHeights[item.type] ?? 0.8, bottomM: item.elevation ?? 0,
      ...(item.type === "roundtable" ? { shape: "round" } : {}),
    };
    if (changedPosition) Object.assign(edited, { center, roomId });
    if (!display || item.name !== display.name) edited.name = item.name;
    if (!display || item.rot !== display.rot) {
      edited.rotationRad = rotation;
      if (Object.hasOwn(edited, "editorRotationDeg")) edited.editorRotationDeg = item.rot;
    }
    if (!display || item.w !== display.w) edited.widthM = width;
    if (!display || item.d !== display.d) edited.depthM = depth;
    if (!display || item.color !== display.color) edited.editorColor = item.color;
    if (!display || item.type !== display.type) edited.editorType = item.type;
    return edited;
  });
  if (modified.length || Object.hasOwn(canonical, "items")) canonical.items = modified;
  loadLayoutScene(canonical);
  return canonical;
}
