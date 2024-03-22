import { Component, CType } from "../Component.js";
export default class InteractableComponent extends Component {
    interactableType;
    constructor(interactableType) {
        super(CType.Interactable);
        this.interactableType = interactableType;
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