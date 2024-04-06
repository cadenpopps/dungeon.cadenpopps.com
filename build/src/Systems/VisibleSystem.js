import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { get2dEntityMap, getEntitiesInRange, xxTransform, xyTransform, yxTransform, yyTransform, } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class VisibleSystem extends System {
    cameraIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Visible, eventManager, entityManager, [CType.Visible]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const centerPos = new PositionComponent(round(cam.x), round(cam.y));
        const maxDistance = cam.visibleDistance;
        for (let entityId of this.entities) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            vis.visible = false;
            vis.inVisionRange = false;
        }
        const visibleEntities = getEntitiesInRange(centerPos, maxDistance, this.entities, this.entityManager);
        for (let visibleId of visibleEntities) {
            const vis = this.entityManager.get(visibleId, CType.Visible);
            vis.inVisionRange = true;
        }
        const entityMap = get2dEntityMap(visibleEntities, this.entityManager);
        const squareIds = VisibleSystem.occludeObjects(centerPos, maxDistance, entityMap, this.entityManager);
        for (let currentSquareId of squareIds) {
            const centerVis = this.entityManager.get(currentSquareId, CType.Visible);
            centerVis.visible = true;
            centerVis.discovered = true;
        }
    }
    refreshEntitiesHelper() {
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }
    static filterVisibleEntities(entities, entityManager) {
        const entityIds = new Array();
        for (let entityId of entities) {
            if (entityManager.get(entityId, CType.Visible).visible) {
                entityIds.push(entityId);
            }
        }
        return entityIds;
    }
    static occludeObjects(centerPos, maxDistance, entitiesInRange, entityManager) {
        let squareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, 0, 0, 0);
        for (let octant = 0; octant < 8; octant++) {
            squareIds = squareIds.concat(this.occludeObjectsOctant(centerPos, maxDistance, octant, entitiesInRange, entityManager));
        }
        for (let octant = 0; octant < 8; octant++) {
            if (octant % 2 === 1) {
                squareIds = squareIds.concat(this.occludeObjectsSraight(centerPos, maxDistance, octant, entitiesInRange, entityManager));
            }
            else {
                squareIds = squareIds.concat(this.occludeObjectsDiagonal(centerPos, maxDistance, octant, entitiesInRange, entityManager));
            }
        }
        return squareIds;
    }
    static occludeObjectsOctant(centerPos, maxDistance, octant, entitiesInRange, entityManager) {
        const squareIds = new Array();
        let x = 1;
        let shadows = new Array();
        let fullyBlocked = false;
        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = true;
            let y = 0;
            let slope = this.slope(x, y, SquarePosition.Center);
            while (slope < 1) {
                if (!this.inShadow(x, y, shadows)) {
                    fullyBlocked = false;
                    const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
                    for (let currentSquareId of currentSquareIds) {
                        const currentVis = entityManager.get(currentSquareId, CType.Visible);
                        if (x !== y && y !== 0) {
                            squareIds.push(currentSquareId);
                        }
                        if (currentVis.blocking) {
                            shadows.push({
                                lowerBound: this.slope(x, y, SquarePosition.BottomRight),
                                upperBound: this.slope(x, y, SquarePosition.TopLeft),
                            });
                            for (let i = shadows.length - 1; i >= 0; i--) {
                                for (let j = i + 1; j < shadows.length; j++) {
                                    if (shadows[i].lowerBound <= shadows[j].lowerBound &&
                                        shadows[i].upperBound >= shadows[j].upperBound) {
                                        shadows.splice(j);
                                        j = shadows.length;
                                    }
                                    else if (shadows[i].lowerBound >= shadows[j].lowerBound &&
                                        shadows[i].lowerBound <= shadows[j].upperBound) {
                                        shadows[i].lowerBound = shadows[j].lowerBound;
                                        shadows.splice(j);
                                        j = shadows.length;
                                    }
                                    else if (shadows[i].upperBound >= shadows[j].lowerBound &&
                                        shadows[i].upperBound <= shadows[j].upperBound) {
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
                slope = this.slope(x, y, SquarePosition.Center);
            }
            x++;
        }
        return squareIds;
    }
    static occludeObjectsSraight(centerPos, maxDistance, octant, entitiesInRange, entityManager) {
        const squareIds = new Array();
        let x = 1;
        let y = 0;
        let fullyBlocked = false;
        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = false;
            const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
            for (let currentSquareId of currentSquareIds) {
                const currentVis = entityManager.get(currentSquareId, CType.Visible);
                squareIds.push(currentSquareId);
                if (currentVis.blocking) {
                    fullyBlocked = true;
                }
            }
            x++;
        }
        return squareIds;
    }
    static occludeObjectsDiagonal(centerPos, maxDistance, octant, entitiesInRange, entityManager) {
        const squareIds = new Array();
        let x = 1;
        let y = 1;
        let fullyBlocked = false;
        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = false;
            const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
            for (let currentSquareId of currentSquareIds) {
                const currentVis = entityManager.get(currentSquareId, CType.Visible);
                squareIds.push(currentSquareId);
                if (currentVis.blocking) {
                    fullyBlocked = true;
                }
            }
            x++;
            y++;
        }
        return squareIds;
    }
    static inShadow(x, y, shadows) {
        let bottomRight = this.slope(x, y, SquarePosition.BottomRight);
        let topLeft = this.slope(x, y, SquarePosition.TopLeft);
        for (let s of shadows) {
            if (topLeft <= s.upperBound && bottomRight >= s.lowerBound) {
                return true;
            }
        }
        return false;
    }
    static slope(x, y, squarePosition) {
        switch (squarePosition) {
            case SquarePosition.Center:
                return y / x;
            case SquarePosition.TopLeft:
                return (y + 0.5) / (x - 0.5);
            case SquarePosition.BottomRight:
                return (y - 0.5) / (x + 0.5);
        }
        return 1;
    }
    static getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant) {
        const fx = centerPos.x + (x * xxTransform[octant] + y * xyTransform[octant]);
        const fy = centerPos.y + (x * yxTransform[octant] + y * yyTransform[octant]);
        if (entitiesInRange.has(fx) && entitiesInRange.get(fx)?.has(fy)) {
            return entitiesInRange.get(fx)?.get(fy);
        }
        return [];
    }
}
export var SquarePosition;
(function (SquarePosition) {
    SquarePosition[SquarePosition["TopLeft"] = 0] = "TopLeft";
    SquarePosition[SquarePosition["BottomRight"] = 1] = "BottomRight";
    SquarePosition[SquarePosition["Center"] = 2] = "Center";
})(SquarePosition || (SquarePosition = {}));
//# sourceMappingURL=VisibleSystem.js.map