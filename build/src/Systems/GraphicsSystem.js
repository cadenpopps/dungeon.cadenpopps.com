import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class GraphicsSystem extends System {
    canvas;
    invisibleCanvas;
    layers;
    constructor(eventManager, entityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [CType.Position, CType.Visible]);
        this.canvas = new PoppsCanvas();
        this.invisibleCanvas = new PoppsCanvas(0, document.querySelector(`#spriteCanvas`));
        this.layers = Array();
        this.canvas.loop(this.canvasCallback.bind(this));
        this.canvas.setImageSmoothingEnabled(false);
        this.invisibleCanvas.setImageSmoothingEnabled(false);
    }
    handleEvent(event) {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.groupEntitiesByLayer();
                break;
            case Event.level_loaded:
                this.groupEntitiesByLayer();
                break;
        }
    }
    getEntitiesHelper() { }
    canvasCallback() {
        this.canvas.clear();
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        this.canvas.canvas.translate(floor(this.canvas.width / 2) - floor((cam.x + cam.visualOffsetX) * cam.zoom), floor(this.canvas.height / 2) - floor((cam.y + cam.visualOffsetY) * cam.zoom));
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        for (let layer of this.layers) {
            const visibleEntities = VisibleSystem.getVisibleAndDiscoveredEntities(layer, this.entityManager);
            for (let entityId of visibleEntities) {
                const entity = this.entityManager.getEntity(entityId);
                const pos = entity.get(CType.Position);
                const vis = entity.get(CType.Visible);
                const size = entity.get(CType.Size).size;
                const halfSize = size / 2;
                if (entity.has(CType.Texture)) {
                    const tex = entity.get(CType.Texture);
                    if (!vis.visible) {
                        this.canvas.setGlobalAlpha(0.8);
                    }
                    if (entity.has(CType.Movement)) {
                        const mov = entity.get(CType.Movement);
                        if (mov.rolling) {
                            this.canvas.setGlobalAlpha(0.5);
                        }
                    }
                    if (size === 1) {
                        for (let texture of tex.textures) {
                            this.canvas.sprite(texture.textureMap, texture.mapX, texture.mapY, texture.pixelWidth, texture.pixelHeight, texture.x + pos.x - halfSize, texture.y + pos.y - halfSize, size, size);
                            if (texture.tint) {
                                this.canvas.fill(texture.tint.r, texture.tint.g, texture.tint.b, texture.tint.a);
                                this.canvas.rect(texture.x + pos.x - halfSize, texture.y + pos.y - halfSize, size, size);
                            }
                        }
                        this.canvas.canvas.globalCompositeOperation = "source-atop";
                        const light = vis.light;
                        this.canvas.fill(light.r, light.g, light.b, light.a);
                        this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                        const shadow = vis.shadow;
                        this.canvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                        this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                        this.canvas.canvas.globalCompositeOperation = "source-over";
                    }
                    else {
                        for (let texture of tex.textures) {
                            this.invisibleCanvas.clear();
                            this.invisibleCanvas.sprite(texture.textureMap, texture.mapX, texture.mapY, texture.pixelWidth, texture.pixelHeight, 0, 0, texture.pixelWidth, texture.pixelHeight);
                            this.invisibleCanvas.canvas.globalCompositeOperation = "source-atop";
                            if (texture.tint) {
                                this.canvas.fill(texture.tint.r, texture.tint.g, texture.tint.b, texture.tint.a);
                                this.canvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            }
                            const light = vis.light;
                            this.invisibleCanvas.fill(light.r, light.g, light.b, light.a);
                            this.invisibleCanvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            const shadow = vis.shadow;
                            this.invisibleCanvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                            this.invisibleCanvas.rect(0, 0, texture.pixelWidth, texture.pixelHeight);
                            this.invisibleCanvas.canvas.globalCompositeOperation = "source-over";
                            this.canvas.sprite(this.invisibleCanvas.canvasElement, 0, 0, texture.pixelWidth, texture.pixelHeight, texture.x + pos.x - halfSize, texture.y + pos.y - halfSize, size, size);
                        }
                    }
                    this.canvas.resetGlobalAlpha();
                }
                else {
                    if (!vis.visible) {
                        this.canvas.fill(255, 255, 255, 0.75);
                    }
                    else {
                        this.canvas.fill(255, 255, 255, 1);
                    }
                    this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                    const light = vis.light;
                    this.canvas.fill(light.r, light.g, light.b, light.a);
                    this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                    const shadow = vis.shadow;
                    this.canvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                    this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                }
            }
        }
        this.canvas.canvas.resetTransform();
    }
    groupEntitiesByLayer() {
        this.layers = new Array();
        for (let entityId of this.entities) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            while (this.layers.length - 1 < vis.layer) {
                this.layers.push([]);
            }
            this.layers[vis.layer].push(entityId);
        }
    }
}
//# sourceMappingURL=GraphicsSystem.js.map