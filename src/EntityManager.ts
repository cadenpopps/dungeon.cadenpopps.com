import { Component, CType } from "./Component.js";
import { Event, EventManager } from "./EventManager.js";

export class EntityManager {
    private CTypes = Object.keys(CType).length / 2;
    public entities: Map<number, Map<CType, Component>>;
    private idCounter: number;
    private eventManager: EventManager;
    private destroyQueue: Array<number>;

    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
        this.entities = new Map<number, Map<CType, Component>>();
        for (let i = 0; i < this.CTypes; i++) {
            this.entities.set(i, new Map<CType, Component>());
        }
        this.destroyQueue = new Array<number>();
        this.idCounter = 0;
    }

    public tick(): void {
        for (let event of this.eventManager.eventQueue) {
            switch (event) {
                case Event.entity_destroyed:
                    this.destroyEntities();
                    break;
            }
        }
    }

    public getEntity(entityId: number): Map<CType, Component> {
        const entity = this.entities.get(entityId);
        if (entity !== undefined) {
            return entity;
        }
        throw new Error(`Entity ${entityId} not found`);
    }

    public get<T>(entityId: number, CType: CType): T {
        const entity = this.entities.get(entityId);
        if (entity !== undefined) {
            const component = entity.get(CType);
            if (component !== undefined) {
                return component as T;
            }
            throw new Error(
                `Entity ${entityId} does not have component ${CType}`
            );
        }
        throw new Error(`Entity ${entityId} not found`);
    }

    public addEntity(components: Map<CType, Component>): number {
        const entityId = this.idCounter;
        this.idCounter++;
        this.entities.set(entityId, components);
        this.eventManager.addEvent(Event.entity_created);
        return entityId;
    }

    public addEntities(entities: Array<Map<CType, Component>>): Array<number> {
        const entityIds = new Array<number>();
        for (let entity of entities) {
            const entityId = this.idCounter;
            this.idCounter++;
            this.entities.set(entityId, entity);
            entityIds.push(entityId);
        }
        this.eventManager.addEvent(Event.entity_created);
        return entityIds;
    }

    public removeEntity(entityId: number): void {
        if (this.entities.has(entityId)) {
            this.destroyQueue.push(entityId);
            this.eventManager.addEvent(Event.entity_destroyed);
        }
    }

    public removeEntities(entityIds: Array<number>): void {
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

    private destroyEntities(): void {
        for (let entityId of this.destroyQueue) {
            this.entities.delete(entityId);
        }
        this.destroyQueue = new Array<number>();
    }

    public getSystemEntities(
        componentRequirements: Array<CType>
    ): Array<number> {
        const entitiesWithComponents = new Array<number>();
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
