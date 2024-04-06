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
    }

    public getInputs(): Array<Input> {
        return this.inputs;
    }

    public pressed(input: Input): boolean {
        return this.inputs.includes(input);
    }

    private keyDownHandler(key: string): void {
        const lowerCaseKey = key.toLocaleLowerCase();
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
        // else {
        //     console.log(`Input map does not contain key ${key}`);
        // }
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
            if (!this.inputs.includes(Input.Zoom_In)) {
                this.inputs.push(Input.Zoom_In);
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    clearScrollInputs();
                }, 10);
            }
        } else if (event.deltaY < 0) {
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

export enum Input {
    Up,
    Left,
    Right,
    Down,
    Interact,
    Sneak,
    Roll,
    Zoom_In,
    Zoom_Out,
    Pause,
}

const DEFAULT_CONTROLLER_MAP = new Map<string, Input>([
    ["w", Input.Up],
    ["d", Input.Right],
    ["s", Input.Down],
    ["a", Input.Left],
    ["e", Input.Interact],
    ["shift", Input.Sneak],
    [" ", Input.Roll],
    ["escape", Input.Pause],
]);
