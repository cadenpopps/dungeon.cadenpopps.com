import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import { getEntitiesInRange, xxTransform, xyTransform, yxTransform, yyTransform } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class VisibleSystem extends System {
    static entitiesInRangeMap;
    cameraIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Visible, eventManager, entityManager, [CType.Visible]);
        VisibleSystem.entitiesInRangeMap = new Map();
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const centerPos = new PositionComponent(cam.x, cam.y);
        const maxDistance = cam.visibleDistance;
        for (let entityId of this.entities) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            vis.visible = false;
            vis.inVisionRange = false;
        }
        const visibleEntities = getEntitiesInRange(centerPos, maxDistance, this.entities, this.entityManager);
        for (let visibleId of visibleEntities) {
            this.entityManager.get(visibleId, CType.Visible).inVisionRange = true;
        }
        const squareIds = VisibleSystem.occludeObjects(centerPos, maxDistance, visibleEntities, this.entityManager);
        for (let currentSquareId of squareIds) {
            const vis = this.entityManager.get(currentSquareId, CType.Visible);
            vis.visible = true;
            vis.discovered = true;
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
    static get2dEntityMap(entities, entityManager) {
        const entityMap = new Map();
        for (let entityId of entities) {
            const entity = entityManager.getEntity(entityId);
            const ePos = entity.get(CType.Position);
            const size = entity.get(CType.Size).size;
            const halfSize = size / 2;
            if (size !== 1) {
                const x1 = round(ePos.x - halfSize);
                const y1 = round(ePos.y - halfSize);
                const x2 = round(ePos.x + halfSize);
                const y2 = round(ePos.y + halfSize);
                for (let x = x1; x <= x2; x++) {
                    for (let y = y1; y <= y2; y++) {
                        if (!entityMap.get(x)) {
                            entityMap.set(x, new Map());
                        }
                        if (!entityMap.get(x)?.get(y)) {
                            entityMap.get(x)?.set(y, new Array());
                        }
                        if (!entityMap.get(x)?.get(y)?.includes(entityId)) {
                            entityMap.get(x)?.get(y)?.push(entityId);
                        }
                    }
                }
            }
            else {
                const x = round(ePos.x - halfSize);
                const y = round(ePos.y - halfSize);
                if (!entityMap.get(x)) {
                    entityMap.set(x, new Map());
                }
                if (!entityMap.get(x)?.get(y)) {
                    entityMap.get(x)?.set(y, new Array());
                }
                if (!entityMap.get(x)?.get(y)?.includes(entityId)) {
                    entityMap.get(x)?.get(y)?.push(entityId);
                }
            }
        }
        VisibleSystem.entitiesInRangeMap = entityMap;
    }
    static occludeObjects(centerPos, maxDistance, entities, entityManager) {
        VisibleSystem.get2dEntityMap(entities, entityManager);
        centerPos.x = round(centerPos.x);
        centerPos.y = round(centerPos.y);
        let squareIds = VisibleSystem.getSquareIdsFromOctantCoords(VisibleSystem.entitiesInRangeMap, centerPos, 0, 0, 0);
        for (let octant = 0; octant < 8; octant++) {
            squareIds = squareIds.concat(VisibleSystem.occludeObjectsOctant(centerPos, maxDistance, octant, VisibleSystem.entitiesInRangeMap, entityManager));
        }
        for (let octant = 0; octant < 8; octant++) {
            if (octant % 2 === 1) {
                squareIds = squareIds.concat(VisibleSystem.occludeObjectsSraight(centerPos, maxDistance, octant, VisibleSystem.entitiesInRangeMap, entityManager));
            }
            else {
                squareIds = squareIds.concat(VisibleSystem.occludeObjectsDiagonal(centerPos, maxDistance, octant, VisibleSystem.entitiesInRangeMap, entityManager));
            }
        }
        return squareIds;
    }
    static occludeObjectsOctant(centerPos, maxDistance, octant, entitiesInRange, entityManager) {
        const squareIds = new Array();
        let fullyBlocked = false;
        let shadows = new Array();
        for (let currentSquareId of this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, 1, 0, octant)) {
            const currentVis = entityManager.get(currentSquareId, CType.Visible);
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
                            shadows.push(VisibleSystem.getShadow(currentSquareId, centerPos, x, y, octant, entityManager));
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
                slope = VisibleSystem.slope(x, y, SquarePosition.Center);
            }
            x++;
        }
        return squareIds;
    }
    static getShadow(currentSquareId, centerPos, x, y, octant, entityManager) {
        const currentSize = entityManager.get(currentSquareId, CType.Size).size;
        if (currentSize !== 1) {
            const currentPos = entityManager.get(currentSquareId, CType.Position);
            const newPos = this.getOctantCoordsFromPosition(currentPos, centerPos, octant);
            return {
                lowerBound: VisibleSystem.slope(newPos.x + currentSize / 2, newPos.y - currentSize / 2, SquarePosition.Center),
                upperBound: VisibleSystem.slope(newPos.x - currentSize / 2, newPos.y + currentSize / 2, SquarePosition.Center),
            };
        }
        else {
            return {
                lowerBound: VisibleSystem.slope(x, y, SquarePosition.BottomRight),
                upperBound: VisibleSystem.slope(x, y, SquarePosition.TopLeft),
            };
        }
    }
    static occludeObjectsSraight(centerPos, maxDistance, octant, entitiesInRange, entityManager) {
        const squareIds = new Array();
        let x = 1;
        let y = 0;
        let fullyBlocked = false;
        while (x <= maxDistance && !fullyBlocked) {
            const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
            for (let currentSquareId of currentSquareIds) {
                const currentVis = entityManager.get(currentSquareId, CType.Visible);
                squareIds.push(currentSquareId);
                if (currentVis.blocking) {
                    const currentSize = entityManager.get(currentSquareId, CType.Size).size;
                    let lowerBound = 0;
                    let upperBound = 1;
                    if (currentSize !== 1) {
                        const currentPos = entityManager.get(currentSquareId, CType.Position);
                        const newPos = this.getOctantCoordsFromPosition(currentPos, centerPos, octant);
                        lowerBound = VisibleSystem.slope(newPos.x - currentSize / 2, newPos.y - currentSize / 2, SquarePosition.Center);
                        upperBound = VisibleSystem.slope(newPos.x - currentSize / 2, newPos.y + currentSize / 2, SquarePosition.Center);
                    }
                    else {
                        lowerBound = VisibleSystem.slope(x, y, SquarePosition.BottomLeft);
                        upperBound = VisibleSystem.slope(x, y, SquarePosition.TopLeft);
                    }
                    if (this.inShadowStraight(x + 1, y, [{ lowerBound: lowerBound, upperBound: upperBound }])) {
                        fullyBlocked = true;
                    }
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
                    const currentSize = entityManager.get(currentSquareId, CType.Size).size;
                    let lowerBound = 0;
                    let upperBound = 1;
                    if (currentSize !== 1) {
                        const currentPos = entityManager.get(currentSquareId, CType.Position);
                        const newPos = this.getOctantCoordsFromPosition(currentPos, centerPos, octant);
                        lowerBound = VisibleSystem.slope(newPos.x + currentSize / 2, newPos.y - currentSize / 2, SquarePosition.Center);
                        upperBound = VisibleSystem.slope(newPos.x - currentSize / 2, newPos.y + currentSize / 2, SquarePosition.Center);
                    }
                    else {
                        lowerBound = VisibleSystem.slope(x, y, SquarePosition.BottomRight);
                        upperBound = VisibleSystem.slope(x, y, SquarePosition.TopLeft);
                    }
                    if (this.inShadow(x + 1, y + 1, [{ lowerBound: lowerBound, upperBound: upperBound }])) {
                        fullyBlocked = true;
                    }
                }
            }
            x++;
            y++;
        }
        return squareIds;
    }
    static inShadow(x, y, shadows) {
        let bottomRight = VisibleSystem.slope(x, y, SquarePosition.BottomRight);
        let topLeft = VisibleSystem.slope(x, y, SquarePosition.TopLeft);
        for (let s of shadows) {
            if (topLeft <= s.upperBound && bottomRight >= s.lowerBound) {
                return true;
            }
        }
        return false;
    }
    static inShadowStraight(x, y, shadows) {
        let bottomLeft = VisibleSystem.slope(x, y, SquarePosition.BottomLeft);
        let topLeft = VisibleSystem.slope(x, y, SquarePosition.TopLeft);
        for (let s of shadows) {
            if (topLeft <= s.upperBound && bottomLeft >= s.lowerBound) {
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
            case SquarePosition.BottomLeft:
                return (y - 0.5) / (x - 0.5);
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
    static getOctantCoordsFromPosition(pos, centerPos, octant) {
        if (octant === 2 || octant === 6) {
            octant = (octant + 4) % 8;
        }
        const octantX = (pos.x - centerPos.x) * xxTransform[octant] + (pos.y - centerPos.y) * xyTransform[octant];
        const octantY = (pos.x - centerPos.x) * yxTransform[octant] + (pos.y - centerPos.y) * yyTransform[octant];
        return new PositionComponent(octantX, octantY);
    }
}
export var SquarePosition;
(function (SquarePosition) {
    SquarePosition[SquarePosition["TopLeft"] = 0] = "TopLeft";
    SquarePosition[SquarePosition["BottomRight"] = 1] = "BottomRight";
    SquarePosition[SquarePosition["BottomLeft"] = 2] = "BottomLeft";
    SquarePosition[SquarePosition["Center"] = 3] = "Center";
})(SquarePosition || (SquarePosition = {}));
//# sourceMappingURL=VisibleSystem.js.map