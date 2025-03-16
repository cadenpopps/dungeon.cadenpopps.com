import { Component, CType } from "../Component.js";

export default class InteractableComponent extends Component {
    public interactableType: Interactable;
    public range: number;
    public visible: boolean;
    public cooldown: number;
    public counter: number;

    constructor(interactableType: Interactable, range: number = 1, cooldown: number = 30) {
        super(CType.Interactable);
        this.interactableType = interactableType;
        this.range = range;
        this.visible = false;
        this.cooldown = cooldown;
        this.counter = 0;
    }
}

export enum Interactable {
    LevelChange,
    Chest,
    Door,
}
