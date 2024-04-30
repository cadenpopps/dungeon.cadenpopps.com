import { distance, floor, max, min } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LightSourceComponent from "../Components/LightSourceComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";

export default class LightSystem extends System {
    public static LIGHT_MAX = 16;
    public static light_intensity = 0.2;
    public static light_intensity_min = 0.0;
    public static light_red = 220;
    public static light_green = 180;
    public static light_blue = 20;
    public static shadow_intensity = 0.25;
    public static shadow_stop = 9;
    public static shadow_red = 22;
    public static shadow_green = 8;
    public static shadow_blue = 30;

    private lightSourceIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Light, eventManager, entityManager, [CType.Visible]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        for (let entityId of this.entities) {
            const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
            vis.light = LIGHT_LEVEL_FILL[0];
            vis.shadow = SHADOW_FILL[0];
        }
        const visibleEntities = VisibleSystem.getVisibleEntities(this.entities, this.entityManager);
        for (let lightSourceId of this.lightSourceIds) {
            if (this.entityManager.get<VisibleComponent>(lightSourceId, CType.Visible).discovered) {
                const lightSourcePos = this.entityManager.get<PositionComponent>(lightSourceId, CType.Position);
                if (distance(lightSourcePos.x, lightSourcePos.y, cam.x, cam.y) < cam.visibleDistance) {
                    const light = this.entityManager.get<LightSourceComponent>(lightSourceId, CType.LightSource);
                    if (light.flickerTick === 0) {
                        light.flickerTick = light.flickerLength;
                    }
                    light.flicker = max(0.4, Math.sin((light.flickerTick / light.flickerLength) * 2 * Math.PI));
                    light.flickerTick--;

                    const lightLevel = light.lightLevel;
                    const affectedEntityIds = VisibleSystem.occludeObjects(
                        new PositionComponent(floor(lightSourcePos.x + 0.5), floor(lightSourcePos.y + 0.5)),
                        lightLevel,
                        visibleEntities,
                        this.entityManager
                    );

                    for (let affectedEntityId of affectedEntityIds) {
                        const vis = this.entityManager.get<VisibleComponent>(affectedEntityId, CType.Visible);
                        const pos = this.entityManager.get<PositionComponent>(affectedEntityId, CType.Position);
                        const level = max(
                            0,
                            floor(lightLevel - distance(pos.x, pos.y, lightSourcePos.x, lightSourcePos.y))
                        );
                        const l = LIGHT_LEVEL_FILL[level];
                        const s = SHADOW_FILL[level];
                        if (light.tint) {
                            const tint = light.tint;
                            l.r += tint.r;
                            l.g += tint.g;
                            l.b += tint.b;
                            s.r += tint.r;
                            s.g += tint.g;
                            s.b += tint.b;
                        }
                        vis.light = {
                            r: max(vis.light.r, l.r),
                            g: max(vis.light.g, l.g),
                            b: max(vis.light.b, l.b),
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

    public getEntitiesHelper(): void {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
    }
}
