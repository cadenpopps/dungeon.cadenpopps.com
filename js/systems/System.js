class System {

	constructor(componentRequirements) {
		this.objects = [];
		this.componentRequirements = componentRequirements;
	}

	init(engine) { }

	addObject(object) {
		if(this.componentRequirements.length > 0 && !this.objects.includes(object) && Utility.checkComponents(object, this.componentRequirements)) {
			this.objects.push(object);
		}
	}

	removeObject(object) {
		if(this.objects.indexOf(object) !== -1) {
			this.objects.splice(this.objects.indexOf(object), 1);
		}
	}

	clearObjects() {
		this.objects = [];
	}

	handleEvent(engine, eventID, data) { }
}
