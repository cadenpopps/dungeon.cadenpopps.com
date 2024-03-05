export class Component {
    constructor(type) {
        this.type = type;
    }
}
export var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Game"] = 0] = "Game";
    ComponentType[ComponentType["Controller"] = 1] = "Controller";
    ComponentType[ComponentType["Position"] = 2] = "Position";
    ComponentType[ComponentType["Velocity"] = 3] = "Velocity";
    ComponentType[ComponentType["Collision"] = 4] = "Collision";
    ComponentType[ComponentType["Visible"] = 5] = "Visible";
    ComponentType[ComponentType["Movement"] = 6] = "Movement";
    ComponentType[ComponentType["Camera"] = 7] = "Camera";
    ComponentType[ComponentType["Level"] = 8] = "Level";
    ComponentType[ComponentType["Interactable"] = 9] = "Interactable";
})(ComponentType || (ComponentType = {}));
export var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["NORTHEAST"] = 1] = "NORTHEAST";
    Direction[Direction["EAST"] = 2] = "EAST";
    Direction[Direction["SOUTHEAST"] = 3] = "SOUTHEAST";
    Direction[Direction["SOUTH"] = 4] = "SOUTH";
    Direction[Direction["SOUTHWEST"] = 5] = "SOUTHWEST";
    Direction[Direction["WEST"] = 6] = "WEST";
    Direction[Direction["NORTHWEST"] = 7] = "NORTHWEST";
    Direction[Direction["NONE"] = 8] = "NONE";
})(Direction || (Direction = {}));
//# sourceMappingURL=Component.js.map