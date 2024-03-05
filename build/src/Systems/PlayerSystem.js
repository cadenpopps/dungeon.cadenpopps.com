import { ComponentType, Direction } from "../Component.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class PlayerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Player, eventManager, entityManager, [
            ComponentType.Controller,
            ComponentType.Movement,
        ]);
    }
    logic() {
        for (let entityId of this.entities) {
            const controller = this.entityManager.data[ComponentType.Controller].get(entityId);
            const movement = this.entityManager.data[ComponentType.Movement].get(entityId);
            this.determineMovement(controller, movement);
        }
    }
    handleEvent(event) {
        switch (event) {
            case Event.level_down:
                for (let entitiyId of this.entities) {
                    const pos = this.entityManager.data[ComponentType.Position].get(entitiyId);
                    pos.z++;
                }
                break;
            case Event.level_up:
                for (let entitiyId of this.entities) {
                    const pos = this.entityManager.data[ComponentType.Position].get(entitiyId);
                    pos.z--;
                }
                break;
        }
    }
    determineMovement(controller, movement) {
        if (controller.up &&
            controller.right &&
            controller.down &&
            controller.left) {
            movement.direction = Direction.NONE;
        }
        else if (!controller.up &&
            controller.right &&
            controller.down &&
            controller.left) {
            movement.direction = Direction.SOUTH;
        }
        else if (controller.up &&
            !controller.right &&
            controller.down &&
            controller.left) {
            movement.direction = Direction.WEST;
        }
        else if (controller.up &&
            controller.right &&
            !controller.down &&
            controller.left) {
            movement.direction = Direction.NORTH;
        }
        else if (controller.up &&
            controller.right &&
            controller.down &&
            !controller.left) {
            movement.direction = Direction.EAST;
        }
        else if (!controller.up &&
            !controller.right &&
            controller.down &&
            controller.left) {
            movement.direction = Direction.SOUTHWEST;
        }
        else if (controller.up &&
            !controller.right &&
            !controller.down &&
            controller.left) {
            movement.direction = Direction.NORTHWEST;
        }
        else if (controller.up &&
            controller.right &&
            !controller.down &&
            !controller.left) {
            movement.direction = Direction.NORTHEAST;
        }
        else if (!controller.up &&
            controller.right &&
            controller.down &&
            !controller.left) {
            movement.direction = Direction.SOUTHEAST;
        }
        else if (!controller.up &&
            !controller.right &&
            !controller.down &&
            controller.left) {
            movement.direction = Direction.WEST;
        }
        else if (!controller.up &&
            !controller.right &&
            controller.down &&
            !controller.left) {
            movement.direction = Direction.SOUTH;
        }
        else if (!controller.up &&
            controller.right &&
            !controller.down &&
            !controller.left) {
            movement.direction = Direction.EAST;
        }
        else if (controller.up &&
            !controller.right &&
            !controller.down &&
            !controller.left) {
            movement.direction = Direction.NORTH;
        }
        else if (!controller.up &&
            !controller.right &&
            !controller.down &&
            !controller.left) {
            movement.direction = Direction.NONE;
        }
    }
}
//# sourceMappingURL=PlayerSystem.js.map