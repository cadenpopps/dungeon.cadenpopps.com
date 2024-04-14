import { CType } from "../src/Component.js";
import * as Constants from "../src/Constants.js";
const EntryRooms = importJson("/content/rooms/EntryRooms.json");
const ExitRooms = importJson("/content/rooms/ExitRooms.json");
const EmptyRooms = importJson("/content/rooms/EmptyRooms.json");
export default { EntryRooms, ExitRooms, EmptyRooms };
function importJson(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return JSON.parse(request.responseText, function reviver(_key, value) {
        if (value !== null && value.type === CType.Tile) {
            return Constants.convertTile(value);
        }
        return value;
    });
}
//# sourceMappingURL=Rooms.js.map