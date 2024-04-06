import { constrain, distance, floor, max } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import LightSourceComponent from "../Components/LightSourceComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { get2dEntityMap } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";

export default class LightSystem extends System {
    public static LIGHT_MAX = 16;
    public static light_intensity = 0.25;
    public static light_red = 220;
    public static light_green = 180;
    public static light_blue = 20;
    public static shadow_intensity = 0.15;
    public static shadow_stop = 9;
    public static shadow_red = 22;
    public static shadow_green = 8;
    public static shadow_blue = 30;

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
        for (let entityId of this.entities) {
            const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
            vis.lightLevel = 0;
        }
        const visibleEntities = VisibleSystem.filterVisibleEntities(this.entities, this.entityManager);
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const entitiesInRange = get2dEntityMap(visibleEntities, this.entityManager);
        for (let lightSourceId of this.lightSourceIds) {
            if (this.entityManager.get<VisibleComponent>(lightSourceId, CType.Visible).discovered) {
                const lightSourcePos = this.entityManager.get<PositionComponent>(lightSourceId, CType.Position);
                if (distance(lightSourcePos.x, lightSourcePos.y, cam.x, cam.y) < cam.visibleDistance) {
                    const lightLevel = this.entityManager.get<LightSourceComponent>(
                        lightSourceId,
                        CType.LightSource
                    ).lightLevel;
                    const affectedEntityIds = VisibleSystem.occludeObjects(
                        new PositionComponent(floor(lightSourcePos.x + 0.5), floor(lightSourcePos.y + 0.5)),
                        lightLevel,
                        entitiesInRange,
                        this.entityManager
                    );
                    for (let affectedEntityId of affectedEntityIds) {
                        const vis = this.entityManager.get<VisibleComponent>(affectedEntityId, CType.Visible);
                        const pos = this.entityManager.get<PositionComponent>(affectedEntityId, CType.Position);
                        vis.lightLevel = constrain(
                            max(
                                vis.lightLevel,
                                floor(lightLevel - distance(pos.x, pos.y, lightSourcePos.x, lightSourcePos.y))
                            ),
                            0,
                            LightSystem.LIGHT_MAX
                        );
                    }
                }
            }
        }
        // for (let entityId of visibleEntities) {
        //     const eVis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
        //     if (eVis.visible) {
        //         eVis.lightLevel = 10;
        //     } else if (eVis.discovered) {
        //         eVis.lightLevel = 0;
        //     }
        // }
        // for (let lightSourceId of this.lightSourceIds) {
        //     const lightSourcePos = this.entityManager.get<PositionComponent>(lightSourceId, CType.Position);
        //     const lightSourceLevel = this.entityManager.get<LightSourceComponent>(
        //         lightSourceId,
        //         CType.LightSource
        //     ).lightLevel;
        //     const lightSourceSquares = VisibleSystem.occludeObjects(
        //         lightSourcePos,
        //         lightSourceLevel,
        //         VisibleSystem.filterFarObjects(lightSourcePos, lightSourceLevel, this.entities, this.entityManager),
        //         this.entityManager
        //     );
        // console.log(lightSourceSquares.length);

        // const lightSourceLevel = this.entityManager.get<LightSourceComponent>(
        //     lightSourceId,
        //     CType.LightSource
        // ).lightLevel;
        // eVis.lightLevel = min( //     max(
        //         eVis.lightLevel +
        //             floor(LightSystem.LIGHT_MAX - distance(lightSourcePos.x, lightSourcePos.y, ePos.x, ePos.y)),
        //         0
        //     ),
        //     LightSystem.LIGHT_MAX
        // );
        // }
    }

    public refreshEntitiesHelper(): void {
        this.lightSourceIds = this.entityManager.getSystemEntities([CType.LightSource]);
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }
}
