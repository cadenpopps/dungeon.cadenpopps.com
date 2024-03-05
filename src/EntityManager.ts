import { Component, ComponentType } from "./Component.js";
import { Event, EventManager } from "./EventManager.js";

export class EntityManager {
    public entities: Array<number>;
    public data: Array<Map<number, Component>>;
    private idCounter: number;
    private eventManager: EventManager;
    private destroyQueue: Array<number>;

    constructor(eventManager: EventManager) {
        this.eventManager = eventManager;
        this.entities = new Array<number>();
        this.data = [...Array(Object.keys(ComponentType).length / 2)].map(
            () => new Map<number, Component>()
        );
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

    public addEntity(components: Array<Component>): number {
        const entityId = this.idCounter;
        this.idCounter++;
        this.entities.push(entityId);
        for (let c of components) {
            this.data[c.type].set(entityId, c);
        }
        this.eventManager.addEvent(Event.entity_created);
        return entityId;
    }

    public addEntities(entities: Array<Array<Component>>): Array<number> {
        const entityIds = new Array<number>();
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

    public removeEntity(entityId: number): void {
        let index = this.entities.indexOf(entityId);
        if (index !== -1) {
            this.destroyQueue.push(entityId);
            this.eventManager.addEvent(Event.entity_destroyed);
        }
    }

    public removeEntities(entityIds: Array<number>): void {
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

    private destroyEntities(): void {
        for (let entityId of this.destroyQueue) {
            let index = this.entities.indexOf(entityId);
            this.entities.splice(index, 1);
            for (let componentList of this.data) {
                componentList.delete(entityId);
            }
        }
        this.destroyQueue = new Array<number>();
    }

    public getEntitiesWithComponentTypes(
        componentRequirements: Array<ComponentType>
    ): Array<number> {
        const entitiesWithComponents = new Array<number>();
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

    public getComponentList(
        componentType: ComponentType
    ): Map<number, Component> {
        return this.data[componentType];
    }
}
