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
    CType[CType["Acceleration"] = 14] = "Acceleration";
    CType[CType["Size"] = 15] = "Size";
    CType[CType["AI"] = 16] = "AI";
    CType[CType["UI"] = 17] = "UI";
    CType[CType["Health"] = 18] = "Health";
    CType[CType["Ability"] = 19] = "Ability";
    CType[CType["Hitbox"] = 20] = "Hitbox";
})(CType || (CType = {}));
//# sourceMappingURL=Component.js.map