import { randomInt } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
import { Color } from "../Constants.js";

export default class UIComponent extends Component {
    public elements: Array<UIElement>;
    public layer: number;

    constructor(elements: Array<UIElement>, layer: number = 0) {
        super(CType.UI);
        this.elements = elements;
        this.layer = layer;
    }
}

export enum UIType {
    PlayerHealthBar,
    EnemyHeatlhBar,
    InputDisplay,
    InteractablePrompt,
    Tooltip,
    EnemyAI,
    TitleScreen,
    GameOverScreen,
    Button,
    FadeToBlackScreen,
}

export interface UIColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface UIElement {
    type: UIType;
    state: UILifecycleState;
}

export interface UIFadeElement extends UIElement {
    fade: UIFade;
}

export class UIFade {
    public fadeInTime: number;
    public fadeOutTime: number;
    public fadeCounter: number;

    constructor(fadeInTime: number = 0, fadeOutTime: number = 0) {
        this.fadeInTime = fadeInTime;
        this.fadeOutTime = fadeOutTime;
        this.fadeCounter = 0;
    }
}

export class UIText {
    public text: string;
    public x: number;
    public y: number;
    public size: number;
    public color: UIColor;
    public strokeColor: UIColor;
    public strokeWidth: number;

    constructor(
        text: string,
        x: number = 0,
        y: number = 0,
        size: number = 32,
        color: UIColor = { r: 255, g: 255, b: 255, a: 1 },
        strokeColor: UIColor = { r: 255, g: 255, b: 255, a: 1 },
        strokeWidth: number = 1
    ) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
    }
}

export class UIButton {
    public text: UIText;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public clicked: boolean = false;
    public hovered: boolean = false;

    constructor(text: UIText, x: number = 0, y: number = 0, width: number = 80, height: number = 40) {
        this.text = new UIText(text.text, x, y, text.size, text.color, text.strokeColor, text.strokeWidth);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export enum UILifecycleState {
    Permanent,
    Initial,
    FadeIn,
    Stable,
    BeginFadeOut,
    FadeOut,
    Destroy,
}

export class UIFadeToBlackScreen implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public stableTime: number;

    constructor(fadeInTime: number = 5, fadeOutTime: number = 5, stableTime: number = 0) {
        this.type = UIType.FadeToBlackScreen;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(fadeInTime, fadeOutTime);
        this.stableTime = stableTime;
    }
}

export class UIPlayerHealthBar implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public percentage: number;
    public colorFull: Color;
    public colorEmpty: Color;

    constructor(health: number) {
        this.type = UIType.PlayerHealthBar;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(3, 3);
        this.x = 48;
        this.y = 32;
        this.width = health * 15;
        this.height = 16;
        this.percentage = 1;
        this.colorFull = { r: 180, g: 20, b: 10, a: 1 };
        this.colorEmpty = { r: 68, g: 67, b: 71, a: 1 };
    }
}

export class UIEnemyHealthBar implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public percentage: number;
    public colorFull: Color;
    public colorEmpty: Color;

    constructor(entitySize: number, percentage: number) {
        this.type = UIType.EnemyHeatlhBar;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(0, 2);
        this.x = 0;
        this.y = -entitySize * 0.6 - 0.1;
        this.width = entitySize;
        this.height = entitySize / 10;
        this.percentage = percentage;
        this.colorEmpty = { r: 255, g: 0, b: 0, a: 1 };
        this.colorFull = { r: 0, g: 255, b: 0, a: 1 };
    }
}

export class UIEnemyAI implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(entitySize: number) {
        this.type = UIType.EnemyAI;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(0, 2);
        this.x = 0;
        this.y = -(entitySize * 0.6) - 0.3;
        this.width = entitySize;
        this.height = entitySize / 5;
    }
}

export class UIInputDisplay implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public percentagePrimary: number;
    public percentageSecondary: number;
    public percentageRoll: number;

    constructor() {
        this.type = UIType.InputDisplay;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(2, 2);
        this.percentagePrimary = 1;
        this.percentageSecondary = 1;
        this.percentageRoll = 1;
    }
}

export class UIInteractablePrompt implements UIElement {
    public type: number;
    public state: UILifecycleState;
    public text: string;

    constructor(text: string) {
        this.type = UIType.InteractablePrompt;
        this.state = UILifecycleState.Permanent;
        this.text = text;
    }
}

export class UIToolTip implements UIElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public text: string;

    constructor(text: string) {
        this.type = UIType.Tooltip;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(2, 2);
        this.text = text;
    }
}

export class UITitleScreen implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public titleText: UIText;
    public playButton: UIButton;
    public settingsButton: UIButton;

    constructor() {
        this.type = UIType.TitleScreen;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(0, 10);
        this.titleText = new UIText("Down the Dungeon", 0, -120, 120);
        this.playButton = new UIButton(new UIText("Play"), 0, 20, 200, 40);
        this.settingsButton = new UIButton(new UIText("Settings"), 0, 70, 200, 40);
    }
}

export class UIGameOverScreen implements UIFadeElement {
    public type: number;
    public state: UILifecycleState;
    public fade: UIFade;
    public titleText: UIText;
    public encouragingText: string;
    public helperText: string;

    constructor() {
        this.type = UIType.GameOverScreen;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(10, 0);
        this.titleText = new UIText("Game Over", 0, -120, 120);
        const quotes = [
            "Appear weak when you are strong, and strong when you are weak.",
            "The supreme art of war is to subdue the enemy without fighting.",
            "If you know the enemy and know yourself, you need not fear the result of a hundred battles.",
            "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.",
            "In the midst of chaos, there is also opportunity",
            "Supreme excellence consists of breaking the enemy's resistance without fighting.",
            "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win",
            "The greatest victory is that which requires no battle.",
            "There is no instance of a nation benefitting from prolonged warfare.",
            "Treat your men as you would your own beloved sons. And they will follow you into the deepest valley.",
            "Move swift as the Wind and closely-formed as the Wood. Attack like the Fire and be still as the Mountain.",
            "When you surround an army, leave an outlet free. Do not press a desperate foe too hard.",
            "Who wishes to fight must first count the cost",
            "When the enemy is relaxed, make them toil. When full, starve them. When settled, make them move.",
            "To win one hundred victories in one hundred battles is not the acme of skill. To subdue the enemy without fighting is the acme of skill.",
            "So in war, the way is to avoid what is strong, and strike at what is weak.",
            "Be extremely subtle even to the point of formlessness. Be extremely mysterious even to the point of soundlessness. Thereby you can be the director of the opponent's fate.",
            "The wise warrior avoids the battle.",
            "The whole secret lies in confusing the enemy, so that he cannot fathom our real intent.",
            "What the ancients called a clever fighter is one who not only wins, but excels in winning with ease.",
            "One may know how to conquer without being able to do it. ",
            "Rouse him, and learn the principle of his activity or inactivity. Force him to reveal himself, so as to find out his vulnerable spots.",
            "If you know the enemy and know yourself, your victory will not stand in doubt; if you know Heaven and know Earth, you may make your victory complete.",
            "He who is prudent and lies in wait for an enemy who is not, will be victorious.",
        ];
        this.encouragingText = quotes[randomInt(quotes.length)];
        this.helperText = "Press any button to continue...";
    }
}
