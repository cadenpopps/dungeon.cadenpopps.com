import { distance, oneIn } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { Behavior } from "../Components/AIComponent.js";
import { AbilityType } from "../Components/AbilityComponent.js";
import { Direction } from "../Components/DirectionComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { getEntitiesInRange } from "../Constants.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class AISystem extends System {
    playerId;
    constructor(eventManager, entityManager) {
        super(SystemType.AI, eventManager, entityManager, [CType.AI, CType.Controller, CType.Ability]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const entitiesInRange = getEntitiesInRange(new PositionComponent(cam.x, cam.y), cam.visibleDistance, this.entities, this.entityManager);
        for (let entityId of entitiesInRange) {
            console.log();
            const ai = this.entityManager.get(entityId, CType.AI);
            if (ai.waitTimer > 0) {
                ai.waitTimer--;
            }
            else {
                this.determineAction(entityId, ai);
                this.takeAction(entityId, ai);
            }
        }
    }
    getEntitiesHelper() {
        this.playerId = this.entityManager.getSystemEntities([CType.Player])[0];
    }
    determineAction(entityId, ai) {
        if (ai.noticedPlayer) {
            if (ai.behavior === Behavior.WindUp) {
                ai.behavior = Behavior.Attack;
            }
            else {
                if (this.inCombatRange(entityId)) {
                    ai.behavior = Behavior.WindUp;
                    ai.waitTimer = 20;
                }
                else {
                    ai.behavior = Behavior.MoveIntoCombatRange;
                }
            }
        }
        else {
            if (this.canSeePlayer(entityId, ai)) {
                ai.behavior = Behavior.MoveIntoCombatRange;
                ai.noticedPlayer = true;
            }
            else if (ai.behavior === Behavior.Stop) {
                if (oneIn(100)) {
                    ai.behavior = Behavior.Wander;
                }
            }
            else if (ai.behavior === Behavior.Wander) {
                if (oneIn(25)) {
                    ai.behavior = Behavior.Stop;
                }
            }
            else {
                ai.behavior = Behavior.Stop;
            }
        }
    }
    takeAction(entityId, ai) {
        const con = this.entityManager.get(entityId, CType.Controller);
        switch (ai.behavior) {
            case Behavior.Stop:
            case Behavior.WindUp:
            case Behavior.Retreat:
                this.stop(con);
                break;
            case Behavior.Wander:
                this.wander(con);
                break;
            case Behavior.MoveIntoCombatRange:
                this.moveIntoCombatRange(entityId, con);
                break;
            case Behavior.Attack:
                this.attack(entityId, con, ai);
                break;
        }
    }
    canSeePlayer(entityId, ai) {
        const vis = this.entityManager.get(entityId, CType.Visible);
        if (!vis.visible) {
            return false;
        }
        const pos = this.entityManager.get(entityId, CType.Position);
        const playerPos = this.entityManager.get(this.playerId, CType.Position);
        const dir = this.entityManager.get(entityId, CType.Direction);
        if (pos.x <= playerPos.x && pos.y <= playerPos.y) {
            return (dir.direction === Direction.East ||
                dir.direction === Direction.SouthEast ||
                dir.direction === Direction.South);
        }
        else if (pos.x >= playerPos.x && pos.y <= playerPos.y) {
            return (dir.direction === Direction.West ||
                dir.direction === Direction.SouthWest ||
                dir.direction === Direction.South);
        }
        else if (pos.x <= playerPos.x && pos.y >= playerPos.y) {
            return (dir.direction === Direction.East ||
                dir.direction === Direction.NorthEast ||
                dir.direction === Direction.North);
        }
        else if (pos.x >= playerPos.x && pos.y >= playerPos.y) {
            return (dir.direction === Direction.West ||
                dir.direction === Direction.NorthWest ||
                dir.direction === Direction.North);
        }
        return false;
    }
    inCombatRange(entityId) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const playerPos = this.entityManager.get(this.playerId, CType.Position);
        return distance(pos.x, pos.y, playerPos.x, playerPos.y) < 2;
    }
    stop(con) {
        con.up = false;
        con.down = false;
        con.right = false;
        con.left = false;
        con.primary = false;
        con.secondary = false;
        con.ultimate = false;
    }
    wander(con) {
        if (con.up || con.down || con.right || con.left) {
            return;
        }
        con.up = oneIn(4);
        con.down = oneIn(4);
        con.right = oneIn(4);
        con.left = oneIn(4);
    }
    moveIntoCombatRange(entityId, con) {
        this.stop(con);
        const pos = this.entityManager.get(entityId, CType.Position);
        const playerPos = this.entityManager.get(this.playerId, CType.Position);
        if (pos.x < playerPos.x - 0.5) {
            con.right = true;
            con.left = false;
        }
        if (pos.x > playerPos.x + 0.5) {
            con.right = false;
            con.left = true;
        }
        if (pos.y < playerPos.y - 0.5) {
            con.up = false;
            con.down = true;
        }
        if (pos.y > playerPos.y + 0.5) {
            con.up = true;
            con.down = false;
        }
    }
    attack(entityId, con, ai) {
        this.stop(con);
        const abilities = this.entityManager.get(entityId, CType.Ability);
        if (abilities.ultimate.type !== AbilityType.None && abilities.ultimate.cooldown === 0) {
            con.ultimate = true;
            ai.waitTimer = abilities.ultimate.duration;
        }
        else if (abilities.secondary.type !== AbilityType.None && abilities.secondary.cooldown === 0) {
            con.secondary = true;
            ai.waitTimer = abilities.secondary.duration;
        }
        else if (abilities.primary.type !== AbilityType.None && abilities.primary.cooldown === 0) {
            con.primary = true;
            ai.waitTimer = abilities.primary.duration;
        }
        ai.behavior = Behavior.Retreat;
    }
}
//# sourceMappingURL=AISystem.js.map