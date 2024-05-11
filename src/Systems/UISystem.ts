import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AbilityComponent from "../Components/AbilityComponent.js";
import CameraComponent from "../Components/CameraComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import InteractableComponent from "../Components/InteractableComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import UIComponent, {
    UIAbilityCooldowns,
    UIEnemyHealthBar,
    UIInteractablePrompt,
    UIPlayerHealthBar,
    UIToolTip,
    UIType,
} from "../Components/UIComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { DEFAULT_REVERSE_CONTROLLER_MAP, Input } from "../InputManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";

export default class UISystem extends System {
    private canvas: PoppsCanvas;
    private layers: Array<Array<number>>;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.UI, eventManager, entityManager, [CType.UI]);
        this.canvas = new PoppsCanvas(2);
        this.layers = Array<Array<number>>();
        this.canvas.loop(this.canvasCallback.bind(this));
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.groupEntitiesByLayer();
                break;
            case Event.level_loaded:
                this.groupEntitiesByLayer();
                break;
        }
    }

    public getEntitiesHelper(): void {}

    private canvasCallback(): void {
        this.canvas.clear();
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        for (let layer of this.layers) {
            const entityIds = VisibleSystem.getVisibleAndDiscoveredEntities(layer, this.entityManager);
            for (let entityId of entityIds) {
                const ui = this.entityManager.get<UIComponent>(entityId, CType.UI);
                for (let element of ui.elements) {
                    switch (element.type) {
                        case UIType.PlayerHealthBar:
                            this.playerHealthBar(entityId, element as UIPlayerHealthBar);
                            break;
                        case UIType.EnemyHeatlhBar:
                            this.enemyHeatlhBar(entityId, element as UIEnemyHealthBar, cam);
                            break;
                        case UIType.AbilityCooldowns:
                            this.abilityCooldowns(entityId, element as UIAbilityCooldowns);
                            break;
                        case UIType.InteractablePrompt:
                            this.interactablePrompt(entityId, element as UIInteractablePrompt, cam);
                            break;
                        case UIType.Tooltip:
                            this.tooltip(entityId, element as UIToolTip, cam);
                            break;
                    }
                    this.canvas.canvas.resetTransform();
                }
            }
        }
    }

    private groupEntitiesByLayer(): void {
        this.layers = new Array<Array<number>>();
        for (let entityId of this.entities) {
            const ui = this.entityManager.get<VisibleComponent>(entityId, CType.UI);
            while (this.layers.length - 1 < ui.layer) {
                this.layers.push([]);
            }
            this.layers[ui.layer].push(entityId);
        }
    }

    private playerHealthBar(entityId: number, ui: UIPlayerHealthBar): void {
        const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
        ui.percentage = health.currentHealth / health.maxHealth;
        this.canvas.fill(ui.colorEmpty.r, ui.colorEmpty.g, ui.colorEmpty.b, ui.colorEmpty.a);
        this.canvas.rect(ui.x, this.canvas.height - ui.y, ui.width, ui.height);
        this.canvas.fill(ui.colorFull.r, ui.colorFull.g, ui.colorFull.b, ui.colorFull.a);
        this.canvas.rect(ui.x, this.canvas.height - ui.y, ui.width * ui.percentage, ui.height);
    }

    private enemyHeatlhBar(entityId: number, ui: UIEnemyHealthBar, cam: CameraComponent): void {
        const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
        ui.percentage = health.currentHealth / health.maxHealth;
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom),
            floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom)
        );
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        this.canvas.fill(ui.colorEmpty.r, ui.colorEmpty.g, ui.colorEmpty.b, ui.colorEmpty.a);
        this.canvas.rect(pos.x + ui.x - ui.width / 2, pos.y + ui.y - ui.height / 2, ui.width, ui.height);
        this.canvas.fill(ui.colorFull.r, ui.colorFull.g, ui.colorFull.b, ui.colorFull.a);
        this.canvas.rect(
            pos.x + ui.x - ui.width / 2,
            pos.y + ui.y - ui.height / 2,
            ui.width * ui.percentage,
            ui.height
        );
    }

    private abilityCooldowns(entityId: number, ui: UIAbilityCooldowns): void {
        const abilityUISize = 64;
        const abilityUIMargin = 16;
        const ability = this.entityManager.get<AbilityComponent>(entityId, CType.Ability);
        ui.percentagePrimary = ability.primary.cooldown / ability.primary.cooldownLength;
        ui.percentageSecondary = ability.secondary.cooldown / ability.secondary.cooldownLength;
        ui.percentageUltimate = ability.ultimate.cooldown / ability.ultimate.cooldownLength;

        this.canvas.fill(ui.colorPrimary.r, ui.colorPrimary.g, ui.colorPrimary.b, ui.colorPrimary.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize * 3 + abilityUIMargin * 3),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize,
            abilityUISize
        );
        this.canvas.fill(ui.colorCooldown.r, ui.colorCooldown.g, ui.colorCooldown.b, ui.colorCooldown.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize * 3 + abilityUIMargin * 3),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize * ui.percentagePrimary,
            abilityUISize
        );

        this.canvas.fill(ui.colorSecondary.r, ui.colorSecondary.g, ui.colorSecondary.b, ui.colorSecondary.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize * 2 + abilityUIMargin * 2),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize,
            abilityUISize
        );
        this.canvas.fill(ui.colorCooldown.r, ui.colorCooldown.g, ui.colorCooldown.b, ui.colorCooldown.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize * 2 + abilityUIMargin * 2),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize * ui.percentageSecondary,
            abilityUISize
        );

        this.canvas.fill(ui.colorUltimate.r, ui.colorUltimate.g, ui.colorUltimate.b, ui.colorUltimate.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize + abilityUIMargin),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize,
            abilityUISize
        );
        this.canvas.fill(ui.colorCooldown.r, ui.colorCooldown.g, ui.colorCooldown.b, ui.colorCooldown.a);
        this.canvas.rect(
            this.canvas.width - (abilityUISize + abilityUIMargin),
            this.canvas.height - (abilityUISize + abilityUIMargin),
            abilityUISize * ui.percentageUltimate,
            abilityUISize
        );
    }

    private interactablePrompt(entityId: number, ui: UIInteractablePrompt, cam: CameraComponent): void {
        const int = this.entityManager.get<InteractableComponent>(entityId, CType.Interactable);
        if (!int.active) {
            return;
        }
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const text = `Press ${DEFAULT_REVERSE_CONTROLLER_MAP.get(Input.Interact)?.toLocaleUpperCase()} ${ui.text}`;
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom),
            floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom)
        );

        this.canvas.setFontSize(15);
        const textWidth = this.canvas.canvas.measureText(text).width;
        this.canvas.fill(255, 255, 255, 1);
        this.canvas.stroke(0, 0, 0, 0.2);
        this.canvas.strokeWidth(2.5);
        this.canvas.strokeText(text, floor(-textWidth / 2), floor(-0.75 * cam.zoom));
        this.canvas.text(text, floor(-textWidth / 2), floor(-0.75 * cam.zoom));
    }

    private tooltip(entityId: number, ui: UIToolTip, cam: CameraComponent): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        const text = `${ui.text}`;
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom),
            floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom)
        );

        this.canvas.setFontSize(15);
        const textWidth = this.canvas.canvas.measureText(text).width;
        this.canvas.fill(255, 255, 255, 1);
        this.canvas.stroke(0, 0, 0, 0.2);
        this.canvas.strokeWidth(2.5);
        this.canvas.strokeText(text, floor(-textWidth / 2), 0);
        this.canvas.text(text, floor(-textWidth / 2), 0);
    }
}
