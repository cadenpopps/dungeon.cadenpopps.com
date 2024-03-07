import { Component, CType } from "../Component.js";

export default class CameraComponent extends Component {
    public level: number;
    public levelExitId: number;
    public levelEntryId: number;

    constructor() {
        super(CType.Player);
        this.level = 1;
        this.levelEntryId = 0;
        this.levelExitId = 0;
    }
}
