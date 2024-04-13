import { random, randomIntInRange } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AIComponent, { Behavior } from "../Components/AIComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class AISystem extends System {
    // private playerId!: number;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.AI, eventManager, entityManager, [CType.AI]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const entitiesInRange = getEntitiesInRange(
            new PositionComponent(cam.x, cam.y),
            cam.visibleDistance,
            this.entities,
            this.entityManager
        );
        for (let entityId of entitiesInRange) {
            this.determineAction(entityId);
            this.takeAction(entityId);
        }
    }

    public getEntitiesHelper(): void {
        // this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }

    private determineAction(entityId: number): void {
        const ai = this.entityManager.get<AIComponent>(entityId, CType.AI);
        if (ai.actionCountdown === 0 && ai.actionCooldown === 0) {
            ai.behavior = Behavior.Wander;
        }
        if (ai.actionCountdown > 0) {
            ai.actionCountdown--;
        }
        if (ai.actionCooldown > 0) {
            ai.actionCooldown--;
        }
    }

    private takeAction(entityId: number): void {
        const ai = this.entityManager.get<AIComponent>(entityId, CType.AI);
        if (ai.actionCountdown === 0) {
            switch (ai.behavior) {
                case Behavior.None:
                    this.stop(entityId);
                    break;
                case Behavior.Wander:
                    this.wander(entityId, ai);
                    break;
            }
        }
    }

    private stop(entityId: number): void {
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        con.up = false;
        con.down = false;
        con.right = false;
        con.left = false;
    }

    private wander(entityId: number, ai: AIComponent): void {
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        con.up = random(2) < 1;
        con.down = random(2) < 1;
        con.right = random(2) < 1;
        con.left = random(2) < 1;
        ai.behavior = Behavior.None;
        ai.actionCountdown = randomIntInRange(15, 25);
        ai.actionCooldown = randomIntInRange(100, 250);
    }
}
