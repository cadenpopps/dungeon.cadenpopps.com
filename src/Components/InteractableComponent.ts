import { Component, CType } from "../Component.js";

export default class InteractableComponent extends Component {
    public interactableType: Interactable;
    public range: number;
    public active: boolean;

    constructor(interactableType: Interactable, range: number = 1) {
        super(CType.Interactable);
        this.interactableType = interactableType;
        this.range = range;
        this.active = false;
    }
}

export enum Interactable {
    Player,
    LevelChange,
    Chest,
    Door,
}
