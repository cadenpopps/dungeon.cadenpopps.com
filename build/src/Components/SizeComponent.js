import { Component, CType } from "../Component.js";
export default class SizeComponent extends Component {
    width;
    height;
    constructor(width = 1, height) {
        super(CType.Size);
        this.width = width;
        if (height) {
            this.height = height;
        }
        else {
            this.height = this.width;
        }
    }
}
//# sourceMappingURL=SizeComponent.js.map