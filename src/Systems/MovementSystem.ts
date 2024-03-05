import { ComponentType, Direction } from "../Component.js";
import MovementComponent from "../Components/MovementComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class MovementSystem extends System {
    private movementCooldown = 15;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Movement, eventManager, entityManager, [
            ComponentType.Velocity,
            ComponentType.Movement,
        ]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const movement = this.entityManager.data[
                ComponentType.Movement
            ].get(entityId) as MovementComponent;
            const velocity = this.entityManager.data[
                ComponentType.Velocity
            ].get(entityId) as VelocityComponent;
            this.determineVelocity(movement, velocity);
        }
    }

    public handleEvent(event: Event): void {}

    private determineVelocity(
        movement: MovementComponent,
        velocity: VelocityComponent
    ): void {
        if (movement.cooldown === 0) {
            movement.cooldown = this.movementCooldown;
            switch (movement.direction) {
                case Direction.NONE:
                    movement.previousDirection = Direction.NONE;
                    velocity.x = 0;
                    velocity.y = 0;
                    break;
                case Direction.NORTH:
                    movement.previousDirection = Direction.NORTH;
                    velocity.x = 0;
                    velocity.y = -1;
                    break;
                case Direction.EAST:
                    movement.previousDirection = Direction.EAST;
                    velocity.x = 1;
                    velocity.y = 0;
                    break;
                case Direction.SOUTH:
                    movement.previousDirection = Direction.SOUTH;
                    velocity.x = 0;
                    velocity.y = 1;
                    break;
                case Direction.WEST:
                    movement.previousDirection = Direction.WEST;
                    velocity.x = -1;
                    velocity.y = 0;
                    break;
                case Direction.NORTHEAST:
                    if (movement.previousDirection === Direction.NORTH) {
                        movement.previousDirection = Direction.EAST;
                        velocity.x = 1;
                        velocity.y = 0;
                    } else {
                        movement.previousDirection = Direction.NORTH;
                        velocity.x = 0;
                        velocity.y = -1;
                    }
                    break;
                case Direction.SOUTHEAST:
                    if (movement.previousDirection === Direction.SOUTH) {
                        movement.previousDirection = Direction.EAST;
                        velocity.x = 1;
                        velocity.y = 0;
                    } else {
                        movement.previousDirection = Direction.SOUTH;
                        velocity.x = 0;
                        velocity.y = 1;
                    }
                    break;
                case Direction.SOUTHWEST:
                    if (movement.previousDirection === Direction.SOUTH) {
                        movement.previousDirection = Direction.WEST;
                        velocity.x = -1;
                        velocity.y = 0;
                    } else {
                        movement.previousDirection = Direction.SOUTH;
                        velocity.x = 0;
                        velocity.y = 1;
                    }
                    break;
                case Direction.NORTHWEST:
                    if (movement.previousDirection === Direction.NORTH) {
                        movement.previousDirection = Direction.WEST;
                        velocity.x = -1;
                        velocity.y = 0;
                    } else {
                        movement.previousDirection = Direction.NORTH;
                        velocity.x = 0;
                        velocity.y = -1;
                    }
                    break;
            }
        } else {
            movement.cooldown--;
            velocity.x = 0;
            velocity.y = 0;
        }
    }
}
