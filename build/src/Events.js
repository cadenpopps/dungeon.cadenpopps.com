export var Event;
(function (Event) {
    Event[Event["new_game"] = 0] = "new_game";
    Event[Event["entity_created"] = 1] = "entity_created";
    Event[Event["entity_destroyed"] = 2] = "entity_destroyed";
    Event[Event["entity_modified"] = 3] = "entity_modified";
})(Event || (Event = {}));
//# sourceMappingURL=Events.js.map