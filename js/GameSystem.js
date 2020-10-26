class GameSystem {

	constructor(componentSignature) {
		this.entities = {}
		this.componentSignature = componentSignature;
	}

	init(engine) { }

	run(engine) { }

	addEntity(entity) {
		if(this.componentSignature.length > 0 && !(entity.ID in this.entities) && Utility.checkComponents(entity.components, this.componentSignature)) {
			this.entities[entity.ID] = entity;
		}
	}

	destroyEntity(entity) {
		if(entity.ID in this.entities) {
			delete this.entities[entity.ID];
		}
	}

	destroyEntityByID(ID) {
		if(ID in this.entities) {
			delete this.entities[ID];
		}
	}

	handleEvent(engine, eventID, data) { }
}
