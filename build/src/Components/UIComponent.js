import { randomInt } from "../../lib/PoppsMath.js";
import { Component, CType } from "../Component.js";
export default class UIComponent extends Component {
    elements;
    layer;
    constructor(elements, layer = 0) {
        super(CType.UI);
        this.elements = elements;
        this.layer = layer;
    }
}
export var UIType;
(function (UIType) {
    UIType[UIType["PlayerHealthBar"] = 0] = "PlayerHealthBar";
    UIType[UIType["EnemyHeatlhBar"] = 1] = "EnemyHeatlhBar";
    UIType[UIType["InputDisplay"] = 2] = "InputDisplay";
    UIType[UIType["InteractablePrompt"] = 3] = "InteractablePrompt";
    UIType[UIType["Tooltip"] = 4] = "Tooltip";
    UIType[UIType["EnemyAI"] = 5] = "EnemyAI";
    UIType[UIType["TitleScreen"] = 6] = "TitleScreen";
    UIType[UIType["GameOverScreen"] = 7] = "GameOverScreen";
    UIType[UIType["Button"] = 8] = "Button";
    UIType[UIType["FadeToBlackScreen"] = 9] = "FadeToBlackScreen";
})(UIType || (UIType = {}));
export class UIFade {
    fadeInTime;
    fadeOutTime;
    fadeCounter;
    constructor(fadeInTime = 0, fadeOutTime = 0) {
        this.fadeInTime = fadeInTime;
        this.fadeOutTime = fadeOutTime;
        this.fadeCounter = 0;
    }
}
export class UIText {
    text;
    x;
    y;
    size;
    color;
    strokeColor;
    strokeWidth;
    constructor(text, x = 0, y = 0, size = 32, color = { r: 255, g: 255, b: 255, a: 1 }, strokeColor = { r: 255, g: 255, b: 255, a: 1 }, strokeWidth = 1) {
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
    text;
    x;
    y;
    width;
    height;
    clicked = false;
    hovered = false;
    constructor(text, x = 0, y = 0, width = 80, height = 40) {
        this.text = new UIText(text.text, x, y, text.size, text.color, text.strokeColor, text.strokeWidth);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
export var UILifecycleState;
(function (UILifecycleState) {
    UILifecycleState[UILifecycleState["Permanent"] = 0] = "Permanent";
    UILifecycleState[UILifecycleState["Initial"] = 1] = "Initial";
    UILifecycleState[UILifecycleState["FadeIn"] = 2] = "FadeIn";
    UILifecycleState[UILifecycleState["Stable"] = 3] = "Stable";
    UILifecycleState[UILifecycleState["BeginFadeOut"] = 4] = "BeginFadeOut";
    UILifecycleState[UILifecycleState["FadeOut"] = 5] = "FadeOut";
    UILifecycleState[UILifecycleState["Destroy"] = 6] = "Destroy";
})(UILifecycleState || (UILifecycleState = {}));
export class UIFadeToBlackScreen {
    type;
    state;
    fade;
    stableTime;
    constructor(fadeInTime = 5, fadeOutTime = 5, stableTime = 0) {
        this.type = UIType.FadeToBlackScreen;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(fadeInTime, fadeOutTime);
        this.stableTime = stableTime;
    }
}
export class UIPlayerHealthBar {
    type;
    state;
    fade;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(health) {
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
export class UIEnemyHealthBar {
    type;
    state;
    fade;
    x;
    y;
    width;
    height;
    percentage;
    colorFull;
    colorEmpty;
    constructor(entitySize, percentage) {
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
export class UIEnemyAI {
    type;
    state;
    fade;
    x;
    y;
    width;
    height;
    constructor(entitySize) {
        this.type = UIType.EnemyAI;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(0, 2);
        this.x = 0;
        this.y = -(entitySize * 0.6) - 0.3;
        this.width = entitySize;
        this.height = entitySize / 5;
    }
}
export class UIInputDisplay {
    type;
    state;
    fade;
    percentagePrimary;
    percentageSecondary;
    percentageRoll;
    constructor() {
        this.type = UIType.InputDisplay;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(2, 2);
        this.percentagePrimary = 1;
        this.percentageSecondary = 1;
        this.percentageRoll = 1;
    }
}
export class UIInteractablePrompt {
    type;
    state;
    text;
    constructor(text) {
        this.type = UIType.InteractablePrompt;
        this.state = UILifecycleState.Permanent;
        this.text = text;
    }
}
export class UIToolTip {
    type;
    state;
    fade;
    text;
    constructor(text) {
        this.type = UIType.Tooltip;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(2, 2);
        this.text = text;
    }
}
export class UITitleScreen {
    type;
    state;
    fade;
    titleText;
    playButton;
    settingsButton;
    constructor() {
        this.type = UIType.TitleScreen;
        this.state = UILifecycleState.Initial;
        this.fade = new UIFade(0, 10);
        this.titleText = new UIText("Down the Dungeon", 0, -120, 120);
        this.playButton = new UIButton(new UIText("Play"), 0, 20, 200, 40);
        this.settingsButton = new UIButton(new UIText("Settings"), 0, 70, 200, 40);
    }
}
export class UIGameOverScreen {
    type;
    state;
    fade;
    titleText;
    encouragingText;
    helperText;
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
//# sourceMappingURL=UIComponent.js.map