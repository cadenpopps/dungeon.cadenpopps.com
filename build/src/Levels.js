import { CType } from "../src/Component.js";
import * as Constants from "../src/Constants.js";
const DungeonTown = importJson("/content/levels/DungeonTown.json");
export default { DungeonTown };
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
//# sourceMappingURL=Levels.js.map