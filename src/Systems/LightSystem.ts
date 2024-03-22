import { randomInt } from "crypto";
import { abs, floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class LightSystem extends System {
    private cameraIds!: Array<number>;
    private lightSourceIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Light, eventManager, entityManager, [CType.Visible]);
    }

    /**
     * Use new VisibleSystem to determine range of all visible components relative to cam
     * Also use to block sightlines from camera
     * Saves checks in lightSystem and graphics ssytem
     */
    public logic(): void {
        const cam = this.getCamera();
        for (let entityId of this.entities) {
            const ePos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
            if (abs(cam.x - ePos.x) < cam.visibleDistance && abs(cam.y - ePos.y) < cam.visibleDistance) {
                const eVis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
                eVis.lightLevel = randomInt(10, LIGHT_MAX);
            }
        }
    }

    public refreshEntitiesHelper(): void {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
        console.log(this.lightSourceIds);
    }

    private getCamera(): CameraComponent {
        let priority = 0;
        let prioCam = this.entityManager.get<CameraComponent>(this.cameraIds[0], CType.Camera);
        for (let entityId of this.cameraIds) {
            const cam = this.entityManager.get<CameraComponent>(entityId, CType.Camera);
            if (cam.priority > priority) {
                priority = cam.priority;
                prioCam = cam;
            }
        }
        return prioCam;
    }
}

export const LIGHT_MAX = 15;
const light_intensity = 0.25,
    light_red = 255,
    light_green = 190,
    light_blue = 0;
const shadow_intensity = 0.4,
    shadow_stop = 4,
    shadow_red = 10,
    shadow_green = 0,
    shadow_blue = 40;

export const LIGHT_LEVEL_FILL = new Array<VisibleComponent>();
export const SHADOW_FILL = new Array<VisibleComponent>();
for (let i = 0; i < LIGHT_MAX; i++) {
    const light_level = LIGHT_MAX - i - 1;
    const shadow_level = i;
    // LIGHT_LEVEL_FILL.push(
    //     "rgba(" +
    //         floor(light_red - (light_red / (LIGHT_MAX - 1)) * light_level) +
    //         "," +
    //         floor(light_green - (light_green / (LIGHT_MAX - 1)) * light_level) +
    //         "," +
    //         floor(light_blue - (light_blue / (LIGHT_MAX - 1)) * light_level) +
    //         "," +
    //         floor(100 * (light_intensity - (light_intensity / (LIGHT_MAX - 1)) * light_level)) / 100 +
    //         ")"
    // );
    LIGHT_LEVEL_FILL.push(
        new VisibleComponent({
            r: floor(light_red - (light_red / (LIGHT_MAX - 1)) * light_level),
            g: floor(light_green - (light_green / (LIGHT_MAX - 1)) * light_level),
            b: floor(light_blue - (light_blue / (LIGHT_MAX - 1)) * light_level),
            a: floor(100 * (light_intensity - (light_intensity / (LIGHT_MAX - 1)) * light_level)) / 100,
        })
    );
    if (shadow_level > shadow_stop) {
        SHADOW_FILL.push(new VisibleComponent());
    } else {
        SHADOW_FILL.push(
            new VisibleComponent({
                r: floor(shadow_red - (shadow_red / shadow_stop) * shadow_level),
                g: floor(shadow_green - (shadow_green / shadow_stop) * shadow_level),
                b: floor(shadow_blue - (shadow_blue / shadow_stop) * shadow_level),
                a: floor(100 * (shadow_intensity - (shadow_intensity / shadow_stop) * shadow_level)) / 100,
            })
        );
    }
}
