import { constrain, distance, floor, max } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { get2dEntityMap } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class LightSystem extends System {
    static LIGHT_MAX = 16;
    static light_intensity = 0.25;
    static light_red = 220;
    static light_green = 180;
    static light_blue = 20;
    static shadow_intensity = 0.15;
    static shadow_stop = 9;
    static shadow_red = 22;
    static shadow_green = 8;
    static shadow_blue = 30;
    cameraIds;
    lightSourceIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Light, eventManager, entityManager, [CType.Visible]);
    }
    logic() {
        for (let entityId of this.entities) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            vis.lightLevel = 0;
        }
        const visibleEntities = VisibleSystem.filterVisibleEntities(this.entities, this.entityManager);
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const entitiesInRange = get2dEntityMap(visibleEntities, this.entityManager);
        for (let lightSourceId of this.lightSourceIds) {
            if (this.entityManager.get(lightSourceId, CType.Visible).discovered) {
                const lightSourcePos = this.entityManager.get(lightSourceId, CType.Position);
                if (distance(lightSourcePos.x, lightSourcePos.y, cam.x, cam.y) < cam.visibleDistance) {
                    const lightLevel = this.entityManager.get(lightSourceId, CType.LightSource).lightLevel;
                    const affectedEntityIds = VisibleSystem.occludeObjects(new PositionComponent(floor(lightSourcePos.x + 0.5), floor(lightSourcePos.y + 0.5)), lightLevel, entitiesInRange, this.entityManager);
                    for (let affectedEntityId of affectedEntityIds) {
                        const vis = this.entityManager.get(affectedEntityId, CType.Visible);
                        const pos = this.entityManager.get(affectedEntityId, CType.Position);
                        vis.lightLevel = constrain(max(vis.lightLevel, floor(lightLevel - distance(pos.x, pos.y, lightSourcePos.x, lightSourcePos.y))), 0, LightSystem.LIGHT_MAX);
                    }
                }
            }
        }
    }
    refreshEntitiesHelper() {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }
}
//# sourceMappingURL=LightSystem.js.map