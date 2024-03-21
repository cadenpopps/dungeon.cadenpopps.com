const EntryRooms = importJson("content/rooms/EntryRooms.json");
const ExitRooms = importJson("content/rooms/ExitRooms.json");
const EmptyRooms = importJson("content/rooms/EmptyRooms.json");
export default { EntryRooms, ExitRooms, EmptyRooms };

function importJson(path: string) {
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
