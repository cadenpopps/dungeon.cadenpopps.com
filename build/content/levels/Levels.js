const DungeonTown = importJson("content/levels/DungeonTown.json");
export default { DungeonTown };
function importJson(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return JSON.parse(request.responseText, function reviver(key, value) {
        key;
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                return new Map(value.value);
            }
        }
        return value;
    });
}
//# sourceMappingURL=Levels.js.map