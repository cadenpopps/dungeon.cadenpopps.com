import { Component, CType } from "../Component.js";

export default class TextureComponent extends Component {
    public textureMap: HTMLImageElement;

    constructor(textureMap: HTMLImageElement) {
        super(CType.Texture);
        this.textureMap = textureMap;
    }
}
