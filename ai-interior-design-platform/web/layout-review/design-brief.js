const decimal = "\\d+(?:\\.\\d+)?";
const unit = "毫米|厘米|公分|米|mm|cm|m";
const count = "\\d+|十[一二两]?|[一二两三四五六七八九]";
const label = "长(?:度)?|宽(?:度)?|进深|深(?:度)?|直径";
const sofa = /沙发|\bsofa\b/i;
const diningTable = /餐桌|饭桌|圆桌|长方桌|矩形桌|方桌|\bdining[ -]table\b/i;
const livingRoom = /客厅|起居室|客餐厅|客厅餐厅|living|lounge/i;
const diningRoom = /餐厅|餐区|客餐厅|dining/i;
const namedSpace = /客餐厅|客厅|起居室|餐厅|餐区|(?:主|次|客)?卧(?:室)?(?:[一二三四1234])?|儿童房|卫生间|主卫|公卫|厨房|书房|玄关|过道|阳台|衣帽间|储物间/gu;
const round = /圆桌|圆餐桌|圆形.{0,3}(?:饭桌|餐桌)|(?:饭桌|餐桌).{0,4}圆形|[，,]圆形$|直径/u;
const rectangular = /长方桌|矩形桌|方桌|(?:长方形|矩形|方形).{0,3}(?:饭桌|餐桌)|(?:饭桌|餐桌).{0,4}(?:长方形|矩形|方形)|[，,](?:长方形|矩形|方形)$/u;
const uncertain = /不(?:要|用|放|做|选|能|超过|小于|大于)|别|取消|去掉|移除|保留(?:原|现有)|至少|最多|最大|最小|以内|以上|以下|大于|小于|大概|大约|差不多|左右|或者|或|到.{0,5}(?:米|厘米|毫米)|[-−]\s*\d/u;
const otherMeasurement = /之间|距离|离墙|离地|走道|净宽|座高|坐高|靠背高|高度|坐深|厚度|预算/u;
const otherDetail = /L\s*型|贵妃位|靠窗|靠墙|居中|对着|面对|朝向|品牌|颜色|材质|布艺|真皮|岩板|实木/iu;
const counts = new Map(["一", "二", "两", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
  .map((digit, index) => [digit, index > 1 ? index : index + 1]));

function normalize(value) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function objectKind(text) {
  const isSofa = sofa.test(text);
  const isTable = diningTable.test(text) || /餐(?:厅|区).{0,12}(?:[0-9]+|[二两三四五六七八九十])人桌/u.test(text);
  return isSofa === isTable ? null : isSofa ? "sofa" : "dining-table";
}

function splitRequests(text) {
  const continuation = new RegExp(`^(?:${label}|(?:${count})\\s*(?:人|座|把(?:餐)?椅)|(?:圆形|方形|长方形|矩形)$)`, "u");
  return text.split(/[。！？；;!?\r\n]+/u).flatMap((sentence) => {
    const clauses = [];
    for (const fragment of sentence.split(/[，,、]+/u)) {
      const piece = fragment.trim();
      if (!piece) continue;
      const prior = clauses.at(-1);
      if (prior && objectKind(prior) && !objectKind(piece) && continuation.test(piece)) {
        clauses[clauses.length - 1] = prior + "，" + piece;
      } else {
        clauses.push(piece);
      }
    }
    return clauses;
  });
}

function explicitRooms(text, rooms) {
  const input = normalize(text);
  const names = rooms.map((room) => ({ room, name: normalize(room.name) })).filter(({ name }) => name && input.includes(name));
  return names.filter(({ name }) => !names.some((other) => other.name !== name && other.name.includes(name) &&
    !input.replaceAll(other.name, "").includes(name))).map(({ room }) => room);
}

function splitFurnitureList(source, rooms) {
  if (objectKind(source) || uncertain.test(source)) return [source];
  const parts = source.split(/\s*(?:以及|并且|同时|再加|另加|和)\s*/u);
  if (parts.length !== 2 || !parts.every(objectKind) || objectKind(parts[0]) === objectKind(parts[1])) return [source];
  const [first, second] = parts;
  const shared = explicitRooms(first, rooms);
  return [first, shared.length === 1 && ![...second.matchAll(namedSpace)].length && !explicitRooms(second, rooms).length
    ? `${shared[0].name}${second}` : second];
}

function targetRooms(text, kind, rooms, items) {
  const explicit = explicitRooms(text, rooms);
  if (explicit.length) return explicit;
  const aliases = [...text.matchAll(namedSpace)].map(([name]) => name);
  const inferred = kind === "sofa" ? livingRoom : diningRoom;
  if (aliases.length) {
    if (aliases.every((alias) => (kind === "sofa" ? /^(客厅|起居室|客餐厅)$/u : /^(餐厅|餐区|客餐厅)$/u).test(alias))) {
      return rooms.filter((room) => inferred.test(room.name));
    }
    return [];
  }
  const itemRoomIds = new Set(items.filter((item) => objectKind(item.name) === kind).map((item) => item.roomId));
  const occupied = rooms.filter((room) => itemRoomIds.has(room.id));
  return occupied.length ? occupied : rooms.filter((room) => inferred.test(room.name));
}

function asMeters(amount, units) {
  if (!units) return null;
  const divisor = /^(mm|毫米)$/iu.test(units) ? 1000 : /^(cm|厘米|公分)$/iu.test(units) ? 100 : 1;
  const meters = Number(amount) / divisor;
  return Number.isFinite(meters) && meters >= 0.2 && meters <= 12 ? meters : null;
}

function parseDimensions(text, kind, shape) {
  const measurement = new RegExp(`(${decimal})\\s*(${unit})(?![a-z0-9平方])`, "giu");
  const sizedPair = new RegExp(`(${decimal})\\s*(${unit})?\\s*[x×*乘]\\s*(${decimal})\\s*(${unit})?`, "iu");
  const labeledPair = new RegExp(`长(?:度)?\\s*(?:[:=为是]\\s*)?(${decimal})\\s*(${unit})?\\s*[，,]?\\s*(?:宽(?:度)?|进深|深(?:度)?)\\s*(?:[:=为是]\\s*)?(${decimal})\\s*(${unit})?`, "iu");
  const matches = [...text.matchAll(measurement)];
  const pair = text.match(sizedPair) || text.match(labeledPair);
  if (pair) {
    const widthM = asMeters(pair[1], pair[2] || pair[4]);
    const depthM = asMeters(pair[3], pair[4] || pair[2]);
    if (!widthM || !depthM || matches.length > 2 ||
      (shape === "round" && Math.abs(widthM - depthM) > 0.005)) return null;
    return { widthM, depthM };
  }
  if (!matches.length) return {};
  const prefix = new RegExp(`(${label})\\s*(?:[:=为是约]\\s*)?$`, "u");
  const suffix = new RegExp(`^\\s*(${label})(?!\\s*[:=为是约])`, "u");
  const dimensions = new Map();
  let unlabeled;
  let consumedSuffixEnd = 0;
  for (const match of matches) {
    const [literal, amount, units] = match;
    const matchIndex = match.index;
    const before = text.slice(consumedSuffixEnd, matchIndex).match(prefix)?.[1];
    const after = before ? null : text.slice(matchIndex + literal.length).match(suffix);
    const marker = before || after?.[1];
    if (after) consumedSuffixEnd = matchIndex + literal.length + after[0].length;
    const meters = asMeters(amount, units);
    if (!meters) return null;
    if (!marker) {
      if (unlabeled) return null;
      unlabeled = meters;
      continue;
    }
    const key = marker === "直径" ? "diameter" : marker[0] === "长" ? "length" : marker[0] === "宽" ? "width" : "depth";
    if (dimensions.has(key) && dimensions.get(key) !== meters) return null;
    dimensions.set(key, meters);
  }
  if (unlabeled && (dimensions.size > 1 || (dimensions.size && !dimensions.has("depth")))) return null;
  const length = dimensions.get("length");
  const width = dimensions.get("width");
  const depth = dimensions.get("depth");
  const diameter = dimensions.get("diameter");
  if (diameter && (kind !== "dining-table" || dimensions.size > 1)) return null;
  if (shape === "round") {
    const sides = [diameter, length, width, depth, unlabeled].filter(Boolean);
    if (sides.length && sides.some((side) => Math.abs(side - sides[0]) > 0.005)) return null;
    return sides.length ? { widthM: sides[0], depthM: sides[0] } : {};
  }
  if (length && width && depth && Math.abs(width - depth) > 0.005) return null;
  const widthM = length || width || unlabeled;
  const depthM = depth || (length ? width : undefined);
  return { ...(widthM ? { widthM } : {}), ...(depthM ? { depthM } : {}) };
}

function parseRequirements(text, kind) {
  const isRound = kind === "dining-table" && round.test(text);
  const isRectangular = kind === "dining-table" && rectangular.test(text);
  if (uncertain.test(text) || (isRound && isRectangular)) return null;
  const shape = isRound ? "round" : isRectangular ? "rectangular" : undefined;
  const seating = new RegExp(`(?<![\\d.])(${count})\\s*(?:人(?:位|座)?|座|把(?:餐)?椅)`, "gu");
  const seatCounts = kind === "dining-table" ? [...text.matchAll(seating)].map(([, number]) => counts.get(number) ?? Number(number)) : [];
  const seats = seatCounts[0];
  if (seatCounts.some((value) => value < 2 || value > 12 || value !== seats)) return null;
  const unresolvedMeasurement = otherMeasurement.test(text);
  const dimensions = unresolvedMeasurement ? {} : parseDimensions(text, kind, shape);
  if (!dimensions) return null;
  const parsed = { ...dimensions, ...(shape ? { shape } : {}), ...(seats ? { seats } : {}) };
  if (!Object.keys(parsed).length) return null;
  return { ...parsed, ...(unresolvedMeasurement || otherDetail.test(text) ? { partial: true } : {}) };
}

export function parseDesignBrief(value, layout = {}) {
  const text = typeof value === "string" ? value.normalize("NFKC").slice(0, 3000) : "";
  const rooms = (layout?.rooms || []).filter((room) => !room.excludeFromRoutes);
  const items = layout?.items || [];
  const directives = new Map();
  const conflicts = new Set();
  const needsReview = [];
  function review(message, source, roomId) {
    const description = `${message} · ${source}`.slice(0, 180);
    if (!needsReview.some((entry) => entry.description === description && entry.roomId === roomId)) {
      needsReview.push({ ...(roomId ? { roomId } : {}), description });
    }
  }
  for (const source of splitRequests(text).flatMap((part) => splitFurnitureList(part, rooms))) {
    const kind = objectKind(source);
    const mentioned = explicitRooms(source, rooms);
    if (!kind) {
      review("需进一步确认需求", source, mentioned.length === 1 ? mentioned[0].id : undefined);
      continue;
    }
    const targets = targetRooms(source, kind, rooms, items);
    if (targets.length !== 1) {
      review(targets.length ? "请明确要调整的房间" : "户型中未能定位目标房间", source);
      continue;
    }
    const [{ id: roomId }] = targets;
    const requirements = parseRequirements(source, kind);
    if (!requirements || !Object.keys(requirements).length) {
      review("请确认家具尺寸、形状或座数要求", source, roomId);
      continue;
    }
    const { partial, ...fields } = requirements;
    if (partial) review("部分细节或摆位仍需确认", source, roomId);
    const key = `${roomId}:${kind}`;
    const prior = directives.get(key);
    if (conflicts.has(key)) {
      review("同一件家具的要求有冲突", source, roomId);
      continue;
    }
    if (prior && Object.entries(fields).some(([name, field]) => prior[name] !== undefined && prior[name] !== field)) {
      conflicts.add(key);
      directives.delete(key);
      review("同一件家具的要求有冲突", `${prior.source}；${source}`, roomId);
      continue;
    }
    const merged = { ...prior, ...fields, roomId, kind, source: [prior?.source, source].filter(Boolean).join("；").slice(0, 180) };
    if (merged.shape === "round" && merged.widthM && merged.depthM && Math.abs(merged.widthM - merged.depthM) > 0.005) {
      conflicts.add(key);
      directives.delete(key);
      review("圆桌要求与长宽尺寸有冲突", merged.source, roomId);
      continue;
    }
    if (merged.shape === "round" && (merged.widthM || merged.depthM)) merged.widthM = merged.depthM = merged.widthM || merged.depthM;
    directives.set(key, merged);
  }
  const reviewLimit = 30;
  const extraReviews = needsReview.length - reviewLimit + 1;
  const reviewList = needsReview.length > reviewLimit
    ? [...needsReview.slice(0, reviewLimit - 1), { description: `另有 ${extraReviews} 项说明需要确认，请查看完整原始需求。` }]
    : needsReview;
  return { directives: [...directives.values()], needsReview: reviewList };
}
