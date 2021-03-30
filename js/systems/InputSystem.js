class InputSystem extends GameSystem {

	constructor() {
		super([component_controller]);
	}

	init(engine) {
		this.mobSpawnCooldown = 0;
		this.inputs = [];

		let self = this;
		document.addEventListener("keydown", function (e) {
			self.keyDown(e);
		});

		document.addEventListener("keyup", function (e) {
			self.keyUp(e);
		});
	}

	run(engine) {
		for(let ID in this.entities) {
			console.log(this.entities[ID]);
			this.setAction(engine, this.entities[ID], this.inputs);
		}
	}

	addObject(object) { }

	keyDown(event) {
		if(!this.inputs.includes(event.keyCode)) {
			this.inputs.unshift(event.keyCode);
		}
	}

	keyUp(event) {
		if(this.inputs.includes(event.keyCode)) {
			this.inputs.splice(this.inputs.indexOf(event.keyCode), 1);
		}
	}

	setAction(engine, entity, inputs) {
		if(inputs.length > 0) {
			let highestPriority = 0;
			let playerAction = action_none;
			for(let key of inputs) {
				let action = keyCode_to_action[key];
				let priority = action_to_priority[action];
				priority = this.fixPriority(engine, entity, action, priority);
				if(priority > highestPriority && entity[component_actions].actions[action].currentCooldown == 0) {
					playerAction = action;
					highestPriority = priority;
				}
			}
			entity[component_actions].nextAction = playerAction;
		}
		else {
			entity[component_actions].nextAction = action_none;
		}
	}

	fixPriority(engine, entity, action, priority) {
		if(entity[component_actions].lastAction == action) {
			if(entity[component_actions].lastActionFailed) {
				return 0;
			}
			else {
				return priority - .1;
			}
		}
		return priority;
	}


	actionEqualsLastAction(player, a) {
		return k;
	}
}
