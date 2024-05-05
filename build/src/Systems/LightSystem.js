import { distance, floor, max, min } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class LightSystem extends System {
    static LIGHT_MAX = 16;
    static light_intensity = 0.25;
    static light_intensity_min = 0.05;
    static light_red = 220;
    static light_green = 180;
    static light_blue = 20;
    static shadow_intensity = 0.25;
    static shadow_stop = 9;
    static shadow_red = 22;
    static shadow_green = 8;
    static shadow_blue = 30;
    lightSourceIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Light, eventManager, entityManager, [CType.Visible]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        for (let entityId of this.entities) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            vis.light = LIGHT_LEVEL_FILL[0];
            vis.shadow = SHADOW_FILL[0];
        }
        const visibleEntities = VisibleSystem.getVisibleEntities(this.entities, this.entityManager);
        for (let lightSourceId of this.lightSourceIds) {
            if (this.entityManager.get(lightSourceId, CType.Visible).discovered) {
                const lightSourcePos = this.entityManager.get(lightSourceId, CType.Position);
                if (distance(lightSourcePos.x, lightSourcePos.y, cam.x, cam.y) < cam.visibleDistance) {
                    const light = this.entityManager.get(lightSourceId, CType.LightSource);
                    if (light.flickerTick === 0) {
                        light.flickerTick = light.flickerLength;
                    }
                    light.flicker = max(0.25, Math.sin((light.flickerTick / light.flickerLength) * 2 * Math.PI));
                    light.flickerTick--;
                    const lightLevel = light.lightLevel;
                    const affectedEntityIds = VisibleSystem.occludeObjects(new PositionComponent(floor(lightSourcePos.x + 0.5), floor(lightSourcePos.y + 0.5)), lightLevel, visibleEntities, this.entityManager);
                    for (let affectedEntityId of affectedEntityIds) {
                        const vis = this.entityManager.get(affectedEntityId, CType.Visible);
                        const pos = this.entityManager.get(affectedEntityId, CType.Position);
                        const level = max(0, floor(lightLevel - distance(pos.x, pos.y, lightSourcePos.x, lightSourcePos.y)));
                        const l = LIGHT_LEVEL_FILL[level];
                        const s = SHADOW_FILL[level];
                        const tint = light.tint || { r: 0, g: 0, b: 0, a: 0 };
                        vis.light = {
                            r: max(vis.light.r, l.r + tint.r),
                            g: max(vis.light.g, l.g + tint.g),
                            b: max(vis.light.b, l.b + tint.b),
                            a: max(vis.light.a, l.a * light.flicker),
                        };
                        vis.shadow = {
                            r: min(vis.shadow.r, s.r),
                            g: min(vis.shadow.g, s.g),
                            b: min(vis.shadow.b, s.b),
                            a: min(vis.shadow.a, s.a),
                        };
                    }
                }
            }
        }
    }
    getEntitiesHelper() {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
    }
}
//# sourceMappingURL=LightSystem.js.map