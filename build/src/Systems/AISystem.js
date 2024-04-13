import { random, randomIntInRange } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { Behavior } from "../Components/AIComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class AISystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.AI, eventManager, entityManager, [CType.AI]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const entitiesInRange = getEntitiesInRange(new PositionComponent(cam.x, cam.y), cam.visibleDistance, this.entities, this.entityManager);
        for (let entityId of entitiesInRange) {
            this.determineAction(entityId);
            this.takeAction(entityId);
        }
    }
    getEntitiesHelper() {
    }
    determineAction(entityId) {
        const ai = this.entityManager.get(entityId, CType.AI);
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
    takeAction(entityId) {
        const ai = this.entityManager.get(entityId, CType.AI);
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
    stop(entityId) {
        const con = this.entityManager.get(entityId, CType.Controller);
        con.up = false;
        con.down = false;
        con.right = false;
        con.left = false;
    }
    wander(entityId, ai) {
        const con = this.entityManager.get(entityId, CType.Controller);
        con.up = random(2) < 1;
        con.down = random(2) < 1;
        con.right = random(2) < 1;
        con.left = random(2) < 1;
        ai.behavior = Behavior.None;
        ai.actionCountdown = randomIntInRange(15, 25);
        ai.actionCooldown = randomIntInRange(100, 250);
    }
}
//# sourceMappingURL=AISystem.js.map