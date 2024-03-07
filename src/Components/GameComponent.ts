import { Component, CType } from "../Component.js";

export default class GameComponent extends Component {
    public GameState: GameState;

    constructor(gameState?: GameState) {
        super(CType.Game);
        this.GameState = gameState || GameState.TITLE;
    }
}

export enum GameState {
    PLAYING,
    PAUSED,
    LOADING,
    TITLE,
}
