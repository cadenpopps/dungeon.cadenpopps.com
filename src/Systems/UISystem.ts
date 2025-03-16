import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor, max } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AIComponent, { BehaviorMap } from "../Components/AIComponent.js";
import AbilityComponent from "../Components/AbilityComponent.js";
import CameraComponent from "../Components/CameraComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import InteractableComponent from "../Components/InteractableComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import UIComponent, {
    UIButton,
    UIElement,
    UIEnemyAI,
    UIEnemyHealthBar,
    UIFadeElement,
    UIFadeToBlackScreen,
    UIGameOverScreen,
    UIInputDisplay,
    UIInteractablePrompt,
    UILifecycleState,
    UIPlayerHealthBar,
    UIText,
    UITitleScreen,
    UIToolTip,
    UIType,
} from "../Components/UIComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { SHOW_TITLE_SCREEN } from "../Constants.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { DEFAULT_REVERSE_CONTROLLER_MAP, Input, InputManager } from "../InputManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";

export default class UISystem extends System {
    public static FADE_TICK_MULTIPLIER: number = 5;
    private canvas: PoppsCanvas;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.UI, eventManager, entityManager, [CType.UI]);
        this.canvas = new PoppsCanvas(2);
        this.canvas.loop(this.canvasCallback.bind(this));
        this.canvas.setFont("Garamond");
        entityManager.subscribeToEntities(this.requiredComponents, this.entities, this);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.init:
                if (SHOW_TITLE_SCREEN) {
                    this.entityManager.addEntity([new UIComponent([new UITitleScreen()])]);
                } else {
                    this.entityManager.addEntity([new UIComponent([new UIFadeToBlackScreen(0, 5)])]);
                    this.eventManager.addEvent(Event.new_game);
                }
                break;
            case Event.respawn:
                this.entityManager.addEntity([new UIComponent([new UIFadeToBlackScreen(10, 10, 15)])]);
                break;
            case Event.level_change_begin:
                this.entityManager.addEntity([new UIComponent([new UIFadeToBlackScreen(2, 5, 5)])]);
                break;
        }
    }

    public entitiesModifiedCallback(): void {
        this.entities.sort((a, b) => {
            const layerA = this.entityManager.get<UIComponent>(a, CType.UI).layer;
            const layerB = this.entityManager.get<UIComponent>(b, CType.UI).layer;
            return layerA - layerB;
        });
    }

    private canvasCallback(): void {
        this.canvas.clear();
        const cam = CameraSystem.getHighestPriorityCamera();
        for (const entityId of this.entities) {
            if (
                !this.entityManager.hasComponent(entityId, CType.Visible) ||
                this.entityManager.get<VisibleComponent>(entityId, CType.Visible).visible
            ) {
                const ui = this.entityManager.get<UIComponent>(entityId, CType.UI);
                for (let element of ui.elements) {
                    if (element.state === UILifecycleState.Permanent || element.state === UILifecycleState.Stable) {
                        this.drawElement(entityId, element, cam);
                    } else {
                        this.fadeUIElement(entityId, element as UIFadeElement, ui, cam);
                    }
                    this.canvas.resetGlobalAlpha();
                    this.canvas.canvas.resetTransform();
                }
            }
        }
    }

    private fadeUIElement(entityId: number, element: UIFadeElement, ui: UIComponent, cam: CameraComponent): void {
        switch (element.state) {
            case UILifecycleState.Initial:
                if (element.fade.fadeInTime > 0) {
                    element.fade.fadeCounter = element.fade.fadeInTime * UISystem.FADE_TICK_MULTIPLIER;
                    element.state = UILifecycleState.FadeIn;
                } else {
                    element.state = UILifecycleState.Stable;
                    this.drawElement(entityId, element, cam);
                }
                break;
            case UILifecycleState.FadeIn:
                if (element.fade.fadeCounter > 0) {
                    this.canvas.setGlobalAlpha(
                        1 - element.fade.fadeCounter / (UISystem.FADE_TICK_MULTIPLIER * element.fade.fadeInTime)
                    );
                    element.fade.fadeCounter -= 1;
                } else {
                    element.state = UILifecycleState.Stable;
                }
                this.drawElement(entityId, element, cam);
                break;
            case UILifecycleState.BeginFadeOut:
                if (
                    element.type === UIType.FadeToBlackScreen ||
                    element.type === UIType.TitleScreen ||
                    element.type === UIType.GameOverScreen
                ) {
                    this.eventManager.addEvent(Event.begin_level_load);
                }
                element.fade.fadeCounter = element.fade.fadeOutTime * UISystem.FADE_TICK_MULTIPLIER;
                element.state = UILifecycleState.FadeOut;
                this.drawElement(entityId, element, cam);
                break;
            case UILifecycleState.FadeOut:
                if (element.fade.fadeCounter > 0) {
                    this.canvas.setGlobalAlpha(
                        element.fade.fadeCounter / (UISystem.FADE_TICK_MULTIPLIER * element.fade.fadeOutTime)
                    );
                    element.fade.fadeCounter -= 1;
                    this.drawElement(entityId, element, cam);
                } else {
                    element.state = UILifecycleState.Destroy;
                }
                break;
            case UILifecycleState.Destroy:
                if (
                    element.type === UIType.FadeToBlackScreen ||
                    element.type === UIType.TitleScreen ||
                    element.type === UIType.GameOverScreen
                ) {
                    this.eventManager.addEvent(Event.level_change_complete);
                    this.entityManager.removeEntity(entityId);
                }
                break;
        }
    }

    private drawElement(entityId: number, element: UIElement, cam: CameraComponent): void {
        this.canvas.canvas.save();
        switch (element.type) {
            case UIType.PlayerHealthBar:
                this.playerHealthBar(entityId, element as UIPlayerHealthBar);
                break;
            case UIType.EnemyHeatlhBar:
                this.enemyHeatlhBar(entityId, element as UIEnemyHealthBar, cam);
                break;
            case UIType.InputDisplay:
                this.inputDisplay(entityId, element as UIInputDisplay);
                break;
            case UIType.InteractablePrompt:
                this.interactablePrompt(entityId, element as UIInteractablePrompt, cam);
                break;
            case UIType.Tooltip:
                this.tooltip(entityId, element as UIToolTip, cam);
                break;
            case UIType.EnemyAI:
                this.enemyAI(entityId, element as UIEnemyAI, cam);
                break;
            case UIType.TitleScreen:
                this.titleScreen(element as UITitleScreen);
                break;
            case UIType.GameOverScreen:
                this.gameOverScreen(element as UIGameOverScreen);
                break;
            case UIType.Button:
                // this.button(entityId, element as UIButton, cam);
                break;
            case UIType.FadeToBlackScreen:
                this.fadeToBlackScreen(element as UIFadeToBlackScreen);
                break;
        }
        this.canvas.canvas.restore();
    }

    private removeGameOverScreen(): void {
        for (const entityId of this.entities) {
            const ui = this.entityManager.get<UIComponent>(entityId, CType.UI);
            for (let element of ui.elements) {
                if (element.type === UIType.GameOverScreen) {
                    this.entityManager.removeEntity(entityId);
                }
            }
        }
    }

    private printTextCentered(text: string, xOffset: number, yOffset: number): void {
        const txtMetrics = this.canvas.canvas.measureText(text);
        const textWidth = txtMetrics.width;
        const textHeight = Math.abs(txtMetrics.fontBoundingBoxAscent - txtMetrics.fontBoundingBoxDescent);
        this.canvas.strokeText(
            text,
            this.canvas.width / 2 + floor(-textWidth / 2) + xOffset,
            this.canvas.height / 2 - floor(-textHeight / 2) + yOffset
        );
        this.canvas.text(
            text,
            this.canvas.width / 2 + floor(-textWidth / 2) + xOffset,
            this.canvas.height / 2 - floor(-textHeight / 2) + yOffset
        );
    }

    private playerHealthBar(entityId: number, ui: UIPlayerHealthBar): void {
        const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
        ui.percentage = max(health.currentHealth, 0) / health.maxHealth;
        this.canvas.fill(ui.colorEmpty.r, ui.colorEmpty.g, ui.colorEmpty.b, ui.colorEmpty.a);
        this.canvas.roundRect(ui.x, ui.y, ui.width, ui.height, 3);
        this.canvas.fill(ui.colorFull.r, ui.colorFull.g, ui.colorFull.b, ui.colorFull.a);
        this.canvas.roundRect(ui.x, ui.y, ui.width * ui.percentage, ui.height, 3);
    }

    private enemyHeatlhBar(entityId: number, ui: UIEnemyHealthBar, cam: CameraComponent): void {
        if (this.entityManager.hasComponent(entityId, CType.Health)) {
            const health = this.entityManager.get<HealthComponent>(entityId, CType.Health);
            ui.percentage = max(health.currentHealth, 0) / health.maxHealth;
        } else {
            ui.percentage = 0;
        }
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

    private inputDisplay(entityId: number, ui: UIInputDisplay): void {
        const inputKeySize = 40;
        const inputKeyMargin = 8;
        const inputKeyOffset = inputKeySize + inputKeyMargin * 2;
        const inputMouseOffset = inputKeyMargin * 2;

        if (!this.entityManager.hasComponent(entityId, CType.Controller)) {
            return;
        }
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        const mov = this.entityManager.get<MovementComponent>(entityId, CType.Movement);
        const ability = this.entityManager.get<AbilityComponent>(entityId, CType.Ability);
        ui.percentagePrimary = ability.primary.cooldown / ability.primary.cooldownLength;
        ui.percentageSecondary = ability.secondary.cooldown / ability.secondary.cooldownLength;
        ui.percentageRoll = mov.rollCooldown / mov.rollCooldownLength;

        this.canvas.stroke(255, 255, 255, 1);
        this.canvas.strokeWidth(2);
        this.canvas.fill(200, 200, 200, 0.6);

        // Up
        this.canvas.roundStrokeRect(
            this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3),
            inputKeyMargin,
            inputKeySize,
            inputKeySize,
            3
        );
        if (con.up) {
            this.canvas.roundRect(
                this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3),
                inputKeyMargin,
                inputKeySize,
                inputKeySize,
                3
            );
        }

        // Left
        this.canvas.roundStrokeRect(
            this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4),
            2 * inputKeyMargin + inputKeySize,
            inputKeySize,
            inputKeySize,
            3
        );
        if (con.left) {
            this.canvas.roundRect(
                this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4),
                2 * inputKeyMargin + inputKeySize,
                inputKeySize,
                inputKeySize,
                3
            );
        }

        // Down
        this.canvas.roundStrokeRect(
            this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3),
            2 * inputKeyMargin + inputKeySize,
            inputKeySize,
            inputKeySize,
            3
        );
        if (con.down) {
            this.canvas.roundRect(
                this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3),
                2 * inputKeyMargin + inputKeySize,
                inputKeySize,
                inputKeySize,
                3
            );
        }

        // Right
        this.canvas.roundStrokeRect(
            this.canvas.width - inputKeyOffset - (inputKeySize * 2 + inputKeyMargin * 2),
            2 * inputKeyMargin + inputKeySize,
            inputKeySize,
            inputKeySize,
            3
        );
        if (con.right) {
            this.canvas.roundRect(
                this.canvas.width - inputKeyOffset - (inputKeySize * 2 + inputKeyMargin * 2),
                2 * inputKeyMargin + inputKeySize,
                inputKeySize,
                inputKeySize,
                3
            );
        }

        // Roll
        this.canvas.roundStrokeRect(
            this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4),
            3 * inputKeyMargin + 2 * inputKeySize,
            inputKeySize * 5 + inputKeyMargin * 4,
            inputKeySize,
            3
        );
        if (ui.percentageRoll > 0) {
            this.canvas.roundRect(
                this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4),
                3 * inputKeyMargin + 2 * inputKeySize,
                (inputKeySize * 5 + inputKeyMargin * 4) * ui.percentageRoll,
                inputKeySize,
                3
            );
        }

        // Primary
        this.canvas.roundStrokeRect(
            this.canvas.width - inputMouseOffset - inputKeySize * 2,
            inputKeyMargin,
            inputKeySize - 2,
            inputKeySize,
            3
        );
        if (ui.percentagePrimary > 0) {
            this.canvas.roundRect(
                this.canvas.width - inputMouseOffset - inputKeySize * 2,
                inputKeyMargin,
                inputKeySize * ui.percentagePrimary - 2,
                inputKeySize,
                3
            );
        }

        // Secondary
        this.canvas.roundStrokeRect(
            this.canvas.width - inputMouseOffset - inputKeySize + 2,
            inputKeyMargin,
            inputKeySize - 2,
            inputKeySize,
            3
        );
        if (ui.percentageSecondary > 0) {
            this.canvas.roundRect(
                this.canvas.width - inputMouseOffset - inputKeySize + 2,
                inputKeyMargin,
                inputKeySize * ui.percentageSecondary - 2,
                inputKeySize,
                3
            );
        }

        // Bottom of mouse display
        this.canvas.roundStrokeRect(
            this.canvas.width - inputMouseOffset - inputKeySize * 2,
            inputKeyMargin + inputKeySize + 4,
            inputKeySize * 2,
            inputKeySize + inputKeyMargin - 4,
            3
        );
    }

    private interactablePrompt(entityId: number, ui: UIInteractablePrompt, cam: CameraComponent): void {
        const int = this.entityManager.get<InteractableComponent>(entityId, CType.Interactable);
        if (!int.visible) {
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

    private enemyAI(entityId: number, ui: UIEnemyAI, cam: CameraComponent): void {
        const pos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
        this.canvas.setFontSize(15);
        this.canvas.canvas.translate(
            floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom),
            floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom)
        );
        if (this.entityManager.hasComponent(entityId, CType.AI)) {
            const ai = this.entityManager.get<AIComponent>(entityId, CType.AI);
            const text = `Behavior: ${BehaviorMap.get(ai.behavior) as string} ${ai.noticedPlayer ? "o" : "x"}`;
            const textWidth = this.canvas.canvas.measureText(text).width;
            this.canvas.fill(255, 255, 255, 1);
            this.canvas.stroke(0, 0, 0, 0.2);
            this.canvas.strokeWidth(2.5);
            this.canvas.strokeText(text, floor(-textWidth / 2), floor(ui.y * cam.zoom));
            this.canvas.text(text, floor(-textWidth / 2), floor(ui.y * cam.zoom));
        }
    }

    private titleScreen(ui: UITitleScreen): void {
        this.canvas.fill(0, 0, 0, 0.8);
        this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.fill(255, 250, 250);
        this.canvas.stroke(0, 0, 0, 0.8);
        this.canvas.roundRect(200, this.canvas.height / 2 - 40, this.canvas.width - 400, 4, 8);
        // this.printTextCentered(ui.titleText, 0, -100);
        this.text(ui.titleText);
        if (ui.state === UILifecycleState.Stable) {
            this.button(ui.playButton);
            if (ui.playButton.clicked) {
                this.eventManager.addEvent(Event.new_game);
                ui.state = UILifecycleState.BeginFadeOut;
            }
            this.button(ui.settingsButton);
        }
    }

    private gameOverScreen(ui: UIGameOverScreen): void {
        this.canvas.fill(0, 0, 0, 0.8);
        this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.fill(255, 250, 250);
        this.canvas.stroke(0, 0, 0, 0.8);
        this.canvas.roundRect(200, this.canvas.height / 2 - 40, this.canvas.width - 400, 4, 8);
        this.text(ui.titleText);
        this.canvas.strokeWidth(0);
        this.canvas.setFontSize(32);
        const lineWidth = 80;
        for (let i = 0; i < Math.ceil(ui.encouragingText.length / lineWidth); i++) {
            this.printTextCentered(
                ui.encouragingText.substring(i * lineWidth, i * lineWidth + lineWidth),
                0,
                16 + 32 * i
            );
        }
        this.printTextCentered(ui.helperText, 0, this.canvas.height / 2 - 40);
    }

    private fadeToBlackScreen(ui: UIFadeToBlackScreen): void {
        this.canvas.fill(0, 0, 0);
        this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
        if (ui.state === UILifecycleState.Stable) {
            if (ui.stableTime === 0) {
                ui.state = UILifecycleState.BeginFadeOut;
                this.removeGameOverScreen();
            } else {
                ui.stableTime--;
            }
        }
    }

    private button(ui: UIButton): void {
        if (
            InputManager.MOUSE_X > ui.x - ui.width / 2 &&
            InputManager.MOUSE_X < ui.x + ui.width / 2 &&
            InputManager.MOUSE_Y > ui.y - ui.height / 2 &&
            InputManager.MOUSE_Y < ui.y + ui.height / 2
        ) {
            ui.hovered = true;
        } else {
            ui.hovered = false;
        }

        this.canvas.fill(255, 250, 250);
        if (ui.hovered) {
            if (InputManager.MOUSE_DOWN) {
                ui.clicked = true;
            } else {
                ui.clicked = false;
            }
            this.canvas.roundRect(
                this.canvas.width / 2 + ui.x - ui.width / 2,
                this.canvas.height / 2 + ui.y - ui.height / 2,
                ui.width,
                ui.height,
                5
            );
            this.canvas.strokeWidth(0);
            this.canvas.setFontSize(32);
            this.canvas.fill(0, 0, 0);
            this.canvas.stroke(0, 0, 0);
        }
        this.text(ui.text);
    }

    private text(ui: UIText): void {
        this.canvas.setFontSize(ui.size);
        this.canvas.fill(ui.color.r, ui.color.g, ui.color.b, ui.color.a);
        this.canvas.stroke(ui.strokeColor.r, ui.strokeColor.g, ui.strokeColor.g, ui.strokeColor.a);
        this.canvas.strokeWidth(ui.strokeWidth);
        this.printTextCentered(ui.text, ui.x, ui.y);
    }
}
