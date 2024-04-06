import { Component, CType } from "../Component.js";

export default class SizeComponent extends Component {
    public size: number;

    constructor(size = 1) {
        super(CType.Size);
        this.size = size;
    }
}
