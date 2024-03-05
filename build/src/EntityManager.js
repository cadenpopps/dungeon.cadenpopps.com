import { ComponentType } from "./Component.js";
import { Event } from "./EventManager.js";
export class EntityManager {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.entities = new Array();
        this.data = [...Array(Object.keys(ComponentType).length / 2)].map(() => new Map());
        this.destroyQueue = new Array();
        this.idCounter = 0;
    }
    tick() {
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_destroyed:
                    this.destroyEntities();
                    break;
            }
        }
    }
    addEntity(components) {
        const entityId = this.idCounter;
        this.idCounter++;
        this.entities.push(entityId);
        for (let c of components) {
            this.data[c.type].set(entityId, c);
        }
        this.eventManager.addEvent(Event.entity_created);
        return entityId;
    }
    addEntities(entities) {
        const entityIds = new Array();
        for (let entity of entities) {
            const entityId = this.idCounter;
            entityIds.push(entityId);
            this.idCounter++;
            this.entities.push(entityId);
            for (let c of entity) {
                this.data[c.type].set(entityId, c);
            }
        }
        this.eventManager.addEvent(Event.entity_created);
        return entityIds;
    }
    removeEntity(entityId) {
        let index = this.entities.indexOf(entityId);
        if (index !== -1) {
            this.destroyQueue.push(entityId);
            this.eventManager.addEvent(Event.entity_destroyed);
        }
    }
    removeEntities(entityIds) {
        let entitiesDestroyed = false;
        for (let entityId of entityIds) {
            let index = this.entities.indexOf(entityId);
            if (index !== -1) {
                this.destroyQueue.push(entityId);
                entitiesDestroyed = true;
            }
        }
        if (entitiesDestroyed) {
            this.eventManager.addEvent(Event.entity_destroyed);
        }
    }
    destroyEntities() {
        for (let entityId of this.destroyQueue) {
            let index = this.entities.indexOf(entityId);
            this.entities.splice(index, 1);
            for (let componentList of this.data) {
                componentList.delete(entityId);
            }
        }
        this.destroyQueue = new Array();
    }
    getEntitiesWithComponentTypes(componentRequirements) {
        const entitiesWithComponents = new Array();
        for (let entityId of this.entities) {
            let missingComponent = false;
            for (let componentType of componentRequirements) {
                if (!this.data[componentType].has(entityId)) {
                    missingComponent = true;
                }
            }
            if (!missingComponent) {
                entitiesWithComponents.push(entityId);
            }
        }
        return entitiesWithComponents;
    }
    getComponentList(componentType) {
        return this.data[componentType];
    }
}
//# sourceMappingURL=EntityManager.js.map