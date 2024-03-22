import { Component, CType } from "../Component.js";

export default class LightSourceComponent extends Component {
    public lightLevel: number;

    constructor(lightLevel: number) {
        super(CType.LightSource);
        this.lightLevel = lightLevel;
    }
}
