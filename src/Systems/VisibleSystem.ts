import { round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import PositionComponent from "../Components/PositionComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import {
    get2dEntityMap,
    getEntitiesInRange,
    xxTransform,
    xyTransform,
    yxTransform,
    yyTransform,
} from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class VisibleSystem extends System {
    private cameraIds!: Array<number>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Visible, eventManager, entityManager, [CType.Visible]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        const centerPos = new PositionComponent(round(cam.x), round(cam.y));
        const maxDistance = cam.visibleDistance;
        for (let entityId of this.entities) {
            const vis = this.entityManager.get<VisibleComponent>(entityId, CType.Visible);
            vis.visible = false;
            vis.inVisionRange = false;
        }
        const visibleEntities = getEntitiesInRange(centerPos, maxDistance, this.entities, this.entityManager);
        for (let visibleId of visibleEntities) {
            const vis = this.entityManager.get<VisibleComponent>(visibleId, CType.Visible);
            vis.inVisionRange = true;
        }
        const entityMap = get2dEntityMap(visibleEntities, this.entityManager);
        const squareIds = VisibleSystem.occludeObjects(centerPos, maxDistance, entityMap, this.entityManager);
        for (let currentSquareId of squareIds) {
            const centerVis = this.entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
            centerVis.visible = true;
            centerVis.discovered = true;
        }
    }

    public refreshEntitiesHelper(): void {
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }

    public static filterVisibleEntities(entities: Array<number>, entityManager: EntityManager): Array<number> {
        const entityIds = new Array<number>();
        for (let entityId of entities) {
            if (entityManager.get<VisibleComponent>(entityId, CType.Visible).visible) {
                entityIds.push(entityId);
            }
        }
        return entityIds;
    }

    public static occludeObjects(
        centerPos: PositionComponent,
        maxDistance: number,
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        entityManager: EntityManager
    ): Array<number> {
        let squareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, 0, 0, 0);
        for (let octant = 0; octant < 8; octant++) {
            squareIds = squareIds.concat(
                this.occludeObjectsOctant(centerPos, maxDistance, octant, entitiesInRange, entityManager)
            );
        }
        for (let octant = 0; octant < 8; octant++) {
            if (octant % 2 === 1) {
                squareIds = squareIds.concat(
                    this.occludeObjectsSraight(centerPos, maxDistance, octant, entitiesInRange, entityManager)
                );
            } else {
                squareIds = squareIds.concat(
                    this.occludeObjectsDiagonal(centerPos, maxDistance, octant, entitiesInRange, entityManager)
                );
            }
        }
        return squareIds;
    }

    private static occludeObjectsOctant(
        centerPos: PositionComponent,
        maxDistance: number,
        octant: number,
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        entityManager: EntityManager
    ): Array<number> {
        const squareIds = new Array<number>();
        let x = 1;
        let shadows = new Array<VisionCone>();
        let fullyBlocked = false;

        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = true;
            let y = 0;
            let slope = this.slope(x, y, SquarePosition.Center);
            while (slope < 1) {
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
                slope = this.slope(x, y, SquarePosition.Center);
            }
            x++;
        }
        return squareIds;
    }

    private static occludeObjectsSraight(
        centerPos: PositionComponent,
        maxDistance: number,
        octant: number,
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        entityManager: EntityManager
    ): Array<number> {
        const squareIds = new Array<number>();
        let x = 1;
        let y = 0;
        let fullyBlocked = false;

        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = false;
            const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
            for (let currentSquareId of currentSquareIds) {
                const currentVis = entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
                squareIds.push(currentSquareId);
                if (currentVis.blocking) {
                    fullyBlocked = true;
                }
            }
            x++;
        }
        return squareIds;
    }

    private static occludeObjectsDiagonal(
        centerPos: PositionComponent,
        maxDistance: number,
        octant: number,
        entitiesInRange: Map<number, Map<number, Array<number>>>,
        entityManager: EntityManager
    ): Array<number> {
        const squareIds = new Array<number>();
        let x = 1;
        let y = 1;
        let fullyBlocked = false;

        while (x <= maxDistance && !fullyBlocked) {
            fullyBlocked = false;
            const currentSquareIds = this.getSquareIdsFromOctantCoords(entitiesInRange, centerPos, x, y, octant);
            for (let currentSquareId of currentSquareIds) {
                const currentVis = entityManager.get<VisibleComponent>(currentSquareId, CType.Visible);
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

    private static inShadow(x: number, y: number, shadows: Array<VisionCone>): boolean {
        let bottomRight = this.slope(x, y, SquarePosition.BottomRight);
        let topLeft = this.slope(x, y, SquarePosition.TopLeft);
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
}

export interface VisionCone {
    lowerBound: number;
    upperBound: number;
}

export enum SquarePosition {
    TopLeft,
    BottomRight,
    Center,
}

/**
 * 	playerSightTriangle(map, octant, sx, sy, range) {
		let x = 1;
		let shadows = [];
		let squaresVisible = true;

		while (x <= range && squaresVisible) {
			squaresVisible = false;
			let y = 0;
			let curslope = 0;
			while(curslope <= 1) {
				if(!VisionSystem.inShadow(x, y, shadows)) {
					squaresVisible = true;
					let cur = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
					if(cur === undefined) { break; }
					cur.display.visible = true;
					cur.display.discovered = true;
					if(cur.display.opaque) {
						let firstBlocked = this.getFirstBlocked(map, octant, x, y, sx, sy, shadows);
						let lastBlocked = this.getBlocked(map, octant, x, y, sx, sy, shadows);
						let shadowStart = VisionSystem.slope(firstBlocked.x, firstBlocked.y, BOTTOM_RIGHT);
						let shadowEnd = VisionSystem.slope(lastBlocked.x, lastBlocked.y, TOP_LEFT);
						shadows.push([shadowStart, shadowEnd]);
					}
					else{
						let above = VisionSystem.getTranslatedSquare(map, octant, x, y + 1, sx, sy);
						if(above !== undefined ) { above.display.discovered = true; }
					}
				}
				y++;
				curslope = VisionSystem.slope(x, y, CENTER_SQUARE);
			}
			x++;
		}
	}

	getFirstBlocked(map, octant, x, y, sx, sy, shadows) {
		let firstBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, CENTER_SQUARE) > 0) {
			firstBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = true;
			}

			y--;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return firstBlocked;
	}

	getBlocked(map, octant, x, y, sx, sy, shadows) {
		let lastBlocked = {x:x, y:y};

		let currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);

		while(currentBlocked !== undefined && currentBlocked.display.opaque && VisionSystem.slope(x, y, BOTTOM_RIGHT) < 1) {
			lastBlocked = {x:x, y:y};
			if(!VisionSystem.inShadow(x, y, shadows)) {
				currentBlocked.display.visible = true;
				currentBlocked.display.discovered = true;
			}

			y++;
			currentBlocked = VisionSystem.getTranslatedSquare(map, octant, x, y, sx, sy);
		}
		return lastBlocked;
	}

	static slope(x, y, CORNER) {
		switch(CORNER) {
			case CENTER_SQUARE:
				return y/x;
			case TOP_LEFT:
				if(x == 0) {
					return 1;
				}
				return (y + .5)/(x - .5);
			case BOTTOM_RIGHT:
				return max(0, (y - .5)/(x + .5));
			case UPPER_BOUND:
				return (y + PERM)/(x - PERM);
			case LOWER_BOUND:
				return (y - PERM)/(x + PERM);
		}
		return 1;
	}

	static inShadow(x, y, shadows) {
		let BR = VisionSystem.slope(x, y, BOTTOM_RIGHT), TL = VisionSystem.slope(x, y, TOP_LEFT);
		for(let s of shadows) {
			if( BR >= s[0] && TL <= s[1]) return true;
			else if( BR >= s[0] && BR <= s[1] && TL >= s[1]) { BR = s[1]; }
			else if( BR <= s[0] && TL >= s[0] && TL <= s[1]) { TL = s[0]; }
		}
		return false;
	}

	static startSquare(x, slopeStart) {
		if(slopeStart == 0) return 0;
		return ceil(x * slopeStart);
	}

	static getTranslatedSquare(map, octant, x, y, sx, sy) {
		let uc = VisionSystem.translate(octant, x, y);
		let fx = sx + uc[0];
		let fy = sy - uc[1];
		if(Utility.positionInBounds(new PositionComponent(fx, fy), map.length)) {
			return map[fx][fy];
		}
		return undefined;
	}

	static translate(octant, x, y) {
		return[x * xxcomp[octant] + y * xycomp[octant], x * yxcomp[octant] + y * yycomp[octant]];
	}

	static isOpaque(square) {
		return square.display.opaque;
	}

	static lineOfSight(engine, p1, p2) {
		const LOS_PERM = .5;
		let map = engine.getMap();
		if(p1 == p2) {
			return true;
		}
		else if(p1.y == p2.y) {
			let start = (p1.x < p2.x) ? p1 : p2;
			let end = (start == p1) ? p2 : p1;
			let curSquare = map[start.x][start.y];
			for(let x = start.x; x <= end.x; x++) {
				if(VisionSystem.isOpaque(map[x][start.y])) {
					return false;
				}
			}
		}
		else if(p1.x == p2.x) {
			let start = (p1.y < p2.y) ? p1 : p2;
			let end = (start == p1) ? p2 : p1;
			let curSquare = map[start.x][start.y];
			for(let y = start.y; y <= end.y; y++) {
				if(VisionSystem.isOpaque(map[start.x][y])) {
					return false;
				}
			}
		}
		else {
			let start, end, x, y, slope, curSquare, direction;
			let difX = abs(p1.x - p2.x);
			let difY = abs(p1.y - p2.y);

			if(difX <= difY) {
				start = (p1.x <= p2.x) ? p1 : p2;
				end = (start == p1) ? p2 : p1;
				slope = abs(end.x - start.x) / abs(end.y - start.y);
				direction = (start.y < end.y) ? 1 : -1;
				x = start.x;
				y = start.y;

				let error = 0;

				while(x <= end.x) {
					if(VisionSystem.isOpaque(map[x][y])) {
						return false;
					}
					if(y == end.y) {
						break;
					}
					y += direction;
					error += slope;
					if(error > .5) {
						x++;
						error -= 1;
					}
				}
			}
			else {
				start = (p1.y <= p2.y) ? p1 : p2;
				end = (start == p1) ? p2 : p1;
				slope = abs(end.y - start.y) / abs(end.x - start.x);
				direction = (start.x < end.x) ? 1 : -1;
				x = start.x;
				y = start.y;

				let error = 0;

				while(y <= end.y) {
					if(VisionSystem.isOpaque(map[x][y])) {
						return false;
					}
					if(x == end.x) {
						break;
					}
					x += direction;
					error += slope;
					if(error > .5) {
						y++;
						error -= 1;
					}
				}
			}
		}
		return true;
	}
 */
