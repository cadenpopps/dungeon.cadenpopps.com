import { CType } from "./Component.js";
import { Event } from "./EventManager.js";
export class EntityManager {
    CTypes = Object.keys(CType).length / 2;
    entities;
    idCounter;
    eventManager;
    destroyQueue;
    counter = 0;
    counter2 = 0;
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.entities = new Map();
        for (let i = 0; i < this.CTypes; i++) {
            this.entities.set(i, new Map());
        }
        this.destroyQueue = new Array();
        this.idCounter = 0;
    }
    tick() {
        this.counter2++;
        if (this.counter2 > 60) {
            this.counter = 0;
            this.counter2 = 0;
        }
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_destroyed:
                    this.destroyEntities();
                    break;
            }
        }
    }
    getEntity(entityId) {
        this.counter++;
        const entity = this.entities.get(entityId);
        if (entity !== undefined) {
            return entity;
        }
        throw new Error(`Entity ${entityId} not found`);
    }
    get(entityId, CType) {
        this.counter++;
        const entity = this.entities.get(entityId);
        if (entity !== undefined) {
            const component = entity.get(CType);
            if (component !== undefined) {
                return component;
            }
            throw new Error(`Entity ${entityId} does not have component ${CType}`);
        }
        throw new Error(`Entity ${entityId} not found`);
    }
    addEntity(components) {
        const entityId = this.idCounter;
        this.idCounter++;
        this.entities.set(entityId, components);
        this.eventManager.addEvent(Event.entity_created);
        return entityId;
    }
    addEntities(entities) {
        const entityIds = new Array();
        for (let entity of entities) {
            const entityId = this.idCounter;
            this.idCounter++;
            this.entities.set(entityId, entity);
            entityIds.push(entityId);
        }
        this.eventManager.addEvent(Event.entity_created);
        return entityIds;
    }
    removeEntity(entityId) {
        if (this.entities.has(entityId)) {
            this.destroyQueue.push(entityId);
            this.eventManager.addEvent(Event.entity_destroyed);
        }
    }
    removeEntities(entityIds) {
        let entitiesDestroyed = false;
        for (let entityId of entityIds) {
            if (this.entities.has(entityId)) {
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
            this.entities.delete(entityId);
        }
        this.destroyQueue = new Array();
    }
    getSystemEntities(componentRequirements) {
        const entitiesWithComponents = new Array();
        for (let entity of this.entities.entries()) {
            let missingComponent = false;
            for (let CType of componentRequirements) {
                if (!entity[1].has(CType)) {
                    missingComponent = true;
                }
            }
            if (!missingComponent) {
                entitiesWithComponents.push(entity[0]);
            }
        }
        return entitiesWithComponents;
    }
}
//# sourceMappingURL=EntityManager.js.map