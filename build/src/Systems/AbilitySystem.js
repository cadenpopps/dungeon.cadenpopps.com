import { CType } from "../Component.js";
import { AbilityType } from "../Components/AbilityComponent.js";
import HitboxComponent, { CircleHitboxComponent } from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import RotationComponent, { RotationDirectionMap } from "../Components/RotationComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class AbilitySystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Ability, eventManager, entityManager, [CType.Ability]);
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
    getEntitiesHelper() { }
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
        if (hitboxData !== null) {
            const damage = hitboxData.damage;
            const sourcePos = this.entityManager.get(entityId, CType.Position);
            const sourceDir = this.entityManager.get(entityId, CType.Direction).direction;
            const pos = new PositionComponent(sourcePos.x + hitboxData.x, sourcePos.y + hitboxData.y);
            const size = new SizeComponent(hitboxData.width, hitboxData.height);
            const sourceSize = this.entityManager.get(entityId, CType.Size);
            const rotationOffset = hitboxData.degrees || 0;
            const rotation = new RotationComponent(sourcePos, RotationDirectionMap.get(sourceDir) + rotationOffset);
            let hitbox;
            if (hitboxData.circle) {
                hitbox = new CircleHitboxComponent(hitboxData.x * sourceSize.width, hitboxData.y * sourceSize.height, hitboxData.width * sourceSize.width, hitboxData.frames, entityId, damage);
            }
            else {
                hitbox = new HitboxComponent(hitboxData.x * sourceSize.width, hitboxData.y * sourceSize.height, hitboxData.width * sourceSize.width, hitboxData.height * sourceSize.height, rotationOffset, hitboxData.frames, entityId, damage);
            }
            this.entityManager.addEntity(new Map([
                [CType.Position, pos],
                [CType.Size, size],
                [CType.Hitbox, hitbox],
                [CType.Rotation, rotation],
            ]));
        }
    }
}
//# sourceMappingURL=AbilitySystem.js.map