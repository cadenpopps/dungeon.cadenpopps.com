import { Component, CType } from "../Component.js";
export default class DirectionComponent extends Component {
    direction;
    cooldown;
    constructor(direction = Direction.South) {
        super(CType.Direction);
        this.direction = direction;
        this.cooldown = 0;
    }
}
export var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["NorthEast"] = 1] = "NorthEast";
    Direction[Direction["East"] = 2] = "East";
    Direction[Direction["SouthEast"] = 3] = "SouthEast";
    Direction[Direction["South"] = 4] = "South";
    Direction[Direction["SouthWest"] = 5] = "SouthWest";
    Direction[Direction["West"] = 6] = "West";
    Direction[Direction["NorthWest"] = 7] = "NorthWest";
})(Direction || (Direction = {}));
//# sourceMappingURL=DirectionComponent.js.map