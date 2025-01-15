import { CType } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent, { Direction } from "../Components/DirectionComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
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
            if (entity.has(CType.Camera)) {
                this.mapScrollToCamera(entityId);
            }
            // Could add a InputComponent with its own input map. That way a camera can be controlled with inputs
            if (entity.has(CType.Player) || entity.has(CType.Camera)) {
                this.mapInputsToController(entityId);
            }

            if ((entity.get(CType.Controller) as ControllerComponent).roll) {
                (entity.get(CType.Health) as HealthComponent).invincibleCounter = (
                    entity.get(CType.Movement) as MovementComponent
                ).rollLength;
            }

            if (entity.has(CType.Direction)) {
                this.determineDirection(entityId);
            }
        }
    }

    private mapScrollToCamera(entityId: number): void {
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        con.zoom_in = this.inputManager.pressed(Input.Zoom_In);
        con.zoom_out = this.inputManager.pressed(Input.Zoom_Out);
    }

    private mapInputsToController(entityId: number): void {
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        con.up = this.inputManager.pressed(Input.Up);
        con.down = this.inputManager.pressed(Input.Down);
        con.left = this.inputManager.pressed(Input.Left);
        con.right = this.inputManager.pressed(Input.Right);
        con.interact = this.inputManager.pressed(Input.Interact);
        con.roll = this.inputManager.pressed(Input.Roll);
        con.primary = this.inputManager.pressed(Input.Primary);
        con.secondary = this.inputManager.pressed(Input.Secondary);
        con.ultimate = this.inputManager.pressed(Input.Ultimate);
        con.zoom_in = this.inputManager.pressed(Input.Zoom_In);
        con.zoom_out = this.inputManager.pressed(Input.Zoom_Out);
    }

    private determineDirection(entityId: number): void {
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        const dir = this.entityManager.get<DirectionComponent>(entityId, CType.Direction);
        if (dir.cooldown > 0) {
            dir.cooldown--;
            return;
        }
        dir.cooldown = 1;
        if (!con.up && con.right && con.down && con.left) {
            dir.direction = Direction.South;
        } else if (con.up && !con.right && con.down && con.left) {
            dir.direction = Direction.West;
        } else if (con.up && con.right && !con.down && con.left) {
            dir.direction = Direction.North;
        } else if (con.up && con.right && con.down && !con.left) {
            dir.direction = Direction.East;
        } else if (!con.up && !con.right && con.down && con.left) {
            dir.direction = Direction.SouthWest;
        } else if (con.up && !con.right && !con.down && con.left) {
            dir.direction = Direction.NorthWest;
        } else if (con.up && con.right && !con.down && !con.left) {
            dir.direction = Direction.NorthEast;
        } else if (!con.up && con.right && con.down && !con.left) {
            dir.direction = Direction.SouthEast;
        } else if (!con.up && !con.right && !con.down && con.left) {
            dir.direction = Direction.West;
        } else if (!con.up && !con.right && con.down && !con.left) {
            dir.direction = Direction.South;
        } else if (!con.up && con.right && !con.down && !con.left) {
            dir.direction = Direction.East;
        } else if (con.up && !con.right && !con.down && !con.left) {
            dir.direction = Direction.North;
        } else {
            dir.cooldown = 0;
        }
    }
}
