import { CType } from "../src/Component.js";
import * as Constants from "../src/Constants.js";
import { Tile } from "../src/Constants.js";
const EntryRooms = importJson("content/rooms/EntryRooms.json");
const ExitRooms = importJson("content/rooms/ExitRooms.json");
const EmptyRooms = importJson("content/rooms/EmptyRooms.json");
export default { EntryRooms, ExitRooms, EmptyRooms };
function importJson(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    return JSON.parse(request.responseText, function reviver(_key, value) {
        if (value !== null && value.type === CType.Tile) {
            switch (value.tileType) {
                case Tile.Floor:
                    return Constants.newDungeonFloor(value.x, value.y);
                case Tile.Wall:
                    return Constants.newWall(value.x, value.y);
                case Tile.Door:
                    return Constants.newDoor(value.x, value.y);
                case Tile.Path:
                    return Constants.newPath(value.x, value.y);
                case Tile.Grass:
                    return Constants.newGrass(value.x, value.y);
                case Tile.StairUp:
                    return Constants.newEntry(value.x, value.y);
                case Tile.StairDown:
                    return Constants.newExit(value.x, value.y);
            }
        }
        return value;
    });
}
//# sourceMappingURL=Rooms.js.map