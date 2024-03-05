import { Event } from "./EventManager.js";
export class System {
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
                    this.refreshEntities();
                    break;
            }
            this.handleEvent(event);
        }
        if (!this.paused) {
            this.logic();
        }
    }
    refreshEntities() {
        this.entities = this.entityManager.getEntitiesWithComponentTypes(this.requiredComponents);
    }
}
export var SystemType;
(function (SystemType) {
    SystemType[SystemType["Game"] = 0] = "Game";
    SystemType[SystemType["Input"] = 1] = "Input";
    SystemType[SystemType["Graphics"] = 2] = "Graphics";
    SystemType[SystemType["Player"] = 3] = "Player";
    SystemType[SystemType["Physics"] = 4] = "Physics";
    SystemType[SystemType["Movement"] = 5] = "Movement";
    SystemType[SystemType["Camera"] = 6] = "Camera";
    SystemType[SystemType["Level"] = 7] = "Level";
    SystemType[SystemType["Interactable"] = 8] = "Interactable";
})(SystemType || (SystemType = {}));
//# sourceMappingURL=System.js.map