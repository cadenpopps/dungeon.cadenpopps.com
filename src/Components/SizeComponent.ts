import { Component, CType } from "../Component.js";

export default class SizeComponent extends Component {
    public width: number;
    public height: number;

    constructor(width: number = 1, height?: number) {
        super(CType.Size);
        this.width = width;
        if (height) {
            this.height = height;
        } else {
            this.height = this.width;
        }
    }
}
