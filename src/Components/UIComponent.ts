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

export interface UIElement {
    type: UIType;
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

export enum UIType {
    EnemyHeatlhBar,
    PlayerHealthBar,
    AbilityCooldowns,
    InteractablePrompt,
    Tooltip,
}

export enum Shape {
    Square,
    Circle,
    Line,
    Image,
}
