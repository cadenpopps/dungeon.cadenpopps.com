export class EventManager {
    eventQueue;
    nextQueue;
    constructor() {
        this.eventQueue = new Array();
        this.nextQueue = new Array();
    }
    addEvent(event) {
        this.nextQueue.push(event);
    }
    addEvents(events) {
        for (let event of events) {
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
    Event[Event["entity_created"] = 1] = "entity_created";
    Event[Event["entity_destroyed"] = 2] = "entity_destroyed";
    Event[Event["entity_modified"] = 3] = "entity_modified";
    Event[Event["level_change"] = 4] = "level_change";
    Event[Event["level_loaded"] = 5] = "level_loaded";
    Event[Event["pause"] = 6] = "pause";
    Event[Event["unpause"] = 7] = "unpause";
})(Event || (Event = {}));
//# sourceMappingURL=EventManager.js.map