import { abs, floor, max, round } from "../lib/PoppsMath.js";
import { CType } from "./Component.js";
import LightSystem from "./Systems/LightSystem.js";
export const SHOW_HITBOXES = true;
export const LOG_LEVEL_GEN = false;
export const SHOW_ENEMY_AI = true;
export const xxTransform = [1, 0, 0, -1, -1, 0, 0, 1];
export const xyTransform = [0, 1, -1, 0, 0, -1, 1, 0];
export const yxTransform = [0, 1, 1, 0, 0, -1, -1, 0];
export const yyTransform = [1, 0, 0, 1, -1, 0, 0, -1];
export const xxRotation = [0, 0.71, 0, -0.71, -1, -0.71, 0, 0.71];
export const xyRotation = [0.71, 1, 0.71, 0, 0, -1, 1, 0];
export const yxRotation = [1, 0.71, 0, -1, -1, 0, 0, 1];
export const yyRotation = [1, 1, -1, 0, 0, -1, 1, 0];
export const LIGHT_LEVEL_FILL = new Array();
export const SHADOW_FILL = new Array();
for (let i = 0; i <= LightSystem.LIGHT_MAX; i++) {
    const light_level = LightSystem.LIGHT_MAX - i - 1;
    const shadow_level = i;
    LIGHT_LEVEL_FILL.push({
        r: floor(LightSystem.light_red - (LightSystem.light_red / (LightSystem.LIGHT_MAX - 1)) * light_level),
        g: floor(LightSystem.light_green - (LightSystem.light_green / (LightSystem.LIGHT_MAX - 1)) * light_level),
        b: floor(LightSystem.light_blue - (LightSystem.light_blue / (LightSystem.LIGHT_MAX - 1)) * light_level),
        a: round(100 *
            max(LightSystem.light_intensity -
                (LightSystem.light_intensity / (LightSystem.LIGHT_MAX - 1)) * light_level, LightSystem.light_intensity_min)) / 100,
    });
    if (shadow_level > LightSystem.shadow_stop) {
        SHADOW_FILL.push({ r: 0, g: 0, b: 0, a: 0 });
    }
    else {
        SHADOW_FILL.push({
            r: floor(LightSystem.shadow_red - (LightSystem.shadow_red / LightSystem.shadow_stop) * shadow_level),
            g: floor(LightSystem.shadow_green - (LightSystem.shadow_green / LightSystem.shadow_stop) * shadow_level),
            b: floor(LightSystem.shadow_blue - (LightSystem.shadow_blue / LightSystem.shadow_stop) * shadow_level),
            a: round(100 *
                (LightSystem.shadow_intensity -
                    (LightSystem.shadow_intensity / LightSystem.shadow_stop) * shadow_level)) / 100,
        });
    }
}
export function getEntitiesInRange(centerPos, maxDistance, entities, entityManager) {
    const entitiesInRange = new Array();
    for (let entityId of entities) {
        const ePos = entityManager.get(entityId, CType.Position);
        if (abs(centerPos.x - ePos.x) < maxDistance && abs(centerPos.y - ePos.y) < maxDistance) {
            entitiesInRange.push(entityId);
        }
    }
    return entitiesInRange;
}
//# sourceMappingURL=Constants.js.map