export class Component {
    type;
    constructor(type) {
        this.type = type;
    }
}
export var CType;
(function (CType) {
    CType[CType["Game"] = 0] = "Game";
    CType[CType["Controller"] = 1] = "Controller";
    CType[CType["Position"] = 2] = "Position";
    CType[CType["Velocity"] = 3] = "Velocity";
    CType[CType["Collision"] = 4] = "Collision";
    CType[CType["Visible"] = 5] = "Visible";
    CType[CType["Movement"] = 6] = "Movement";
    CType[CType["Camera"] = 7] = "Camera";
    CType[CType["Level"] = 8] = "Level";
    CType[CType["LevelChange"] = 9] = "LevelChange";
    CType[CType["Player"] = 10] = "Player";
    CType[CType["Interactable"] = 11] = "Interactable";
    CType[CType["Tile"] = 12] = "Tile";
    CType[CType["LightSource"] = 13] = "LightSource";
})(CType || (CType = {}));
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