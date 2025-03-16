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
    Event[Event["init"] = 0] = "init";
    Event[Event["new_game"] = 1] = "new_game";
    Event[Event["respawn"] = 2] = "respawn";
    Event[Event["load_game"] = 3] = "load_game";
    Event[Event["level_change_begin"] = 4] = "level_change_begin";
    Event[Event["level_change_complete"] = 5] = "level_change_complete";
    Event[Event["begin_level_load"] = 6] = "begin_level_load";
    Event[Event["level_loaded"] = 7] = "level_loaded";
    Event[Event["pause"] = 8] = "pause";
    Event[Event["unpause"] = 9] = "unpause";
})(Event || (Event = {}));
//# sourceMappingURL=EventManager.js.map