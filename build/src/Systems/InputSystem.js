import * as PoppsInput from "../../lib/PoppsInput.js";
import { CType } from "../Component.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class InputSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Input, eventManager, entityManager, [
            CType.Controller,
        ]);
        PoppsInput.listenKeyDown(this.keyDownHandler.bind(this));
        PoppsInput.listenKeyUp(this.keyUpHandler.bind(this));
        PoppsInput.listenScroll(this.scrollHandler.bind(this));
    }
    logic() { }
    handleEvent(event) { }
    keyDownHandler(key) {
        for (let entityId of this.entities) {
            const controller = this.entityManager.get(entityId, CType.Controller);
            switch (key) {
                case "n":
                    this.eventManager.addEvent(Event.level_down);
                    break;
                case "u":
                    this.eventManager.addEvent(Event.level_up);
                    break;
                case "w":
                case "W":
                case "ArrowUp":
                    controller.up = true;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    controller.right = true;
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    controller.down = true;
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    controller.left = true;
                    break;
            }
        }
    }
    keyUpHandler(key) {
        for (let entityId of this.entities) {
            const controller = this.entityManager.get(entityId, CType.Controller);
            switch (key) {
                case "w":
                case "W":
                case "ArrowUp":
                    controller.up = false;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    controller.right = false;
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    controller.down = false;
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    controller.left = false;
                    break;
            }
        }
    }
    scrollHandler(event) {
        for (let entityId of this.entities) {
            const controller = this.entityManager.get(entityId, CType.Controller);
            if (event.deltaY < 0) {
                controller.zoom_in = false;
                controller.zoom_out = true;
            }
            else if (event.deltaY > 0) {
                controller.zoom_in = true;
                controller.zoom_out = false;
            }
        }
    }
}
//# sourceMappingURL=InputSystem.js.map