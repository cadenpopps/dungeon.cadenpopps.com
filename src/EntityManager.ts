import { Component, CType, CTypeMap } from "./Component.js";
import PositionComponent from "./Components/PositionComponent.js";
import { System } from "./System.js";

export class EntityManager {
    public static PLAYER_ID = 0;
    public entities: Map<number, Map<CType, Component>>;
    private systems: Array<{
        componentRequirements: Array<CType>;
        entityIds: Array<number>;
        system: System;
    }>;
    private modifedSystems = new Array<System>();
    private createQueue: Array<Array<Component>>;
    private destroyQueue: Array<number>;
    private addComponentQueue: Array<[number, Array<Component>]>;
    private removeComponentQueue: Array<[number, Array<CType>]>;
    private lowestId: number;

    constructor() {
        this.entities = new Map<number, Map<CType, Component>>();
        this.systems = new Array<{
            componentRequirements: Array<CType>;
            entityIds: Array<number>;
            system: System;
        }>();
        this.modifedSystems = new Array<System>();
        this.createQueue = new Array<Array<Component>>();
        this.destroyQueue = new Array<number>();
        this.addComponentQueue = new Array<[number, Array<Component>]>();
        this.removeComponentQueue = new Array<[number, Array<CType>]>();
        this.lowestId = 0;
    }

    public tick(): void {
        if (this.destroyQueue.length > 0) {
            this.destroyEntities();
        }
        if (this.createQueue.length > 0) {
            this.createEntities();
        }
        if (this.addComponentQueue.length > 0 || this.removeComponentQueue.length > 0) {
            this.modifyEntities();
        }
        for (const modifiedSystem of this.modifedSystems) {
            modifiedSystem.entitiesModifiedCallback();
        }
        this.modifedSystems = new Array<System>();
    }

    public hasEntity(entityId: number): boolean {
        if (this.entities.has(entityId)) {
            return true;
        } else {
            return false;
        }
    }

    public hasComponent(entityId: number, cType: CType): boolean {
        if (this.hasEntity(entityId)) {
            return this.getEntity(entityId).has(cType);
        }
        return false;
    }

    public getEntity(entityId: number): Map<CType, Component> {
        if (this.hasEntity(entityId)) {
            return this.entities.get(entityId) as Map<CType, Component>;
        } else {
            throw new Error(`Entity ${entityId} does not exist`);
        }
    }

    public get<T>(entityId: number, cType: CType): T {
        const entity = this.getEntity(entityId);
        if (entity.has(cType)) {
            return entity.get(cType) as T;
        } else {
            throw new Error(`Entity ${entityId} does not have component ${CTypeMap.get(cType)}`);
        }
    }

    public addComponent(entityId: number, component: Component): void {
        this.addComponentQueue.push([entityId, [component]]);
    }

    public addComponents(entityId: number, components: Array<Component>): void {
        this.addComponentQueue.push([entityId, components]);
    }

    public addEntity(components: Array<Component>): void {
        this.createQueue.push(components);
    }

    public addEntities(entities: Array<Array<Component>>): void {
        this.createQueue = this.createQueue.concat(entities);
    }

    public removeEntity(entityId: number): void {
        if (this.entities.has(entityId)) {
            this.destroyQueue.push(entityId);
        }
    }

    public removeEntities(entityIds: Array<number>): void {
        for (const entityId of entityIds) {
            this.removeEntity(entityId);
        }
    }

    public removeComponent(entityId: number, cType: CType): void {
        if (this.hasEntity(entityId)) {
            this.removeComponentQueue.push([entityId, [cType]]);
        }
    }

    public removeComponents(entityId: number, cTypes: Array<CType>): void {
        if (this.hasEntity(entityId)) {
            this.removeComponentQueue.push([entityId, cTypes]);
        }
    }

    private hasComponents(entity: Map<CType, Component>, cTypes: Array<CType>): boolean {
        for (const cType of cTypes) {
            if (!entity.has(cType)) {
                return false;
            }
        }
        return true;
    }

    private getNextAvailableId(): number {
        while (this.entities.has(this.lowestId)) {
            this.lowestId++;
        }
        return this.lowestId;
    }

    private destroyEntities(): void {
        for (const entityId of this.destroyQueue) {
            if (this.hasEntity(entityId)) {
                if (entityId < this.lowestId) {
                    this.lowestId = entityId;
                }
                for (const system of this.systems) {
                    if (this.hasComponents(this.getEntity(entityId), system.componentRequirements)) {
                        if (system.entityIds.includes(entityId)) {
                            system.entityIds.splice(system.entityIds.indexOf(entityId), 1);
                            if (!this.modifedSystems.includes(system.system)) {
                                this.modifedSystems.push(system.system);
                            }
                        }
                    }
                }
                this.entities.delete(entityId);
            }
        }

        this.destroyQueue = new Array<number>();
    }

    private createEntities(): void {
        for (const entity of this.createQueue) {
            const entityId = this.getNextAvailableId();
            const componentMap = new Map<CType, Component>();
            for (const component of entity) {
                componentMap.set(component.type, component);
            }
            this.entities.set(entityId, componentMap);

            for (const system of this.systems) {
                if (
                    !system.entityIds.includes(entityId) &&
                    this.hasComponents(componentMap, system.componentRequirements)
                ) {
                    system.entityIds.push(entityId);
                    if (!this.modifedSystems.includes(system.system)) {
                        this.modifedSystems.push(system.system);
                    }
                }
            }
        }

        this.createQueue = new Array<Array<Component>>();
    }

    private modifyEntities(): void {
        for (const instruction of this.removeComponentQueue) {
            const entityId = instruction[0];
            const entity = this.getEntity(entityId);
            for (const ctype of instruction[1]) {
                entity?.delete(ctype);
            }
            for (const system of this.systems) {
                if (system.entityIds.includes(entityId) && !this.hasComponents(entity, system.componentRequirements)) {
                    system.entityIds.splice(system.entityIds.indexOf(entityId), 1);
                    if (!this.modifedSystems.includes(system.system)) {
                        this.modifedSystems.push(system.system);
                    }
                }
            }
        }
        this.removeComponentQueue = new Array<[number, Array<CType>]>();

        for (const instruction of this.addComponentQueue) {
            const entityId = instruction[0];
            const entity = this.getEntity(entityId);
            for (const component of instruction[1]) {
                entity.set(component.type, component);
            }
            for (const system of this.systems) {
                if (!system.entityIds.includes(entityId) && this.hasComponents(entity, system.componentRequirements)) {
                    system.entityIds.push(entityId);
                    if (!this.modifedSystems.includes(system.system)) {
                        this.modifedSystems.push(system.system);
                    }
                }
            }
        }

        this.addComponentQueue = new Array<[number, Array<Component>]>();
    }

    public subscribeToEntities(componentRequirements: Array<CType>, entityIds: Array<number>, system: System): void {
        this.systems.push({
            componentRequirements: componentRequirements,
            entityIds: entityIds,
            system: system,
        });
    }

    public getEntitiesWithComponents(componentRequirements: Array<CType>): Array<number> {
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

    public getPlayerId(): number {
        return EntityManager.PLAYER_ID;
    }

    public getLevelEntities(depth: number): Map<number, Array<Component>> {
        const levelEntities = new Map<number, Array<Component>>();
        for (const entry of this.entities.entries()) {
            const entity = entry[1];
            if (entity.has(CType.Player)) {
                continue;
            }
            if (entity.has(CType.Position) && (entity.get(CType.Position) as PositionComponent).z === depth) {
                levelEntities.set(entry[0], Array.from(entity.values()));
            }
        }
        return levelEntities;
    }
}
