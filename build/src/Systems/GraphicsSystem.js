import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
import VisibleSystem from "./VisibleSystem.js";
export default class GraphicsSystem extends System {
    canvas;
    layers;
    constructor(eventManager, entityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [CType.Position, CType.Visible]);
        this.canvas = new PoppsCanvas();
        this.layers = Array();
        this.canvas.loop(this.canvasCallback.bind(this));
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
        this.canvas.background(0, 0, 0);
        const cam = CameraSystem.getHighestPriorityCamera();
        if (!cam) {
            return;
        }
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom));
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        for (let layer of this.layers) {
            const visibleEntities = VisibleSystem.getVisibleAndDiscoveredEntities(layer, this.entityManager);
            for (let entityId of visibleEntities) {
                const entity = this.entityManager.getEntity(entityId);
                const pos = entity.get(CType.Position);
                const vis = entity.get(CType.Visible);
                if (!vis.visible) {
                    this.canvas.fill(vis.color.r, vis.color.g, vis.color.b, vis.color.a * 0.75);
                }
                else {
                    this.canvas.fill(vis.color.r, vis.color.g, vis.color.b, vis.color.a);
                }
                if (entity.has(CType.Movement)) {
                    const mov = entity.get(CType.Movement);
                    if (mov.rolling) {
                        this.canvas.fill(vis.color.r, vis.color.g, vis.color.b, vis.color.a / 2);
                    }
                }
                const size = entity.get(CType.Size).size;
                const halfSize = size / 2;
                this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                const light = LIGHT_LEVEL_FILL[vis.lightLevel];
                this.canvas.fill(light.r, light.g, light.b, light.a);
                this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
                const shadow = SHADOW_FILL[vis.lightLevel];
                this.canvas.fill(shadow.r, shadow.g, shadow.b, shadow.a);
                this.canvas.rect(pos.x - halfSize, pos.y - halfSize, size, size);
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