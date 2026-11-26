import { parseDesignBrief } from "./design-brief.js";
import { applyFurnitureRequirements, buildInitialLayout } from "./realtime-scene.js?v=studio-version-save";

export function planRealtimeDesign(source, brief) {
  const initial = buildInitialLayout(source);
  const requirements = parseDesignBrief(brief, initial);
  const { layout, applied, needsReview } = applyFurnitureRequirements(initial, requirements.directives);
  return {
    layout,
    design: { schema: "realtime-design/v1", applied, needsReview: [...requirements.needsReview, ...needsReview] },
  };
}
