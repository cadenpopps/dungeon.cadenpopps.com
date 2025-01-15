import { CType } from "./Component.js";
import { Event } from "./EventManager.js";
export class EntityManager {
    entities;
    CTypes = Object.keys(CType).length / 2;
    eventManager;
    idCounter;
    destroyQueue;
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
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_destroyed:
                    this.destroyEntities();
                    break;
            }
        }
    }
    hasComponent(entityId, CType) {
        const entity = this.getEntity(entityId);
        return entity.has(CType);
    }
    getEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (entity !== undefined) {
            return entity;
        }
        throw new Error(`Entity ${entityId} not found`);
    }
    get(entityId, CType) {
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
    removeComponent(entityId, CType) {
        const entity = this.entities.get(entityId);
        if (entity?.has(CType)) {
            entity?.delete(CType);
            this.eventManager.addEvent(Event.entity_modified);
        }
    }
    removeComponents(entityId, CTypes) {
        const entity = this.entities.get(entityId);
        let modified = false;
        for (const CType of CTypes) {
            if (entity?.has(CType)) {
                modified = true;
                entity?.delete(CType);
            }
        }
        if (modified) {
            this.eventManager.addEvent(Event.entity_modified);
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