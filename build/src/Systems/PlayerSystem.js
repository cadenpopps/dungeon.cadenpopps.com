import { CType, Direction } from "../Component.js";
import { System, SystemType } from "../System.js";
export default class PlayerSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Player]);
    }
    logic() {
        for (let entityId of this.entities) {
            const con = this.entityManager.get(entityId, CType.Controller);
            const mov = this.entityManager.get(entityId, CType.Movement);
            this.determineMovement(con, mov);
        }
    }
    determineMovement(controller, movement) {
        if (controller.up && controller.right && controller.down && controller.left) {
            movement.direction = Direction.NONE;
        }
        else if (!controller.up && controller.right && controller.down && controller.left) {
            movement.direction = Direction.SOUTH;
        }
        else if (controller.up && !controller.right && controller.down && controller.left) {
            movement.direction = Direction.WEST;
        }
        else if (controller.up && controller.right && !controller.down && controller.left) {
            movement.direction = Direction.NORTH;
        }
        else if (controller.up && controller.right && controller.down && !controller.left) {
            movement.direction = Direction.EAST;
        }
        else if (!controller.up && !controller.right && controller.down && controller.left) {
            movement.direction = Direction.SOUTHWEST;
        }
        else if (controller.up && !controller.right && !controller.down && controller.left) {
            movement.direction = Direction.NORTHWEST;
        }
        else if (controller.up && controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NORTHEAST;
        }
        else if (!controller.up && controller.right && controller.down && !controller.left) {
            movement.direction = Direction.SOUTHEAST;
        }
        else if (!controller.up && !controller.right && !controller.down && controller.left) {
            movement.direction = Direction.WEST;
        }
        else if (!controller.up && !controller.right && controller.down && !controller.left) {
            movement.direction = Direction.SOUTH;
        }
        else if (!controller.up && controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.EAST;
        }
        else if (controller.up && !controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NORTH;
        }
        else if (!controller.up && !controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NONE;
        }
    }
}
//# sourceMappingURL=PlayerSystem.js.map