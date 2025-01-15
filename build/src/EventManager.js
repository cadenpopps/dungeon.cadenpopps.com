export class EventManager {
    eventQueue;
    nextQueue;
    constructor() {
        this.eventQueue = new Array();
        this.nextQueue = new Array();
    }
    addEvent(event) {
        if (this.nextQueue.includes(event)) {
            return;
        }
        this.nextQueue.push(event);
    }
    addEvents(events) {
        for (let event of events) {
            if (this.nextQueue.includes(event)) {
                continue;
            }
            this.nextQueue.push(event);
        }
    }
    tick() {
        this.eventQueue = this.nextQueue.slice();
        this.nextQueue = new Array();
    }
}
export var Event;
(function (Event) {
    Event[Event["new_game"] = 0] = "new_game";
    Event[Event["load_game"] = 1] = "load_game";
    Event[Event["entity_created"] = 2] = "entity_created";
    Event[Event["entity_destroyed"] = 3] = "entity_destroyed";
    Event[Event["entity_modified"] = 4] = "entity_modified";
    Event[Event["level_change"] = 5] = "level_change";
    Event[Event["level_loaded"] = 6] = "level_loaded";
    Event[Event["pause"] = 7] = "pause";
    Event[Event["unpause"] = 8] = "unpause";
})(Event || (Event = {}));
//# sourceMappingURL=EventManager.js.map