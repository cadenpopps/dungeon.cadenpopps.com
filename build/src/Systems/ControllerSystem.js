import { CType } from "../Component.js";
import { Input } from "../InputManager.js";
import { System, SystemType } from "../System.js";
export default class ControllerSystem extends System {
    inputManager;
    constructor(eventManager, entityManager, inputManager) {
        super(SystemType.Controller, eventManager, entityManager, [CType.Controller]);
        this.inputManager = inputManager;
    }
    logic() {
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const controller = entity.get(CType.Controller);
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
//# sourceMappingURL=ControllerSystem.js.map