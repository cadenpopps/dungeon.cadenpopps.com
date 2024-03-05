import { ComponentType, Direction } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class MovementSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Movement, eventManager, entityManager, [
            ComponentType.Velocity,
            ComponentType.Movement,
        ]);
        this.movementCooldown = 15;
    }
    logic() {
        for (let entityId of this.entities) {
            const movement = this.entityManager.data[ComponentType.Movement].get(entityId);
            const velocity = this.entityManager.data[ComponentType.Velocity].get(entityId);
            this.determineVelocity(movement, velocity);
        }
    }
    handleEvent(event) { }
    determineVelocity(movement, velocity) {
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
                    }
                    else {
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
                    }
                    else {
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
                    }
                    else {
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
                    }
                    else {
                        movement.previousDirection = Direction.NORTH;
                        velocity.x = 0;
                        velocity.y = -1;
                    }
                    break;
            }
        }
        else {
            movement.cooldown--;
            velocity.x = 0;
            velocity.y = 0;
        }
    }
}
//# sourceMappingURL=MovementSystem.js.map