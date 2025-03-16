import { CType, CTypeMap } from "./Component.js";
export class EntityManager {
    static PLAYER_ID = 0;
    entities;
    systems;
    modifedSystems = new Array();
    createQueue;
    destroyQueue;
    addComponentQueue;
    removeComponentQueue;
    lowestId;
    constructor() {
        this.entities = new Map();
        this.systems = new Array();
        this.modifedSystems = new Array();
        this.createQueue = new Array();
        this.destroyQueue = new Array();
        this.addComponentQueue = new Array();
        this.removeComponentQueue = new Array();
        this.lowestId = 0;
    }
    tick() {
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
        this.modifedSystems = new Array();
    }
    hasEntity(entityId) {
        if (this.entities.has(entityId)) {
            return true;
        }
        else {
            return false;
        }
    }
    hasComponent(entityId, cType) {
        if (this.hasEntity(entityId)) {
            return this.getEntity(entityId).has(cType);
        }
        return false;
    }
    getEntity(entityId) {
        if (this.hasEntity(entityId)) {
            return this.entities.get(entityId);
        }
        else {
            throw new Error(`Entity ${entityId} does not exist`);
        }
    }
    get(entityId, cType) {
        const entity = this.getEntity(entityId);
        if (entity.has(cType)) {
            return entity.get(cType);
        }
        else {
            throw new Error(`Entity ${entityId} does not have component ${CTypeMap.get(cType)}`);
        }
    }
    addComponent(entityId, component) {
        this.addComponentQueue.push([entityId, [component]]);
    }
    addComponents(entityId, components) {
        this.addComponentQueue.push([entityId, components]);
    }
    addEntity(components) {
        this.createQueue.push(components);
    }
    addEntities(entities) {
        this.createQueue = this.createQueue.concat(entities);
    }
    removeEntity(entityId) {
        if (this.entities.has(entityId)) {
            this.destroyQueue.push(entityId);
        }
    }
    removeEntities(entityIds) {
        for (const entityId of entityIds) {
            this.removeEntity(entityId);
        }
    }
    removeComponent(entityId, cType) {
        if (this.hasEntity(entityId)) {
            this.removeComponentQueue.push([entityId, [cType]]);
        }
    }
    removeComponents(entityId, cTypes) {
        if (this.hasEntity(entityId)) {
            this.removeComponentQueue.push([entityId, cTypes]);
        }
    }
    hasComponents(entity, cTypes) {
        for (const cType of cTypes) {
            if (!entity.has(cType)) {
                return false;
            }
        }
        return true;
    }
    getNextAvailableId() {
        while (this.entities.has(this.lowestId)) {
            this.lowestId++;
        }
        return this.lowestId;
    }
    destroyEntities() {
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
        this.destroyQueue = new Array();
    }
    createEntities() {
        for (const entity of this.createQueue) {
            const entityId = this.getNextAvailableId();
            const componentMap = new Map();
            for (const component of entity) {
                componentMap.set(component.type, component);
            }
            this.entities.set(entityId, componentMap);
            for (const system of this.systems) {
                if (!system.entityIds.includes(entityId) &&
                    this.hasComponents(componentMap, system.componentRequirements)) {
                    system.entityIds.push(entityId);
                    if (!this.modifedSystems.includes(system.system)) {
                        this.modifedSystems.push(system.system);
                    }
                }
            }
        }
        this.createQueue = new Array();
    }
    modifyEntities() {
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
        this.removeComponentQueue = new Array();
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
        this.addComponentQueue = new Array();
    }
    subscribeToEntities(componentRequirements, entityIds, system) {
        this.systems.push({
            componentRequirements: componentRequirements,
            entityIds: entityIds,
            system: system,
        });
    }
    getEntitiesWithComponents(componentRequirements) {
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
    getPlayerId() {
        return EntityManager.PLAYER_ID;
    }
    getLevelEntities(depth) {
        const levelEntities = new Map();
        for (const entry of this.entities.entries()) {
            const entity = entry[1];
            if (entity.has(CType.Player)) {
                continue;
            }
            if (entity.has(CType.Position) && entity.get(CType.Position).z === depth) {
                levelEntities.set(entry[0], Array.from(entity.values()));
            }
        }
        return levelEntities;
    }
}
//# sourceMappingURL=EntityManager.js.map