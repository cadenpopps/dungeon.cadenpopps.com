import { Component, CType } from "../Component.js";
export default class TextureComponent extends Component {
    textureMap;
    constructor(textureMap) {
        super(CType.Texture);
        this.textureMap = textureMap;
    }
}
//# sourceMappingURL=TextureComponent.js.map