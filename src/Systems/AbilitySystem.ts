import { CType, Component } from "../Component.js";
import AbilityComponent, { Ability, AbilityType, SlashAttack, SpinAttack } from "../Components/AbilityComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import HitboxComponent from "../Components/HitboxComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";

export default class AbilitySystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Ability, eventManager, entityManager, [CType.Ability]);
    }

    public logic(): void {
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        const entityIds = VisibleSystem.getVisibleAndDiscoveredEntities(this.entities, this.entityManager);
        for (let entityId of entityIds) {
            const entity = this.entityManager.getEntity(entityId);
            const ability = entity.get(CType.Ability) as AbilityComponent;
            const con = entity.get(CType.Controller) as ControllerComponent;
            this.determineActiveAbility(con, ability);
            if (ability.primary.currentTick > 0) {
                this.ability(entityId, ability.primary);
            }
            if (ability.secondary.currentTick > 0) {
                this.ability(entityId, ability.secondary);
            }
            if (ability.ultimate.currentTick > 0) {
                this.ability(entityId, ability.ultimate);
            }
            this.decrementCooldownAndCurrentTick(ability);
        }
    }

    public getEntitiesHelper(): void {}

    private determineActiveAbility(con: ControllerComponent, ability: AbilityComponent): void {
        if (con.primary && ability.primary.cooldown === 0) {
            ability.primary.currentTick = ability.primary.duration;
            ability.primary.cooldown = ability.primary.cooldownLength;
            ability.secondary.currentTick = 0;
            ability.ultimate.currentTick = 0;
        }
        if (con.secondary && ability.secondary.cooldown === 0) {
            ability.secondary.currentTick = ability.secondary.duration;
            ability.secondary.cooldown = ability.secondary.cooldownLength;
            ability.primary.currentTick = 0;
            ability.ultimate.currentTick = 0;
        }
        if (con.ultimate && ability.ultimate.cooldown === 0) {
            ability.ultimate.currentTick = ability.ultimate.duration;
            ability.ultimate.cooldown = ability.ultimate.cooldownLength;
            ability.primary.currentTick = 0;
            ability.secondary.currentTick = 0;
        }
    }

    private ability(entityId: number, ability: Ability): void {
        switch (ability.type) {
            case AbilityType.SpinAttack:
                this.spinAttack(entityId, ability);
                break;
            case AbilityType.SlashAttack:
                this.slashAttack(entityId, ability);
                break;
            default:
                console.log(`Ability ${ability.type} not found`);
                break;
        }
    }

    private decrementCooldownAndCurrentTick(ability: AbilityComponent): void {
        if (ability.primary.cooldown > 0) {
            ability.primary.cooldown--;
        }
        if (ability.primary.currentTick > 0) {
            ability.primary.currentTick--;
        }
        if (ability.secondary.cooldown > 0) {
            ability.secondary.cooldown--;
        }
        if (ability.secondary.currentTick > 0) {
            ability.secondary.currentTick--;
        }
        if (ability.ultimate.cooldown > 0) {
            ability.ultimate.cooldown--;
        }
        if (ability.ultimate.currentTick > 0) {
            ability.ultimate.currentTick--;
        }
    }

    private spinAttack(entityId: number, ability: SpinAttack): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const hitbox = ability.frames[ability.currentTick];
        if (hitbox.active) {
            const newHitbox = new HitboxComponent(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                hitbox.height,
                hitbox.framesActive,
                entityId
            );
            this.entityManager.addEntity(
                new Map<CType, Component>([
                    [CType.Position, pos],
                    [CType.Hitbox, newHitbox],
                ])
            );
        }
    }

    private slashAttack(entityId: number, ability: SlashAttack): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const hitbox = ability.frames[ability.currentTick];
        if (hitbox.active) {
            const newHitbox = new HitboxComponent(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                hitbox.height,
                hitbox.framesActive,
                entityId
            );
            this.entityManager.addEntity(
                new Map<CType, Component>([
                    [CType.Position, pos],
                    [CType.Hitbox, newHitbox],
                ])
            );
        }
    }
}
