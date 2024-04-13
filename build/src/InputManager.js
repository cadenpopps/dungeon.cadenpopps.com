import * as PoppsInput from "../lib/PoppsInput.js";
import { Event } from "./EventManager.js";
export class InputManager {
    eventManager;
    scrollTimer;
    inputs;
    controllerMap;
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.inputs = new Array();
        this.controllerMap = DEFAULT_CONTROLLER_MAP;
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenKeyUp(this.keyUpHandler.bind(this));
        PoppsInput.listenScroll(this.scrollHandler.bind(this));
    }
    getInputs() {
        return this.inputs;
    }
    pressed(input) {
        return this.inputs.includes(input);
    }
    keyDownHandler(key) {
        const lowerCaseKey = key.toLocaleLowerCase();
        if (this.controllerMap.has(lowerCaseKey)) {
            const input = this.controllerMap.get(lowerCaseKey);
            if (input === Input.Pause) {
                if (this.inputs.includes(input)) {
                    this.inputs = this.inputs.filter((i) => i !== input);
                    this.eventManager.addEvent(Event.unpause);
                }
                else {
                    this.inputs.push(input);
                    this.eventManager.addEvent(Event.pause);
                }
            }
            else if (!this.inputs.includes(input)) {
                this.inputs.push(input);
            }
        }
    }
    keyUpHandler(key) {
        const lowerCaseKey = key.toLocaleLowerCase();
        if (this.controllerMap.has(lowerCaseKey)) {
            const input = this.controllerMap.get(lowerCaseKey);
            if (input === Input.Pause) {
                return;
            }
            this.inputs = this.inputs.filter((i) => i !== input);
        }
    }
    scrollHandler(event) {
        const clearScrollInputs = (() => {
            this.inputs = this.inputs.filter((i) => i !== Input.Zoom_In && i !== Input.Zoom_Out);
        }).bind(this);
        if (event.deltaY > 0) {
            if (!this.inputs.includes(Input.Zoom_In)) {
                this.inputs.push(Input.Zoom_In);
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    clearScrollInputs();
                }, 10);
            }
        }
        else if (event.deltaY < 0) {
            if (!this.inputs.includes(Input.Zoom_Out)) {
                this.inputs.push(Input.Zoom_Out);
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    clearScrollInputs();
                }, 10);
            }
        }
    }
}
export var Input;
(function (Input) {
    Input[Input["Up"] = 0] = "Up";
    Input[Input["Left"] = 1] = "Left";
    Input[Input["Right"] = 2] = "Right";
    Input[Input["Down"] = 3] = "Down";
    Input[Input["Interact"] = 4] = "Interact";
    Input[Input["Sneak"] = 5] = "Sneak";
    Input[Input["Roll"] = 6] = "Roll";
    Input[Input["Primary"] = 7] = "Primary";
    Input[Input["Secondary"] = 8] = "Secondary";
    Input[Input["Ultimate"] = 9] = "Ultimate";
    Input[Input["Zoom_In"] = 10] = "Zoom_In";
    Input[Input["Zoom_Out"] = 11] = "Zoom_Out";
    Input[Input["Pause"] = 12] = "Pause";
})(Input || (Input = {}));
export const DEFAULT_CONTROLLER_MAP = new Map([
    ["w", Input.Up],
    ["d", Input.Right],
    ["s", Input.Down],
    ["a", Input.Left],
    ["f", Input.Interact],
    ["q", Input.Primary],
    ["e", Input.Secondary],
    ["r", Input.Ultimate],
    ["shift", Input.Sneak],
    [" ", Input.Roll],
    ["escape", Input.Pause],
]);
export const DEFAULT_REVERSE_CONTROLLER_MAP = new Map([
    [Input.Up, "w"],
    [Input.Right, "d"],
    [Input.Down, "s"],
    [Input.Left, "a"],
    [Input.Interact, "f"],
    [Input.Primary, "q"],
    [Input.Secondary, "e"],
    [Input.Ultimate, "r"],
    [Input.Sneak, "shift"],
    [Input.Roll, " "],
    [Input.Pause, "escape"],
]);
//# sourceMappingURL=InputManager.js.map