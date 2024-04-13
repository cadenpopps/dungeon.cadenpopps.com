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
export class UIEnemyHealthBar {
    type;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(x, y, width, height, percentage, colorEmpty, colorFull) {
        this.type = UIType.EnemyHeatlhBar;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.percentage = percentage;
        this.colorEmpty = colorEmpty;
        this.colorFull = colorFull;
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
export var UIType;
(function (UIType) {
    UIType[UIType["EnemyHeatlhBar"] = 0] = "EnemyHeatlhBar";
    UIType[UIType["PlayerHealthBar"] = 1] = "PlayerHealthBar";
    UIType[UIType["AbilityCooldowns"] = 2] = "AbilityCooldowns";
    UIType[UIType["InteractablePrompt"] = 3] = "InteractablePrompt";
})(UIType || (UIType = {}));
export var Shape;
(function (Shape) {
    Shape[Shape["Square"] = 0] = "Square";
    Shape[Shape["Circle"] = 1] = "Circle";
    Shape[Shape["Line"] = 2] = "Line";
    Shape[Shape["Image"] = 3] = "Image";
})(Shape || (Shape = {}));
//# sourceMappingURL=UIComponent.js.map