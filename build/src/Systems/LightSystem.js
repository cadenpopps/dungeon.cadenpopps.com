import { randomInt } from "crypto";
import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { System, SystemType } from "../System.js";
export default class LightSystem extends System {
    cameraIds;
    lightSourceIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Light, eventManager, entityManager, [CType.Visible]);
    }
    logic() {
        const cam = this.getCamera();
        for (let entityId of this.entities) {
            const ePos = this.entityManager.get(entityId, CType.Position);
            if (abs(cam.x - ePos.x) < cam.visibleDistance && abs(cam.y - ePos.y) < cam.visibleDistance) {
                const eVis = this.entityManager.get(entityId, CType.Visible);
                eVis.lightLevel = randomInt(10, LIGHT_MAX);
            }
        }
    }
    refreshEntitiesHelper() {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
        console.log(this.lightSourceIds);
    }
    getCamera() {
        let priority = 0;
        let prioCam = this.entityManager.get(this.cameraIds[0], CType.Camera);
        for (let entityId of this.cameraIds) {
            const cam = this.entityManager.get(entityId, CType.Camera);
            if (cam.priority > priority) {
                priority = cam.priority;
                prioCam = cam;
            }
        }
        return prioCam;
    }
}
export const LIGHT_MAX = 15;
const light_intensity = 0.25, light_red = 255, light_green = 190, light_blue = 0;
const shadow_intensity = 0.4, shadow_stop = 4, shadow_red = 10, shadow_green = 0, shadow_blue = 40;
export const LIGHT_LEVEL_FILL = new Array();
export const SHADOW_FILL = new Array();
for (let i = 0; i < LIGHT_MAX; i++) {
    const light_level = LIGHT_MAX - i - 1;
    const shadow_level = i;
    LIGHT_LEVEL_FILL.push(new VisibleComponent({
        r: floor(light_red - (light_red / (LIGHT_MAX - 1)) * light_level),
        g: floor(light_green - (light_green / (LIGHT_MAX - 1)) * light_level),
        b: floor(light_blue - (light_blue / (LIGHT_MAX - 1)) * light_level),
        a: floor(100 * (light_intensity - (light_intensity / (LIGHT_MAX - 1)) * light_level)) / 100,
    }));
    if (shadow_level > shadow_stop) {
        SHADOW_FILL.push(new VisibleComponent());
    }
    else {
        SHADOW_FILL.push(new VisibleComponent({
            r: floor(shadow_red - (shadow_red / shadow_stop) * shadow_level),
            g: floor(shadow_green - (shadow_green / shadow_stop) * shadow_level),
            b: floor(shadow_blue - (shadow_blue / shadow_stop) * shadow_level),
            a: floor(100 * (shadow_intensity - (shadow_intensity / shadow_stop) * shadow_level)) / 100,
        }));
    }
}
//# sourceMappingURL=LightSystem.js.map