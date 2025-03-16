import { Component, CType } from "../Component.js";
export default class InteractableComponent extends Component {
    interactableType;
    range;
    visible;
    cooldown;
    counter;
    constructor(interactableType, range = 1, cooldown = 30) {
        super(CType.Interactable);
        this.interactableType = interactableType;
        this.range = range;
        this.visible = false;
        this.cooldown = cooldown;
        this.counter = 0;
    }
}
export var Interactable;
(function (Interactable) {
    Interactable[Interactable["LevelChange"] = 0] = "LevelChange";
    Interactable[Interactable["Chest"] = 1] = "Chest";
    Interactable[Interactable["Door"] = 2] = "Door";
})(Interactable || (Interactable = {}));
//# sourceMappingURL=InteractableComponent.js.map