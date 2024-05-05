import { Event } from "./EventManager.js";
export class System {
    type;
    paused;
    requiredComponents;
    entities;
    eventManager;
    entityManager;
    constructor(type, eventManager, entityManager, requiredComponents) {
        this.type = type;
        this.paused = false;
        this.eventManager = eventManager;
        this.entityManager = entityManager;
        this.requiredComponents = requiredComponents;
        this.entities = new Array();
    }
    tick() {
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_created:
                case Event.entity_modified:
                case Event.entity_destroyed:
                    this.getEntities();
                    break;
                case Event.level_change:
                    this.pause();
                    break;
                case Event.level_loaded:
                    this.unpause();
                    break;
                case Event.pause:
                    this.pause();
                    break;
                case Event.unpause:
                    this.unpause();
                    break;
            }
            this.handleEvent(event);
        }
        if (!this.paused) {
            this.logic();
        }
    }
    handleEvent(_event) { }
    logic() { }
    getEntities() {
        this.entities = this.entityManager.getSystemEntities(this.requiredComponents);
        this.getEntitiesHelper();
    }
    getEntitiesHelper() { }
    pause() {
        this.paused = true;
    }
    unpause() {
        this.paused = false;
    }
}
export var SystemType;
(function (SystemType) {
    SystemType[SystemType["Game"] = 0] = "Game";
    SystemType[SystemType["Controller"] = 1] = "Controller";
    SystemType[SystemType["Graphics"] = 2] = "Graphics";
    SystemType[SystemType["Player"] = 3] = "Player";
    SystemType[SystemType["Physics"] = 4] = "Physics";
    SystemType[SystemType["Movement"] = 5] = "Movement";
    SystemType[SystemType["Camera"] = 6] = "Camera";
    SystemType[SystemType["Level"] = 7] = "Level";
    SystemType[SystemType["Interactable"] = 8] = "Interactable";
    SystemType[SystemType["Light"] = 9] = "Light";
    SystemType[SystemType["Visible"] = 10] = "Visible";
    SystemType[SystemType["AI"] = 11] = "AI";
    SystemType[SystemType["UI"] = 12] = "UI";
    SystemType[SystemType["Ability"] = 13] = "Ability";
    SystemType[SystemType["Hitbox"] = 14] = "Hitbox";
    SystemType[SystemType["Health"] = 15] = "Health";
    SystemType[SystemType["Texture"] = 16] = "Texture";
    SystemType[SystemType["Enemy"] = 17] = "Enemy";
})(SystemType || (SystemType = {}));
//# sourceMappingURL=System.js.map