class InputSystem extends System {

	constructor() {
		super([]);
		this.mobSpawnCooldown = 0;
	}

	run(engine) {
		if(keys.includes('n') && this.mobSpawnCooldown <= 0) {
			this.mobSpawnCooldown = 10;
			engine.sendEvent(event_spawn_enemy_close, engine.getPlayer());
		}

		if(this.mobSpawnCooldown > 0) {
			this.mobSpawnCooldown--;
		}

		engine.getPlayer().actions.nextAction = this.determineAction(engine.getPlayer());
	}

	addObject(object) { }

	determineAction(player) {
		let action = action_none;

		if(keys.length > 0) {
			let highestPriority = 0;
			for(let k of keys) {
				let a = key_to_action[k];
				let priority = action_to_priority[a];
				priority = this.fixPriority(player, a, priority);
				if(priority > highestPriority) {
					action = a;
					highestPriority = priority;
				}
			}
		}

		return action;
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
