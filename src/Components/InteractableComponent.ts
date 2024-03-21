import { Component, CType } from "../Component.js";

export default class InteractableComponent extends Component {
    public interactableType: Interactable;

    constructor(interactableType: Interactable) {
        super(CType.Interactable);
        this.interactableType = interactableType;
    }
}

export enum Interactable {
    Player,
    LevelChange,
    Chest,
    Door,
}
