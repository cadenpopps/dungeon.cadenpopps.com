import { Component, CType } from "../Component.js";
import { Color } from "../Constants.js";

export default class UIComponent extends Component {
    public elements: Array<UIElement>;
    public layer: number;

    constructor(elements: Array<UIElement>, layer: number = 0) {
        super(CType.Visible);
        this.elements = elements;
        this.layer = layer;
    }
}

export enum UIType {
    PlayerHealthBar,
    EnemyHeatlhBar,
    AbilityCooldowns,
    InteractablePrompt,
    Tooltip,
    EnemyAI,
}

export interface UIElement {
    type: UIType;
}

export class UIPlayerHealthBar implements UIElement {
    public type: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public percentage: number;
    public colorFull: Color;
    public colorEmpty: Color;

    constructor(health: number) {
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

export class UIEnemyHealthBar implements UIElement {
    public type: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public percentage: number;
    public colorFull: Color;
    public colorEmpty: Color;

    constructor(entitySize: number, percentage: number) {
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

export class UIEnemyAI implements UIElement {
    public type: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(entitySize: number) {
        this.type = UIType.EnemyAI;
        this.x = 0;
        this.y = -(entitySize * 0.6) - 0.3;
        this.width = entitySize;
        this.height = entitySize / 5;
    }
}

export class UIAbilityCooldowns implements UIElement {
    public type: number;
    public colorPrimary: Color;
    public colorSecondary: Color;
    public colorUltimate: Color;
    public colorCooldown: Color;
    public percentagePrimary: number;
    public percentageSecondary: number;
    public percentageUltimate: number;

    constructor(colorPrimary: Color, colorSecondary: Color, colorUltimate: Color, colorCooldown: Color) {
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

export class UIInteractablePrompt implements UIElement {
    public type: number;
    public text: string;

    constructor(text: string) {
        this.type = UIType.InteractablePrompt;
        this.text = text;
    }
}

export class UIToolTip implements UIElement {
    public type: number;
    public text: string;

    constructor(text: string) {
        this.type = UIType.Tooltip;
        this.text = text;
    }
}
