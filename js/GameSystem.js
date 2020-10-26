class GameSystem {

	constructor(componentSignature) {
		this.entities = [];
		this.componentSignature = componentSignature;
	}

	init(engine) { }

	run(engine) { }

	addEntity(ID, components) {
		if(this.componentSignature.length > 0 && !(ID in this.entities) && Utility.checkComponents(components, this.componentSignature)) {
			this.entities[ID] = components;
		}
	}

	destroyEntity(ID) {
		if(ID in this.entities) {
			delete this.entities[ID];
		}
	}

	clearEntities() {
		this.entities = [];
	}

	handleEvent(engine, eventID, data) { }
}
