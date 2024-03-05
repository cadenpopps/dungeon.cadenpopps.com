import { abs, ceil, floor, round } from "../../lib/PoppsMath.js";
import { ComponentType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class PhysicsSystem extends System {
    private subGrid: Array<Array<Array<number>>>;
    private centerPoint: PositionComponent;
    private visibleDistance: number;
    private counter = 0;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Physics, eventManager, entityManager, [
            ComponentType.Position,
            ComponentType.Collision,
        ]);
        this.subGrid = new Array<Array<Array<number>>>();
        this.centerPoint = new PositionComponent(0, 0, 0);
        this.visibleDistance = 1;
    }

    // avg 1300 checks for 15%
    // avg 2800 checks for 35%
    public logic(): void {
        this.setCenterPoint();
        const filteredEntities = this.filterEntitiesByDistance();
        this.preCollision(filteredEntities);
        this.counter = 0;
        this.physics();
    }

    public handleEvent(event: Event): void {}

    private physics(): void {
        for (let i = 1; i < this.subGrid.length - 1; i++) {
            for (let j = 1; j < this.subGrid[i].length - 1; j++) {
                for (let entityId of this.subGrid[i][j]) {
                    if (
                        this.entityManager.data[ComponentType.Velocity].has(
                            entityId
                        )
                    ) {
                        const position = this.entityManager.data[
                            ComponentType.Position
                        ].get(entityId) as PositionComponent;
                        const velocity = this.entityManager.data[
                            ComponentType.Velocity
                        ].get(entityId) as VelocityComponent;
                        const collision = this.entityManager.data[
                            ComponentType.Collision
                        ].get(entityId) as CollisionComponent;
                        collision.collided = false;
                        position.x += velocity.x;
                        position.y += velocity.y;
                        if (this.collision(entityId, i, j)) {
                            collision.collided = true;
                            position.x -= velocity.x;
                            position.y -= velocity.y;
                        }
                    }
                }
            }
        }
    }

    private setCenterPoint(): void {
        let priority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.data[ComponentType.Camera].has(entityId)) {
                const cam = this.entityManager.data[ComponentType.Camera].get(
                    entityId
                ) as CameraComponent;
                if (cam.priority > priority) {
                    this.centerPoint.x = round(cam.x);
                    this.centerPoint.y = round(cam.y);
                    this.centerPoint.z = cam.z;
                    this.visibleDistance = cam.visibleDistance;
                }
            }
        }
    }

    private filterEntitiesByDistance(): Array<number> {
        const filteredEntities = new Array<number>();
        for (let entityId of this.entities) {
            const pos = this.entityManager.data[ComponentType.Position].get(
                entityId
            ) as PositionComponent;
            if (
                abs(pos.x - this.centerPoint.x) < this.visibleDistance &&
                abs(pos.y - this.centerPoint.y) < this.visibleDistance
            ) {
                filteredEntities.push(entityId);
            }
        }
        return filteredEntities;
    }

    private preCollision(filteredEntities: Array<number>): void {
        const gridSize = this.getBiggestEntitySize(filteredEntities);
        const gridLength = ceil((this.visibleDistance * 2) / gridSize) - 1;
        this.subGrid = new Array<Array<Array<number>>>(gridLength);
        for (let i = 0; i < gridLength; i++) {
            this.subGrid[i] = new Array<Array<number>>(gridLength);
            for (let j = 0; j < gridLength; j++) {
                this.subGrid[i][j] = new Array<number>();
            }
        }

        for (let entityId of filteredEntities) {
            const pos = this.entityManager.data[ComponentType.Position].get(
                entityId
            ) as PositionComponent;
            const newX = floor(
                (pos.x - this.centerPoint.x + this.visibleDistance - 1) /
                    gridSize
            );
            const newY = floor(
                (pos.y - this.centerPoint.y + this.visibleDistance - 1) /
                    gridSize
            );
            this.subGrid[newX][newY].push(entityId);
        }
    }

    private getBiggestEntitySize(filteredEntities: Array<number>): number {
        let biggestEntitySize = 1;
        for (let entityId of filteredEntities) {
            const col = this.entityManager.data[ComponentType.Collision].get(
                entityId
            ) as CollisionComponent;
            if (col.size > biggestEntitySize) {
                biggestEntitySize = col.size;
            }
        }
        return biggestEntitySize;
    }

    private collision(
        entityId: number,
        xCoord: number,
        yCoord: number
    ): boolean {
        for (let i = xCoord - 1; i <= xCoord + 1; i++) {
            for (let j = yCoord - 1; j <= yCoord + 1; j++) {
                for (let otherId of this.subGrid[i][j]) {
                    if (otherId !== entityId) {
                        if (this.collided(entityId, otherId)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private collided(ent1: number, ent2: number) {
        this.counter++;
        const pos1 = this.entityManager.data[ComponentType.Position].get(
            ent1
        ) as PositionComponent;
        const col1 = this.entityManager.data[ComponentType.Collision].get(
            ent1
        ) as CollisionComponent;
        const pos2 = this.entityManager.data[ComponentType.Position].get(
            ent2
        ) as PositionComponent;
        const col2 = this.entityManager.data[ComponentType.Collision].get(
            ent2
        ) as CollisionComponent;
        return (
            pos1.x < pos2.x + col2.size &&
            pos1.x + col1.size > pos2.x &&
            pos1.y < pos2.y + col2.size &&
            pos1.y + col1.size > pos2.y
        );
    }
}