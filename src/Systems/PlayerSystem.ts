import { CType, Direction } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class PlayerSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Controller, CType.Movement]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
            const mov = this.entityManager.get<MovementComponent>(entityId, CType.Movement);
            this.determineMovement(con, mov);
        }
    }

    private determineMovement(controller: ControllerComponent, movement: MovementComponent) {
        if (controller.up && controller.right && controller.down && controller.left) {
            movement.direction = Direction.NONE;
        } else if (!controller.up && controller.right && controller.down && controller.left) {
            movement.direction = Direction.SOUTH;
        } else if (controller.up && !controller.right && controller.down && controller.left) {
            movement.direction = Direction.WEST;
        } else if (controller.up && controller.right && !controller.down && controller.left) {
            movement.direction = Direction.NORTH;
        } else if (controller.up && controller.right && controller.down && !controller.left) {
            movement.direction = Direction.EAST;
        } else if (!controller.up && !controller.right && controller.down && controller.left) {
            movement.direction = Direction.SOUTHWEST;
        } else if (controller.up && !controller.right && !controller.down && controller.left) {
            movement.direction = Direction.NORTHWEST;
        } else if (controller.up && controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NORTHEAST;
        } else if (!controller.up && controller.right && controller.down && !controller.left) {
            movement.direction = Direction.SOUTHEAST;
        } else if (!controller.up && !controller.right && !controller.down && controller.left) {
            movement.direction = Direction.WEST;
        } else if (!controller.up && !controller.right && controller.down && !controller.left) {
            movement.direction = Direction.SOUTH;
        } else if (!controller.up && controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.EAST;
        } else if (controller.up && !controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NORTH;
        } else if (!controller.up && !controller.right && !controller.down && !controller.left) {
            movement.direction = Direction.NONE;
        }
    }
}
