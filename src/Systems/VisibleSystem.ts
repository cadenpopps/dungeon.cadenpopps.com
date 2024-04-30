import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { getEntitiesInRange, xxTransform, xyTransform, yxTransform, yyTransform } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class VisibleSystem extends System {
    public static entitiesInRangeMap: Map<number, Map<number, Array<number>>>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Visible, eventManager, entityManager, [CType.Visible]);
        VisibleSystem.entitiesInRangeMap = new Map<number, Map<number, Array<number>>>();
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const centerPos = new PositionComponent(cam.x, cam.y);
        const maxDistance = cam.visibleDistance;
        for (let entityId of this.entities) {
            const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
            vis.visible = false;
            vis.inVisionRange = false;
        }
        const visibleEntities = getEntitiesInRange(centerPos, maxDistance, this.entities, this.entityManager);
        for (let visibleId of visibleEntities) {
            this.entityManager.get<VisibleComponent>(visibleId, CType.Visible).inVisionRange = true;
        }
        const squareIds = VisibleSystem.occludeObjects(centerPos, maxDistance, visibleEntities, this.entityManager);
        for (let currentSquareId of squareIds) {
            const vis = this.entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
            vis.visible = true;
            vis.discovered = true;
        }
    }

    public static getVisibleEntities(entities: Array<number>, entityManager: EntityManager): Array<number> {
        const entityIds = new Array<number>();
        for (let entityId of entities) {
            const entity = entityManager.getEntity(entityId);
            if (entity.has(CType.Visible)) {
                const vis = entity.get(CType.Visible) as VisibleComponent;
                if (vis.inVisionRange && vis.visible) {
                    entityIds.push(entityId);
                }
            }
        }
        return entityIds;
    }

    public static getVisibleAndDiscoveredEntities(
        entities: Array<number>,
        entityManager: EntityManager
    ): Array<number> {
        const entityIds = new Array<number>();
        for (let entityId of entities) {
            const entity = entityManager.getEntity(entityId);
            if (entity.has(CType.Visible)) {
                const vis = entity.get(CType.Visible) as VisibleComponent;
                if (vis.inVisionRange && (vis.visible || vis.discovered)) {
                    entityIds.push(entityId);
                }
            }
        }
        return entityIds;
    }

    private static get2dEntityMap(entities: Array<number>, entityManager: EntityManager): void {
        const entityMap = new Map<number, Map<number, Array<number>>>();
        for (let entityId of entities) {
            const entity = entityManager.getEntity(entityId);
            const ePos = entity.get(CType.Position) as PositionComponent;
            const size = (entity.get(CType.Size) as SizeComponent).size;
            const halfSize = size / 2;
            if (size !== 1) {
                const x1 = round(ePos.x - halfSize);
                const y1 = round(ePos.y - halfSize);
                const x2 = round(ePos.x + halfSize);
                const y2 = round(ePos.y + halfSize);
                for (let x = x1; x <= x2; x++) {
                    for (let y = y1; y <= y2; y++) {
                        if (!entityMap.get(x)) {
                            entityMap.set(x, new Map<number, Array<number>>());
                        }
                        if (!entityMap.get(x)?.get(y)) {
                            entityMap.get(x)?.set(y, new Array<number>());
                        }
                        if (!entityMap.get(x)?.get(y)?.includes(entityId)) {
                            entityMap.get(x)?.get(y)?.push(entityId);
                        }
                    }
                }
            } else {
                const x = round(ePos.x - halfSize);
                const y = round(ePos.y - halfSize);
                if (!entityMap.get(x)) {
                    entityMap.set(x, new Map<number, Array<number>>());
                }
                if (!entityMap.get(x)?.get(y)) {
                    entityMap.get(x)?.set(y, new Array<number>());
                }
                if (!entityMap.get(x)?.get(y)?.includes(entityId)) {
                    entityMap.get(x)?.get(y)?.push(entityId);
                }
            }
        }
        VisibleSystem.entitiesInRangeMap = entityMap;
    }

    public static occludeObjects(
        centerPos: PositionComponent,
        maxDistance: number,
        entities: Array<number>,
        entityManager: EntityManager
    ): Array<number> {
        VisibleSystem.get2dEntityMap(entities, entityManager);
        centerPos.x = round(centerPos.x);
        centerPos.y = round(centerPos.y);
        let squareIds = VisibleSystem.getSquareIdsFromOctantCoords(
            VisibleSystem.entitiesInRangeMap,
            centerPos,
            0,
            0,
            0
        );
        for (let octant = 0; octant < 8; octant++) {
            squareIds = squareIds.concat(
                VisibleSystem.occludeObjectsOctant(
                    centerPos,
                    maxDistance,
                    octant,
                    VisibleSystem.entitiesInRangeMap,
                    entityManager
                )
            );
        }

        const s = [...new Set(squareIds)];
        return s;
    }

    private static occludeObjectsOctant(
        centerPos: PositionComponent,
        maxDistance: number,
        octant: number,
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        entityManager: EntityManager
    ): Array<number> {
        const squareIds = new Array<number>();
        let fullyBlocked = false;
        let shadows = new Array<VisionCone>();
        for (let currentSquareId of this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, 1, 0, octant)) {
            const currentVis = entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
            squareIds.push(currentSquareId);
            if (currentVis.blocking) {
                shadows.push(VisibleSystem.getShadow(currentSquareId, centerPos, 1, 0, octant, entityManager));
            }
        }
        let x = 1;

        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = true;
            let y = 0;
            let slope = VisibleSystem.slope(x, y, SquarePosition.Center);
            while (slope <= 1) {
                if (!this.inShadow(x, y, shadows)) {
                    fullyBlocked = false;
                    const currentSquareIds = this.getSquareIdsFromOctantCoords(
                        entitiesInRange,
                        centerPos,
                        x,
                        y,
                        octant
                    );
                    for (let currentSquareId of currentSquareIds) {
                        const currentVis = entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
                        squareIds.push(currentSquareId);
                        if (currentVis.blocking) {
                            shadows.push(
                                VisibleSystem.getShadow(currentSquareId, centerPos, x, y, octant, entityManager)
                            );
                            for (let i = shadows.length - 1; i >= 0; i--) {
                                for (let j = i + 1; j < shadows.length; j++) {
                                    if (
                                        shadows[i].lowerBound <= shadows[j].lowerBound &&
                                        shadows[i].upperBound >= shadows[j].upperBound
                                    ) {
                                        shadows.splice(j);
                                        j = shadows.length;
                                    } else if (
                                        shadows[i].lowerBound >= shadows[j].lowerBound &&
                                        shadows[i].lowerBound <= shadows[j].upperBound
                                    ) {
                                        shadows[i].lowerBound = shadows[j].lowerBound;
                                        shadows.splice(j);
                                        j = shadows.length;
                                    } else if (
                                        shadows[i].upperBound >= shadows[j].lowerBound &&
                                        shadows[i].upperBound <= shadows[j].upperBound
                                    ) {
                                        shadows[i].upperBound = shadows[j].upperBound;
                                        shadows.splice(j);
                                        j = shadows.length;
                                    }
                                }
                            }
                        }
                    }
                }
                y++;
                slope = VisibleSystem.slope(x, y, SquarePosition.Center);
            }
            x++;
        }
        return squareIds;
    }

    private static getShadow(
        currentSquareId: number,
        centerPos: PositionComponent,
        x: number,
        y: number,
        octant: number,
        entityManager: EntityManager
    ): VisionCone {
        const currentSize = entityManager.get<SizeComponent>(currentSquareId, CType.Size).size;
        if (currentSize !== 1) {
            const currentPos = entityManager.get<PositionComponent>(currentSquareId, CType.Position);
            const newPos = this.getOctantCoordsFromPosition(currentPos, centerPos, octant);
            return {
                lowerBound: VisibleSystem.slope(
                    newPos.x + currentSize / 2,
                    newPos.y - currentSize / 2,
                    SquarePosition.Center
                ),
                upperBound: VisibleSystem.slope(
                    newPos.x - currentSize / 2,
                    newPos.y + currentSize / 2,
                    SquarePosition.Center
                ),
            };
        } else {
            return {
                lowerBound: VisibleSystem.slope(x, y, SquarePosition.BottomRight),
                upperBound: VisibleSystem.slope(x, y, SquarePosition.TopLeft),
            };
        }
    }

    private static inShadow(x: number, y: number, shadows: Array<VisionCone>): boolean {
        let bottomRight = VisibleSystem.slope(x, y, SquarePosition.BottomRight);
        let topLeft = VisibleSystem.slope(x, y, SquarePosition.TopLeft);
        for (let s of shadows) {
            if (topLeft <= s.upperBound && bottomRight >= s.lowerBound) {
                return true;
            }
        }
        return false;
    }

    private static slope(x: number, y: number, squarePosition: SquarePosition): number {
        switch (squarePosition) {
            case SquarePosition.Center:
                return y / x;
            case SquarePosition.TopLeft:
                return (y + 0.5) / (x - 0.5);
            case SquarePosition.BottomRight:
                return (y - 0.5) / (x + 0.5);
            case SquarePosition.BottomLeft:
                return (y - 0.5) / (x - 0.5);
        }
        return 1;
    }

    private static getSquareIdsFromOctantCoords(
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        centerPos: PositionComponent,
        x: number,
        y: number,
        octant: number
    ): Array<number> {
        const fx = centerPos.x + (x * xxTransform[octant] + y * xyTransform[octant]);
        const fy = centerPos.y + (x * yxTransform[octant] + y * yyTransform[octant]);
        if (entitiesInRange.has(fx) && entitiesInRange.get(fx)?.has(fy)) {
            return entitiesInRange.get(fx)?.get(fy) as Array<number>;
        }
        return [];
    }

    private static getOctantCoordsFromPosition(
        pos: PositionComponent,
        centerPos: PositionComponent,
        octant: number
    ): PositionComponent {
        if (octant === 2 || octant === 6) {
            octant = (octant + 4) % 8;
        }
        const octantX = (pos.x - centerPos.x) * xxTransform[octant] + (pos.y - centerPos.y) * xyTransform[octant];
        const octantY = (pos.x - centerPos.x) * yxTransform[octant] + (pos.y - centerPos.y) * yyTransform[octant];

        return new PositionComponent(octantX, octantY);
    }
}

export interface VisionCone {
    lowerBound: number;
    upperBound: number;
}

export enum SquarePosition {
    TopLeft,
    BottomRight,
    BottomLeft,
    Center,
}
