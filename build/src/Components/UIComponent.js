import { Component, CType } from "../Component.js";
import UISystem from "../Systems/UISystem.js";
export default class UIComponent extends Component {
    elements;
    layer;
    constructor(elements, layer = 0) {
        super(CType.Visible);
        this.elements = elements;
        this.layer = layer;
    }
}
export var UIType;
(function (UIType) {
    UIType[UIType["PlayerHealthBar"] = 0] = "PlayerHealthBar";
    UIType[UIType["EnemyHeatlhBar"] = 1] = "EnemyHeatlhBar";
    UIType[UIType["AbilityCooldowns"] = 2] = "AbilityCooldowns";
    UIType[UIType["InteractablePrompt"] = 3] = "InteractablePrompt";
    UIType[UIType["Tooltip"] = 4] = "Tooltip";
    UIType[UIType["EnemyAI"] = 5] = "EnemyAI";
    UIType[UIType["GameOverScreen"] = 6] = "GameOverScreen";
    UIType[UIType["Button"] = 7] = "Button";
})(UIType || (UIType = {}));
export class UIPlayerHealthBar {
    type;
    fadeIn;
    fadeOut;
    fadeCounter;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(health) {
        this.type = UIType.PlayerHealthBar;
        this.fadeIn = 1;
        this.fadeOut = 2;
        this.fadeCounter = this.fadeIn * UISystem.FADE_TICK_MULTIPLIER;
        this.x = 48;
        this.y = 32;
        this.width = health * 12;
        this.height = 16;
        this.percentage = 1;
        this.colorFull = { r: 180, g: 20, b: 10, a: 1 };
        this.colorEmpty = { r: 68, g: 67, b: 71, a: 1 };
    }
}
export class UIEnemyHealthBar {
    type;
    fadeOut;
    fadeCounter;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(entitySize, percentage) {
        this.type = UIType.EnemyHeatlhBar;
        this.fadeOut = 1;
        this.fadeCounter = 0;
        this.x = 0;
        this.y = -entitySize * 0.6 - 0.1;
        this.width = entitySize;
        this.height = entitySize / 10;
        this.percentage = percentage;
        this.colorEmpty = { r: 255, g: 0, b: 0, a: 1 };
        this.colorFull = { r: 0, g: 255, b: 0, a: 1 };
    }
}
export class UIEnemyAI {
    type;
    fadeOut;
    fadeCounter;
    x;
    y;
    width;
    height;
    constructor(entitySize) {
        this.type = UIType.EnemyAI;
        this.fadeOut = 2;
        this.fadeCounter = 0;
        this.x = 0;
        this.y = -(entitySize * 0.6) - 0.3;
        this.width = entitySize;
        this.height = entitySize / 5;
    }
}
export class UIAbilityCooldowns {
    type;
    fadeIn;
    fadeOut;
    fadeCounter;
    colorPrimary;
    colorSecondary;
    colorUltimate;
    colorCooldown;
    percentagePrimary;
    percentageSecondary;
    percentageUltimate;
    constructor(colorPrimary, colorSecondary, colorUltimate, colorCooldown) {
        this.type = UIType.AbilityCooldowns;
        this.fadeIn = 2;
        this.fadeOut = 2;
        this.fadeCounter = this.fadeIn * UISystem.FADE_TICK_MULTIPLIER;
        this.colorPrimary = colorPrimary;
        this.colorSecondary = colorSecondary;
        this.colorUltimate = colorUltimate;
        this.colorCooldown = colorCooldown;
        this.percentagePrimary = 1;
        this.percentageSecondary = 1;
        this.percentageUltimate = 1;
    }
}
export class UIInteractablePrompt {
    type;
    text;
    constructor(text) {
        this.type = UIType.InteractablePrompt;
        this.text = text;
    }
}
export class UIToolTip {
    type;
    text;
    constructor(text) {
        this.type = UIType.Tooltip;
        this.text = text;
    }
}
export class UIGameOverScreen {
    type;
    fadeIn;
    fadeCounter;
    text;
    constructor() {
        this.type = UIType.GameOverScreen;
        this.fadeIn = 2;
        this.fadeCounter = this.fadeIn * UISystem.FADE_TICK_MULTIPLIER;
        this.text = "YOU DIED";
    }
}
export class UIButton {
    type;
    fadeIn;
    fadeCounter;
    x;
    y;
    text;
    constructor(text, x, y, fadeIn = 0) {
        this.type = UIType.Button;
        this.text = text;
        this.x = x;
        this.y = y;
        this.fadeIn = fadeIn;
        this.fadeCounter = this.fadeIn * UISystem.FADE_TICK_MULTIPLIER;
    }
}
//# sourceMappingURL=UIComponent.js.map