import { ComponentType, Direction } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class PlayerSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Player, eventManager, entityManager, [
            ComponentType.Controller,
            ComponentType.Movement,
        ]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const controller = this.entityManager.data[
                ComponentType.Controller
            ].get(entityId) as ControllerComponent;
            const movement = this.entityManager.data[
                ComponentType.Movement
            ].get(entityId) as MovementComponent;
            this.determineMovement(controller, movement);
        }
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.level_down:
                for (let entitiyId of this.entities) {
                    const pos = this.entityManager.data[
                        ComponentType.Position
                    ].get(entitiyId) as PositionComponent;
                    pos.z++;
                }
                break;
            case Event.level_up:
                for (let entitiyId of this.entities) {
                    const pos = this.entityManager.data[
                        ComponentType.Position
                    ].get(entitiyId) as PositionComponent;
                    pos.z--;
                }
                break;
        }
    }

    private determineMovement(
        controller: ControllerComponent,
        movement: MovementComponent
    ) {
        if (
            controller.up &&
            controller.right &&
            controller.down &&
            controller.left
        ) {
            movement.direction = Direction.NONE;
        } else if (
            !controller.up &&
            controller.right &&
            controller.down &&
            controller.left
        ) {
            movement.direction = Direction.SOUTH;
        } else if (
            controller.up &&
            !controller.right &&
            controller.down &&
            controller.left
        ) {
            movement.direction = Direction.WEST;
        } else if (
            controller.up &&
            controller.right &&
            !controller.down &&
            controller.left
        ) {
            movement.direction = Direction.NORTH;
        } else if (
            controller.up &&
            controller.right &&
            controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.EAST;
        } else if (
            !controller.up &&
            !controller.right &&
            controller.down &&
            controller.left
        ) {
            movement.direction = Direction.SOUTHWEST;
        } else if (
            controller.up &&
            !controller.right &&
            !controller.down &&
            controller.left
        ) {
            movement.direction = Direction.NORTHWEST;
        } else if (
            controller.up &&
            controller.right &&
            !controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.NORTHEAST;
        } else if (
            !controller.up &&
            controller.right &&
            controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.SOUTHEAST;
        } else if (
            !controller.up &&
            !controller.right &&
            !controller.down &&
            controller.left
        ) {
            movement.direction = Direction.WEST;
        } else if (
            !controller.up &&
            !controller.right &&
            controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.SOUTH;
        } else if (
            !controller.up &&
            controller.right &&
            !controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.EAST;
        } else if (
            controller.up &&
            !controller.right &&
            !controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.NORTH;
        } else if (
            !controller.up &&
            !controller.right &&
            !controller.down &&
            !controller.left
        ) {
            movement.direction = Direction.NONE;
        }
    }
}
