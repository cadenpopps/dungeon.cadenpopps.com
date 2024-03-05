import PoppsCanvas from "../../lib/PoppsCanvas.js";
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
        this.masterCamera = new CameraComponent();
        this.sortedEntities = Array();
        this.canvas.loop(this.canvasCallback.bind(this));
    }
    logic() { }
    handleEvent(event) {
        switch (event) {
            case Event.entity_created:
            case Event.entity_modified:
            case Event.entity_destroyed:
                this.groupEntitiesByLayer();
                break;
        }
    }
    canvasCallback() {
        this.canvas.background(0, 0, 0);
        const cameraId = this.getHighestPriorityCameraId();
        const cam = this.entityManager.data[ComponentType.Camera].get(cameraId);
        const zoom = cam.zoom;
        const x = cam.x;
        const y = cam.x;
        for (let layer of this.sortedEntities) {
            for (let entityId of layer) {
                const pos = this.entityManager.data[ComponentType.Position].get(entityId);
                const vis = this.entityManager.data[ComponentType.Visible].get(entityId);
                this.canvas.fill(vis.color.r, vis.color.g, vis.color.b, vis.color.a);
                this.canvas.rect(pos.x * zoom, pos.y * zoom, 1 * zoom, 1 * zoom);
                if (vis.layer > 0) {
                    this.canvas.fill(0, 0, 0);
                    this.canvas.rect((pos.x + 0.2) * this.zoom, (pos.y + 0.2) * this.zoom, 0.1 * this.zoom, 0.1 * this.zoom);
                    this.canvas.rect((pos.x + 0.7) * this.zoom, (pos.y + 0.2) * this.zoom, 0.1 * this.zoom, 0.1 * this.zoom);
                    this.canvas.rect((pos.x + 0.3) * this.zoom, (pos.y + 0.7) * this.zoom, 0.4 * this.zoom, 0.1 * this.zoom);
                    this.canvas.rect((pos.x + 0.2) * this.zoom, (pos.y + 0.6) * this.zoom, 0.1 * this.zoom, 0.1 * this.zoom);
                    this.canvas.rect((pos.x + 0.7) * this.zoom, (pos.y + 0.6) * this.zoom, 0.1 * this.zoom, 0.1 * this.zoom);
                }
            }
        }
    }
    groupEntitiesByLayer() {
        this.sortedEntities = new Array();
        for (let entityId of this.entities) {
            const vis = this.entityManager.data[ComponentType.Visible].get(entityId);
            if (typeof this.sortedEntities[vis.layer] === "undefined") {
                this.sortedEntities[vis.layer] = [entityId];
            }
            else {
                this.sortedEntities[vis.layer].push(entityId);
            }
        }
    }
    getHighestPriorityCameraId() {
        let highestPriorityCameraId = -1;
        let highestPriority = -1;
        for (let entityId of this.entities) {
            if (this.entityManager.data[ComponentType.Camera].has(entityId)) {
                const cam = this.entityManager.data[ComponentType.Camera].get(entityId);
                if (cam.priority > highestPriority) {
                    highestPriorityCameraId = entityId;
                    highestPriority = cam.priority;
                }
            }
        }
        return highestPriorityCameraId;
    }
}
//# sourceMappingURL=GraphicsSystem.1.js.map