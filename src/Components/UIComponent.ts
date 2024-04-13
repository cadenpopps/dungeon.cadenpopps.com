import { Component, CType } from "../Component.js";
import { Color } from "./VisibleComponent.js";

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

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        percentage: number,
        colorEmpty: Color,
        colorFull: Color
    ) {
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

export enum UIType {
    EnemyHeatlhBar,
    PlayerHealthBar,
    AbilityCooldowns,
    InteractablePrompt,
}

export enum Shape {
    Square,
    Circle,
    Line,
    Image,
}
