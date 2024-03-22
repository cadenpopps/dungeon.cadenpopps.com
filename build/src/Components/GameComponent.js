import { Component, CType } from "../Component.js";
export default class GameComponent extends Component {
    GameState;
    constructor(gameState) {
        super(CType.Game);
        this.GameState = gameState || GameState.TITLE;
    }
}
export var GameState;
(function (GameState) {
    GameState[GameState["PLAYING"] = 0] = "PLAYING";
    GameState[GameState["PAUSED"] = 1] = "PAUSED";
    GameState[GameState["LOADING"] = 2] = "LOADING";
    GameState[GameState["TITLE"] = 3] = "TITLE";
})(GameState || (GameState = {}));
//# sourceMappingURL=GameComponent.js.map