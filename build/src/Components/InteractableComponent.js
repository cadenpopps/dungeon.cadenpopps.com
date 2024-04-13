import { Component, CType } from "../Component.js";
export default class InteractableComponent extends Component {
    interactableType;
    range;
    active;
    constructor(interactableType, range = 1) {
        super(CType.Interactable);
        this.interactableType = interactableType;
        this.range = range;
        this.active = false;
    }
}
export var Interactable;
(function (Interactable) {
    Interactable[Interactable["Player"] = 0] = "Player";
    Interactable[Interactable["LevelChange"] = 1] = "LevelChange";
    Interactable[Interactable["Chest"] = 2] = "Chest";
    Interactable[Interactable["Door"] = 3] = "Door";
})(Interactable || (Interactable = {}));
//# sourceMappingURL=InteractableComponent.js.map