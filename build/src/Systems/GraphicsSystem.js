import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { floor } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { LIGHT_LEVEL_FILL, SHADOW_FILL } from "../Constants.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import CameraSystem from "./CameraSystem.js";
export default class GraphicsSystem extends System {
    canvas;
    layers;
    cameraIds;
    constructor(eventManager, entityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [CType.Position, CType.Visible]);
        this.canvas = new PoppsCanvas();
        this.cameraIds = new Array();
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
    refreshEntitiesHelper() {
        this.cameraIds = this.entityManager.getSystemEntities([CType.Camera]);
    }
    canvasCallback() {
        this.canvas.background(0, 0, 0);
        if (this.cameraIds.length === 0) {
            return;
        }
        const cam = CameraSystem.getHighestPriorityCamera(this.cameraIds, this.entityManager);
        if (cam === undefined) {
            return;
        }
        this.canvas.canvas.translate(floor(this.canvas.width / 2 - (cam.x + cam.visualOffsetX) * cam.zoom), floor(this.canvas.height / 2 - (cam.y + cam.visualOffsetY) * cam.zoom));
        this.canvas.canvas.scale(cam.zoom, cam.zoom);
        for (let layer of this.layers) {
            const visibleEntities = this.getVisibleEntities(layer);
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
    getVisibleEntities(layer) {
        const visibleEntities = new Array();
        for (let entityId of layer) {
            const vis = this.entityManager.get(entityId, CType.Visible);
            if (vis.inVisionRange && (vis.discovered || vis.visible)) {
                visibleEntities.push(entityId);
            }
        }
        return visibleEntities;
    }
}
//# sourceMappingURL=GraphicsSystem.js.map