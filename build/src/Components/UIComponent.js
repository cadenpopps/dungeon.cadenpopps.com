import { Component, CType } from "../Component.js";
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
})(UIType || (UIType = {}));
export class UIPlayerHealthBar {
    type;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(health) {
        this.type = UIType.PlayerHealthBar;
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
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(entitySize, percentage) {
        this.type = UIType.EnemyHeatlhBar;
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
    x;
    y;
    width;
    height;
    constructor(entitySize) {
        this.type = UIType.EnemyAI;
        this.x = 0;
        this.y = -(entitySize * 0.6) - 0.3;
        this.width = entitySize;
        this.height = entitySize / 5;
    }
}
export class UIAbilityCooldowns {
    type;
    colorPrimary;
    colorSecondary;
    colorUltimate;
    colorCooldown;
    percentagePrimary;
    percentageSecondary;
    percentageUltimate;
    constructor(colorPrimary, colorSecondary, colorUltimate, colorCooldown) {
        this.type = UIType.AbilityCooldowns;
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
//# sourceMappingURL=UIComponent.js.map