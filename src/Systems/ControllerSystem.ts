import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { Input, InputManager } from "../InputManager.js";
import { System, SystemType } from "../System.js";

export default class ControllerSystem extends System {
    private inputManager: InputManager;
    constructor(eventManager: EventManager, entityManager: EntityManager, inputManager: InputManager) {
        super(SystemType.Controller, eventManager, entityManager, [CType.Controller]);
        this.inputManager = inputManager;
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const controller = entity.get(CType.Controller) as ControllerComponent;
            controller.up = this.inputManager.pressed(Input.Up);
            controller.down = this.inputManager.pressed(Input.Down);
            controller.left = this.inputManager.pressed(Input.Left);
            controller.right = this.inputManager.pressed(Input.Right);
            controller.interact = this.inputManager.pressed(Input.Interact);
            controller.roll = this.inputManager.pressed(Input.Roll);
            controller.sneak = this.inputManager.pressed(Input.Sneak);
            controller.sneak = this.inputManager.pressed(Input.Sneak);
            controller.zoom_in = this.inputManager.pressed(Input.Zoom_In);
            controller.zoom_out = this.inputManager.pressed(Input.Zoom_Out);
        }
    }
}
