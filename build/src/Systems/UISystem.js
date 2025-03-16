import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor, max } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { BehaviorMap } from "../Components/AIComponent.js";
import UIComponent, { UIFadeToBlackScreen, UILifecycleState, UITitleScreen, UIType, } from "../Components/UIComponent.js";
import { SHOW_TITLE_SCREEN } from "../Constants.js";
import { Event } from "../EventManager.js";
import { DEFAULT_REVERSE_CONTROLLER_MAP, Input, InputManager } from "../InputManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class UISystem extends System {
    static FADE_TICK_MULTIPLIER = 5;
    canvas;
    constructor(eventManager, entityManager) {
        super(SystemType.UI, eventManager, entityManager, [CType.UI]);
        this.canvas = new PoppsCanvas(2);
        this.canvas.loop(this.canvasCallback.bind(this));
        this.canvas.setFont("Garamond");
        entityManager.subscribeToEntities(this.requiredComponents, this.entities, this);
    }
    handleEvent(event) {
        switch (event) {
            case Event.init:
                if (SHOW_TITLE_SCREEN) {
                    this.entityManager.addEntity([new UIComponent([new UITitleScreen()])]);
                }
                else {
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
    entitiesModifiedCallback() {
        this.entities.sort((a, b) => {
            const layerA = this.entityManager.get(a, CType.UI).layer;
            const layerB = this.entityManager.get(b, CType.UI).layer;
            return layerA - layerB;
        });
    }
    canvasCallback() {
        this.canvas.clear();
        const cam = CameraSystem.getHighestPriorityCamera();
        for (const entityId of this.entities) {
            if (!this.entityManager.hasComponent(entityId, CType.Visible) ||
                this.entityManager.get(entityId, CType.Visible).visible) {
                const ui = this.entityManager.get(entityId, CType.UI);
                for (let element of ui.elements) {
                    if (element.state === UILifecycleState.Permanent || element.state === UILifecycleState.Stable) {
                        this.drawElement(entityId, element, cam);
                    }
                    else {
                        this.fadeUIElement(entityId, element, ui, cam);
                    }
                    this.canvas.resetGlobalAlpha();
                    this.canvas.canvas.resetTransform();
                }
            }
        }
    }
    fadeUIElement(entityId, element, ui, cam) {
        switch (element.state) {
            case UILifecycleState.Initial:
                if (element.fade.fadeInTime > 0) {
                    element.fade.fadeCounter = element.fade.fadeInTime * UISystem.FADE_TICK_MULTIPLIER;
                    element.state = UILifecycleState.FadeIn;
                }
                else {
                    element.state = UILifecycleState.Stable;
                    this.drawElement(entityId, element, cam);
                }
                break;
            case UILifecycleState.FadeIn:
                if (element.fade.fadeCounter > 0) {
                    this.canvas.setGlobalAlpha(1 - element.fade.fadeCounter / (UISystem.FADE_TICK_MULTIPLIER * element.fade.fadeInTime));
                    element.fade.fadeCounter -= 1;
                }
                else {
                    element.state = UILifecycleState.Stable;
                }
                this.drawElement(entityId, element, cam);
                break;
            case UILifecycleState.BeginFadeOut:
                if (element.type === UIType.FadeToBlackScreen ||
                    element.type === UIType.TitleScreen ||
                    element.type === UIType.GameOverScreen) {
                    this.eventManager.addEvent(Event.begin_level_load);
                }
                element.fade.fadeCounter = element.fade.fadeOutTime * UISystem.FADE_TICK_MULTIPLIER;
                element.state = UILifecycleState.FadeOut;
                this.drawElement(entityId, element, cam);
                break;
            case UILifecycleState.FadeOut:
                if (element.fade.fadeCounter > 0) {
                    this.canvas.setGlobalAlpha(element.fade.fadeCounter / (UISystem.FADE_TICK_MULTIPLIER * element.fade.fadeOutTime));
                    element.fade.fadeCounter -= 1;
                    this.drawElement(entityId, element, cam);
                }
                else {
                    element.state = UILifecycleState.Destroy;
                }
                break;
            case UILifecycleState.Destroy:
                if (element.type === UIType.FadeToBlackScreen ||
                    element.type === UIType.TitleScreen ||
                    element.type === UIType.GameOverScreen) {
                    this.eventManager.addEvent(Event.level_change_complete);
                    this.entityManager.removeEntity(entityId);
                }
                break;
        }
    }
    drawElement(entityId, element, cam) {
        this.canvas.canvas.save();
        switch (element.type) {
            case UIType.PlayerHealthBar:
                this.playerHealthBar(entityId, element);
                break;
            case UIType.EnemyHeatlhBar:
                this.enemyHeatlhBar(entityId, element, cam);
                break;
            case UIType.InputDisplay:
                this.inputDisplay(entityId, element);
                break;
            case UIType.InteractablePrompt:
                this.interactablePrompt(entityId, element, cam);
                break;
            case UIType.Tooltip:
                this.tooltip(entityId, element, cam);
                break;
            case UIType.EnemyAI:
                this.enemyAI(entityId, element, cam);
                break;
            case UIType.TitleScreen:
                this.titleScreen(element);
                break;
            case UIType.GameOverScreen:
                this.gameOverScreen(element);
                break;
            case UIType.Button:
                break;
            case UIType.FadeToBlackScreen:
                this.fadeToBlackScreen(element);
                break;
        }
        this.canvas.canvas.restore();
    }
    removeGameOverScreen() {
        for (const entityId of this.entities) {
            const ui = this.entityManager.get(entityId, CType.UI);
            for (let element of ui.elements) {
                if (element.type === UIType.GameOverScreen) {
                    this.entityManager.removeEntity(entityId);
                }
            }
        }
    }
    printTextCentered(text, xOffset, yOffset) {
        const txtMetrics = this.canvas.canvas.measureText(text);
        const textWidth = txtMetrics.width;
        const textHeight = Math.abs(txtMetrics.fontBoundingBoxAscent - txtMetrics.fontBoundingBoxDescent);
        this.canvas.strokeText(text, this.canvas.width / 2 + floor(-textWidth / 2) + xOffset, this.canvas.height / 2 - floor(-textHeight / 2) + yOffset);
        this.canvas.text(text, this.canvas.width / 2 + floor(-textWidth / 2) + xOffset, this.canvas.height / 2 - floor(-textHeight / 2) + yOffset);
    }
    playerHealthBar(entityId, ui) {
        const health = this.entityManager.get(entityId, CType.Health);
        ui.percentage = max(health.currentHealth, 0) / health.maxHealth;
        this.canvas.fill(ui.colorEmpty.r, ui.colorEmpty.g, ui.colorEmpty.b, ui.colorEmpty.a);
        this.canvas.roundRect(ui.x, ui.y, ui.width, ui.height, 3);
        this.canvas.fill(ui.colorFull.r, ui.colorFull.g, ui.colorFull.b, ui.colorFull.a);
        this.canvas.roundRect(ui.x, ui.y, ui.width * ui.percentage, ui.height, 3);
    }
    enemyHeatlhBar(entityId, ui, cam) {
        if (this.entityManager.hasComponent(entityId, CType.Health)) {
            const health = this.entityManager.get(entityId, CType.Health);
            ui.percentage = max(health.currentHealth, 0) / health.maxHealth;
        }
        else {
            ui.percentage = 0;
        }
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom));
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        const pos = this.entityManager.get(entityId, CType.Position);
        this.canvas.fill(ui.colorEmpty.r, ui.colorEmpty.g, ui.colorEmpty.b, ui.colorEmpty.a);
        this.canvas.rect(pos.x + ui.x - ui.width / 2, pos.y + ui.y - ui.height / 2, ui.width, ui.height);
        this.canvas.fill(ui.colorFull.r, ui.colorFull.g, ui.colorFull.b, ui.colorFull.a);
        this.canvas.rect(pos.x + ui.x - ui.width / 2, pos.y + ui.y - ui.height / 2, ui.width * ui.percentage, ui.height);
    }
    inputDisplay(entityId, ui) {
        const inputKeySize = 40;
        const inputKeyMargin = 8;
        const inputKeyOffset = inputKeySize + inputKeyMargin * 2;
        const inputMouseOffset = inputKeyMargin * 2;
        if (!this.entityManager.hasComponent(entityId, CType.Controller)) {
            return;
        }
        const con = this.entityManager.get(entityId, CType.Controller);
        const mov = this.entityManager.get(entityId, CType.Movement);
        const ability = this.entityManager.get(entityId, CType.Ability);
        ui.percentagePrimary = ability.primary.cooldown / ability.primary.cooldownLength;
        ui.percentageSecondary = ability.secondary.cooldown / ability.secondary.cooldownLength;
        ui.percentageRoll = mov.rollCooldown / mov.rollCooldownLength;
        this.canvas.stroke(255, 255, 255, 1);
        this.canvas.strokeWidth(2);
        this.canvas.fill(200, 200, 200, 0.6);
        this.canvas.roundStrokeRect(this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3), inputKeyMargin, inputKeySize, inputKeySize, 3);
        if (con.up) {
            this.canvas.roundRect(this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3), inputKeyMargin, inputKeySize, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        if (con.left) {
            this.canvas.roundRect(this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        if (con.down) {
            this.canvas.roundRect(this.canvas.width - inputKeyOffset - (inputKeySize * 3 + inputKeyMargin * 3), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputKeyOffset - (inputKeySize * 2 + inputKeyMargin * 2), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        if (con.right) {
            this.canvas.roundRect(this.canvas.width - inputKeyOffset - (inputKeySize * 2 + inputKeyMargin * 2), 2 * inputKeyMargin + inputKeySize, inputKeySize, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4), 3 * inputKeyMargin + 2 * inputKeySize, inputKeySize * 5 + inputKeyMargin * 4, inputKeySize, 3);
        if (ui.percentageRoll > 0) {
            this.canvas.roundRect(this.canvas.width - inputKeyOffset - (inputKeySize * 4 + inputKeyMargin * 4), 3 * inputKeyMargin + 2 * inputKeySize, (inputKeySize * 5 + inputKeyMargin * 4) * ui.percentageRoll, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputMouseOffset - inputKeySize * 2, inputKeyMargin, inputKeySize - 2, inputKeySize, 3);
        if (ui.percentagePrimary > 0) {
            this.canvas.roundRect(this.canvas.width - inputMouseOffset - inputKeySize * 2, inputKeyMargin, inputKeySize * ui.percentagePrimary - 2, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputMouseOffset - inputKeySize + 2, inputKeyMargin, inputKeySize - 2, inputKeySize, 3);
        if (ui.percentageSecondary > 0) {
            this.canvas.roundRect(this.canvas.width - inputMouseOffset - inputKeySize + 2, inputKeyMargin, inputKeySize * ui.percentageSecondary - 2, inputKeySize, 3);
        }
        this.canvas.roundStrokeRect(this.canvas.width - inputMouseOffset - inputKeySize * 2, inputKeyMargin + inputKeySize + 4, inputKeySize * 2, inputKeySize + inputKeyMargin - 4, 3);
    }
    interactablePrompt(entityId, ui, cam) {
        const int = this.entityManager.get(entityId, CType.Interactable);
        if (!int.visible) {
            return;
        }
        const pos = this.entityManager.get(entityId, CType.Position);
        const text = `Press ${DEFAULT_REVERSE_CONTROLLER_MAP.get(Input.Interact)?.toLocaleUpperCase()} ${ui.text}`;
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom));
        this.canvas.setFontSize(15);
        const textWidth = this.canvas.canvas.measureText(text).width;
        this.canvas.fill(255, 255, 255, 1);
        this.canvas.stroke(0, 0, 0, 0.2);
        this.canvas.strokeWidth(2.5);
        this.canvas.strokeText(text, floor(-textWidth / 2), floor(-0.75 * cam.zoom));
        this.canvas.text(text, floor(-textWidth / 2), floor(-0.75 * cam.zoom));
    }
    tooltip(entityId, ui, cam) {
        const pos = this.entityManager.get(entityId, CType.Position);
        const text = `${ui.text}`;
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom));
        this.canvas.setFontSize(15);
        const textWidth = this.canvas.canvas.measureText(text).width;
        this.canvas.fill(255, 255, 255, 1);
        this.canvas.stroke(0, 0, 0, 0.2);
        this.canvas.strokeWidth(2.5);
        this.canvas.strokeText(text, floor(-textWidth / 2), 0);
        this.canvas.text(text, floor(-textWidth / 2), 0);
    }
    enemyAI(entityId, ui, cam) {
        const pos = this.entityManager.get(entityId, CType.Position);
        this.canvas.setFontSize(15);
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom + pos.x * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom + pos.y * cam.zoom));
        if (this.entityManager.hasComponent(entityId, CType.AI)) {
            const ai = this.entityManager.get(entityId, CType.AI);
            const text = `Behavior: ${BehaviorMap.get(ai.behavior)} ${ai.noticedPlayer ? "o" : "x"}`;
            const textWidth = this.canvas.canvas.measureText(text).width;
            this.canvas.fill(255, 255, 255, 1);
            this.canvas.stroke(0, 0, 0, 0.2);
            this.canvas.strokeWidth(2.5);
            this.canvas.strokeText(text, floor(-textWidth / 2), floor(ui.y * cam.zoom));
            this.canvas.text(text, floor(-textWidth / 2), floor(ui.y * cam.zoom));
        }
    }
    titleScreen(ui) {
        this.canvas.fill(0, 0, 0, 0.8);
        this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.fill(255, 250, 250);
        this.canvas.stroke(0, 0, 0, 0.8);
        this.canvas.roundRect(200, this.canvas.height / 2 - 40, this.canvas.width - 400, 4, 8);
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
    gameOverScreen(ui) {
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
            this.printTextCentered(ui.encouragingText.substring(i * lineWidth, i * lineWidth + lineWidth), 0, 16 + 32 * i);
        }
        this.printTextCentered(ui.helperText, 0, this.canvas.height / 2 - 40);
    }
    fadeToBlackScreen(ui) {
        this.canvas.fill(0, 0, 0);
        this.canvas.rect(0, 0, this.canvas.width, this.canvas.height);
        if (ui.state === UILifecycleState.Stable) {
            if (ui.stableTime === 0) {
                ui.state = UILifecycleState.BeginFadeOut;
                this.removeGameOverScreen();
            }
            else {
                ui.stableTime--;
            }
        }
    }
    button(ui) {
        if (InputManager.MOUSE_X > ui.x - ui.width / 2 &&
            InputManager.MOUSE_X < ui.x + ui.width / 2 &&
            InputManager.MOUSE_Y > ui.y - ui.height / 2 &&
            InputManager.MOUSE_Y < ui.y + ui.height / 2) {
            ui.hovered = true;
        }
        else {
            ui.hovered = false;
        }
        this.canvas.fill(255, 250, 250);
        if (ui.hovered) {
            if (InputManager.MOUSE_DOWN) {
                ui.clicked = true;
            }
            else {
                ui.clicked = false;
            }
            this.canvas.roundRect(this.canvas.width / 2 + ui.x - ui.width / 2, this.canvas.height / 2 + ui.y - ui.height / 2, ui.width, ui.height, 5);
            this.canvas.strokeWidth(0);
            this.canvas.setFontSize(32);
            this.canvas.fill(0, 0, 0);
            this.canvas.stroke(0, 0, 0);
        }
        this.text(ui.text);
    }
    text(ui) {
        this.canvas.setFontSize(ui.size);
        this.canvas.fill(ui.color.r, ui.color.g, ui.color.b, ui.color.a);
        this.canvas.stroke(ui.strokeColor.r, ui.strokeColor.g, ui.strokeColor.g, ui.strokeColor.a);
        this.canvas.strokeWidth(ui.strokeWidth);
        this.printTextCentered(ui.text, ui.x, ui.y);
    }
}
//# sourceMappingURL=UISystem.js.map