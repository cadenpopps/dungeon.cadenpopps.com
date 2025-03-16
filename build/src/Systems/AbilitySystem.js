import { CType } from "../Component.js";
import { AbilityType } from "../Components/AbilityComponent.js";
import HitboxComponent from "../Components/HitboxComponent.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class AbilitySystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Ability, eventManager, entityManager, [CType.Ability, CType.Controller]);
    }
    logic() {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const entityIds = VisibleSystem.getVisibleAndDiscoveredEntities(this.entities, this.entityManager);
        for (let entityId of entityIds) {
            const entity = this.entityManager.getEntity(entityId);
            const ability = entity.get(CType.Ability);
            const con = entity.get(CType.Controller);
            this.determineActiveAbility(con, ability);
            if (ability.primary.currentTick >= 0) {
                this.ability(entityId, ability.primary);
            }
            if (ability.secondary.currentTick >= 0) {
                this.ability(entityId, ability.secondary);
            }
            if (ability.ultimate.currentTick >= 0) {
                this.ability(entityId, ability.ultimate);
            }
            this.decrementCooldownAndCurrentTick(ability);
        }
    }
    determineActiveAbility(con, ability) {
        if (con.primary && ability.primary.cooldown === 0) {
            ability.primary.currentTick = ability.primary.duration;
            ability.primary.cooldown = ability.primary.cooldownLength;
            ability.secondary.currentTick = -1;
            ability.ultimate.currentTick = -1;
        }
        if (con.secondary && ability.secondary.cooldown === 0) {
            ability.secondary.currentTick = ability.secondary.duration;
            ability.secondary.cooldown = ability.secondary.cooldownLength;
            ability.primary.currentTick = -1;
            ability.ultimate.currentTick = -1;
        }
        if (con.ultimate && ability.ultimate.cooldown === 0) {
            ability.ultimate.currentTick = ability.ultimate.duration;
            ability.ultimate.cooldown = ability.ultimate.cooldownLength;
            ability.primary.currentTick = -1;
            ability.secondary.currentTick = -1;
        }
    }
    ability(entityId, ability) {
        switch (ability.type) {
            case AbilityType.SpinAttack:
                this.spawnHitbox(entityId, ability);
                break;
            case AbilityType.SlashAttack:
                this.spawnHitbox(entityId, ability);
                break;
            default:
                console.log(`Ability ${ability.type} not found`);
                break;
        }
    }
    decrementCooldownAndCurrentTick(ability) {
        if (ability.primary.cooldown > 0) {
            ability.primary.cooldown--;
        }
        if (ability.primary.currentTick >= 0) {
            ability.primary.currentTick--;
        }
        if (ability.secondary.cooldown > 0) {
            ability.secondary.cooldown--;
        }
        if (ability.secondary.currentTick >= 0) {
            ability.secondary.currentTick--;
        }
        if (ability.ultimate.cooldown > 0) {
            ability.ultimate.cooldown--;
        }
        if (ability.ultimate.currentTick >= 0) {
            ability.ultimate.currentTick--;
        }
    }
    spawnHitbox(entityId, ability) {
        const hitboxData = ability.frames[ability.duration - ability.currentTick];
        for (const hitbox of hitboxData) {
            const sourceSize = this.entityManager.get(entityId, CType.Size);
            this.entityManager.addEntity([
                new HitboxComponent(hitbox.shape, hitbox.x * sourceSize.width, hitbox.y * sourceSize.height, hitbox.width * sourceSize.width, hitbox.height * sourceSize.height, hitbox.rotation, hitbox.duration, entityId, hitbox.damage),
            ]);
        }
    }
}
//# sourceMappingURL=AbilitySystem.js.map