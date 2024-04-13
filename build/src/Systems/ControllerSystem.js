import { CType } from "../Component.js";
import { Direction } from "../Components/MovementComponent.js";
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
            if (this.entityManager.getEntity(entityId).has(CType.Player)) {
                this.mapInputsToController(entityId);
            }
            this.determineDirection(entityId);
        }
    }
    mapInputsToController(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        con.up = this.inputManager.pressed(Input.Up);
        con.down = this.inputManager.pressed(Input.Down);
        con.left = this.inputManager.pressed(Input.Left);
        con.right = this.inputManager.pressed(Input.Right);
        con.interact = this.inputManager.pressed(Input.Interact);
        con.roll = this.inputManager.pressed(Input.Roll);
        con.sneak = this.inputManager.pressed(Input.Sneak);
        con.primary = this.inputManager.pressed(Input.Primary);
        con.secondary = this.inputManager.pressed(Input.Secondary);
        con.ultimate = this.inputManager.pressed(Input.Ultimate);
        con.zoom_in = this.inputManager.pressed(Input.Zoom_In);
        con.zoom_out = this.inputManager.pressed(Input.Zoom_Out);
    }
    determineDirection(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        const mov = this.entityManager.get(entityId, CType.Movement);
        if (!con.up && con.right && con.down && con.left) {
            mov.direction = Direction.SOUTH;
        }
        else if (con.up && !con.right && con.down && con.left) {
            mov.direction = Direction.WEST;
        }
        else if (con.up && con.right && !con.down && con.left) {
            mov.direction = Direction.NORTH;
        }
        else if (con.up && con.right && con.down && !con.left) {
            mov.direction = Direction.EAST;
        }
        else if (!con.up && !con.right && con.down && con.left) {
            mov.direction = Direction.SOUTHWEST;
        }
        else if (con.up && !con.right && !con.down && con.left) {
            mov.direction = Direction.NORTHWEST;
        }
        else if (con.up && con.right && !con.down && !con.left) {
            mov.direction = Direction.NORTHEAST;
        }
        else if (!con.up && con.right && con.down && !con.left) {
            mov.direction = Direction.SOUTHEAST;
        }
        else if (!con.up && !con.right && !con.down && con.left) {
            mov.direction = Direction.WEST;
        }
        else if (!con.up && !con.right && con.down && !con.left) {
            mov.direction = Direction.SOUTH;
        }
        else if (!con.up && con.right && !con.down && !con.left) {
            mov.direction = Direction.EAST;
        }
        else if (con.up && !con.right && !con.down && !con.left) {
            mov.direction = Direction.NORTH;
        }
        else {
            mov.direction = Direction.NONE;
        }
    }
}
//# sourceMappingURL=ControllerSystem.js.map