import PoppsCanvas from "../../lib/PoppsCanvas.js";
import { distance, floor } from "../../lib/PoppsMath.js";
import { ComponentType } from "../Component.js";
import CameraComponent from "../Components/CameraComponent.js";
import { Event } from "../EventManager.js";
import { System, SystemType } from "../System.js";
export default class GraphicsSystem extends System {
    constructor(eventManager, entityManager) {
        super(SystemType.Graphics, eventManager, entityManager, [
            ComponentType.Position,
            ComponentType.Visible,
        ]);
        this.canvas = new PoppsCanvas();
        this.masterCamera = new CameraComponent(0, 0, 0, 0, 0);
        this.layers = Array();
        this.canvas.loop(this.canvasCallback.bind(this));
    }
    logic() { }
    handleEvent(event) {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.adjustCamera();
                this.groupEntitiesByLayer();
                break;
            case Event.level_up:
                this.adjustCamera();
                this.groupEntitiesByLayer();
                break;
            case Event.level_down:
                this.adjustCamera();
                this.groupEntitiesByLayer();
                break;
        }
    }
    canvasCallback() {
        this.canvas.background(0, 0, 0);
        this.adjustCamera();
        this.canvas.canvas.translate(floor(this.canvas.width / 2 -
            0.5 * this.masterCamera.zoom -
            this.masterCamera.x * this.masterCamera.zoom), floor(this.canvas.height / 2 -
            0.5 * this.masterCamera.zoom -
            this.masterCamera.y * this.masterCamera.zoom));
        this.canvas.canvas.scale(this.masterCamera.zoom, this.masterCamera.zoom);
        for (let layer of this.layers) {
            const visibleEntities = this.determineVisibleEntities(layer);
            for (let entityId of visibleEntities) {
                const pos = this.entityManager.data[ComponentType.Position].get(entityId);
                const vis = this.entityManager.data[ComponentType.Visible].get(entityId);
                this.canvas.fill(vis.color.r, vis.color.g, vis.color.b, vis.color.a);
                this.canvas.rect(pos.x, pos.y, 1, 1);
                if (vis.layer > 0) {
                    this.canvas.fill(0, 0, 0);
                    this.canvas.rect(pos.x + 0.2, pos.y + 0.2, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.7, pos.y + 0.2, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.3, pos.y + 0.7, 0.4, 0.1);
                    this.canvas.rect(pos.x + 0.2, pos.y + 0.6, 0.1, 0.1);
                    this.canvas.rect(pos.x + 0.7, pos.y + 0.6, 0.1, 0.1);
                }
            }
        }
        this.canvas.canvas.resetTransform();
    }
    groupEntitiesByLayer() {
        this.layers = new Array();
        for (let entityId of this.entities) {
            const vis = this.entityManager.data[ComponentType.Visible].get(entityId);
            while (this.layers.length - 1 < vis.layer) {
                this.layers.push([]);
            }
            this.layers[vis.layer].push(entityId);
        }
    }
    determineVisibleEntities(layer) {
        const visibleEntities = new Array();
        for (let entityId of layer) {
            if (this.withinVisionRange(entityId)) {
                visibleEntities.push(entityId);
            }
        }
        return visibleEntities;
    }
    withinVisionRange(entityId) {
        const pos = this.entityManager.data[ComponentType.Position].get(entityId);
        return (distance(pos.x, pos.y, this.masterCamera.x, this.masterCamera.y) <
            this.masterCamera.visibleDistance);
    }
    adjustCamera() {
        this.masterCamera.priority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.data[ComponentType.Camera].has(entityId)) {
                const cam = this.entityManager.data[ComponentType.Camera].get(entityId);
                if (cam.priority > this.masterCamera.priority) {
                    this.masterCamera.zoom = cam.zoom;
                    this.masterCamera.x = cam.x;
                    this.masterCamera.y = cam.y;
                    this.masterCamera.priority = cam.priority;
                    this.masterCamera.visibleDistance = cam.visibleDistance;
                }
            }
        }
    }
}
//# sourceMappingURL=GraphicsSystem.js.map