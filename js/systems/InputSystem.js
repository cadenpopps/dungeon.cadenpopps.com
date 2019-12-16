class InputSystem extends System {

	constructor() {
		super([]);
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
		if(keys.includes('n') && this.mobSpawnCooldown <= 0) {
			this.mobSpawnCooldown = 10;
			engine.sendEvent(event_spawn_enemy_close, engine.getPlayer());
		}

		if(this.mobSpawnCooldown > 0) {
			this.mobSpawnCooldown--;
		}

		this.setPlayerAction(engine, this.inputs);
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

	setPlayerAction(engine, inputs) {
		let player = engine.getPlayer();
		if(inputs.length > 0) {
			let highestPriority = 0;
			let playerAction = action_none;
			for(let key of inputs) {
				let action = keyCode_to_action[key];
				let priority = action_to_priority[action];
				priority = this.fixPriority(player, action, priority);
				if(priority > highestPriority) {
					playerAction = action;
					highestPriority = priority;
				}
			}
			player.actions.nextAction = playerAction;
		}
		else {
			player.actions.nextAction = action_none;
		}
	}

	fixPriority(player, a, priority) {
		if(player.actions.lastAction == a) {
			if(player.actions.lastActionFailed) { return 0; }
			else { return priority - 1; }
		}
		return priority;
	}


	actionEqualsLastAction(player, a) {
		return k;
	}
}
