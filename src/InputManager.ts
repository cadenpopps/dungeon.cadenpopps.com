import * as PoppsInput from "../lib/PoppsInput.js";
import { Event, EventManager } from "./EventManager.js";

export class InputManager {
    private eventManager: EventManager;
    private scrollTimer!: ReturnType<typeof setTimeout>;
    private inputs: Array<Input>;
    private controllerMap: Map<string, Input>;

    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
        this.inputs = new Array<Input>();
        this.controllerMap = DEFAULT_CONTROLLER_MAP;
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenKeyUp(this.keyUpHandler.bind(this));
        PoppsInput.listenScroll(this.scrollHandler.bind(this));
        PoppsInput.listenMouseDown(this.mouseDownHandler.bind(this));
        PoppsInput.listenMouseUp(this.mouseUpHandler.bind(this));
        document.addEventListener("contextmenu", (e) => e?.cancelable && e.preventDefault());
    }

    public getInputs(): Array<Input> {
        return this.inputs;
    }

    public pressed(input: Input): boolean {
        return this.inputs.includes(input);
    }

    private keyDownHandler(key: string): void {
        const lowerCaseKey = key.toLocaleLowerCase();
        if (lowerCaseKey === "n") {
            this.eventManager.addEvent(Event.level_change);
        }
        if (this.controllerMap.has(lowerCaseKey)) {
            const input = this.controllerMap.get(lowerCaseKey) as Input;
            if (input === Input.Pause) {
                if (this.inputs.includes(input)) {
                    this.inputs = this.inputs.filter((i) => i !== input);
                    this.eventManager.addEvent(Event.unpause);
                } else {
                    this.inputs.push(input);
                    this.eventManager.addEvent(Event.pause);
                }
            } else if (!this.inputs.includes(input)) {
                this.inputs.push(input);
            }
        }
    }

    private keyUpHandler(key: string): void {
        const lowerCaseKey = key.toLocaleLowerCase();
        if (this.controllerMap.has(lowerCaseKey)) {
            const input = this.controllerMap.get(lowerCaseKey) as Input;
            if (input === Input.Pause) {
                return;
            }
            this.inputs = this.inputs.filter((i) => i !== input);
        }
    }

    private scrollHandler(event: WheelEvent): void {
        const clearScrollInputs = (() => {
            this.inputs = this.inputs.filter((i: Input) => i !== Input.Zoom_In && i !== Input.Zoom_Out);
        }).bind(this);
        if (event.deltaY > 0) {
            if (!this.inputs.includes(Input.Zoom_Out)) {
                this.inputs.push(Input.Zoom_Out);
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    clearScrollInputs();
                }, 30);
            }
        } else if (event.deltaY < 0) {
            if (!this.inputs.includes(Input.Zoom_In)) {
                this.inputs.push(Input.Zoom_In);
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    clearScrollInputs();
                }, 30);
            }
        }
    }

    private mouseDownHandler(event: MouseEvent): void {
        if (event.button === 0) {
            this.inputs.push(Input.Primary);
        } else if (event.button === 2) {
            this.inputs.push(Input.Secondary);
        }
    }

    private mouseUpHandler(event: MouseEvent): void {
        if (event.button === 0) {
            this.inputs = this.inputs.filter((i) => i !== Input.Primary);
        } else if (event.button === 2) {
            this.inputs = this.inputs.filter((i) => i !== Input.Secondary);
        }
    }
}

export enum Input {
    Up,
    Left,
    Right,
    Down,
    Interact,
    Sneak,
    Roll,
    Primary,
    Secondary,
    Ultimate,
    Zoom_In,
    Zoom_Out,
    Pause,
}

export const DEFAULT_CONTROLLER_MAP = new Map<string, Input>([
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

export const DEFAULT_REVERSE_CONTROLLER_MAP = new Map<Input, string>([
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
