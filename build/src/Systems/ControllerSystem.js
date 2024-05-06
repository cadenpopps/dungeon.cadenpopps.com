import { CType } from "../Component.js";
import { Direction } from "../Components/DirectionComponent.js";
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
            if (this.entityManager.hasComponent(entityId, CType.Camera)) {
                this.mapScrollToCamera(entityId);
            }
            if (this.entityManager.hasComponent(entityId, CType.Player) ||
                this.entityManager.hasComponent(entityId, CType.Camera)) {
                this.mapInputsToController(entityId);
            }
            if (this.entityManager.hasComponent(entityId, CType.Movement)) {
                this.determineWalking(entityId);
            }
            if (this.entityManager.hasComponent(entityId, CType.Direction)) {
                this.determineDirection(entityId);
            }
        }
    }
    mapScrollToCamera(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        con.zoom_in = this.inputManager.pressed(Input.Zoom_In);
        con.zoom_out = this.inputManager.pressed(Input.Zoom_Out);
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
    determineWalking(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        const mov = this.entityManager.get(entityId, CType.Movement);
        if (con.up || con.right || con.down || con.left) {
            mov.walking = true;
        }
    }
    determineDirection(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        const dir = this.entityManager.get(entityId, CType.Direction);
        if (dir.cooldown > 0) {
            dir.cooldown--;
            return;
        }
        dir.cooldown = 1;
        if (!con.up && con.right && con.down && con.left) {
            dir.direction = Direction.South;
        }
        else if (con.up && !con.right && con.down && con.left) {
            dir.direction = Direction.West;
        }
        else if (con.up && con.right && !con.down && con.left) {
            dir.direction = Direction.North;
        }
        else if (con.up && con.right && con.down && !con.left) {
            dir.direction = Direction.East;
        }
        else if (!con.up && !con.right && con.down && con.left) {
            dir.direction = Direction.SouthWest;
        }
        else if (con.up && !con.right && !con.down && con.left) {
            dir.direction = Direction.NorthWest;
        }
        else if (con.up && con.right && !con.down && !con.left) {
            dir.direction = Direction.NorthEast;
        }
        else if (!con.up && con.right && con.down && !con.left) {
            dir.direction = Direction.SouthEast;
        }
        else if (!con.up && !con.right && !con.down && con.left) {
            dir.direction = Direction.West;
        }
        else if (!con.up && !con.right && con.down && !con.left) {
            dir.direction = Direction.South;
        }
        else if (!con.up && con.right && !con.down && !con.left) {
            dir.direction = Direction.East;
        }
        else if (con.up && !con.right && !con.down && !con.left) {
            dir.direction = Direction.North;
        }
        else {
            dir.cooldown = 0;
        }
    }
}
//# sourceMappingURL=ControllerSystem.js.map