InputSystem.prototype = Object.create(System.prototype);
function InputSystem(){
	System.call(this);

	let player;
	let cancelSprintTimeout = undefined;

	this.run = function(engine){
		let action = determineAction();
		assignPlayerAction(player, action);		
	}

	let determineAction = function(){
		let action = action_none;

		if(keys.length > 0){
			let highestPriority = 0;
			for(let k of keys){
				let a = key_to_action[k];
				if(a == action_melee_attack_front){ a += player.direction.direction + 1; }
				let priority = action_priority[a];
				if(actionEqualsLastAction(player, a)) {
					priority -= .1;
				}
				if(priority > highestPriority){
					action = a;
					highestPriority = priority;
				}
			}
		}
		return action;
	}

	let actionEqualsLastAction = function(player, a){
		let failed = Utility.isSprintAction(player.actions.failedAction) ? sprint_to_movement[player.actions.failedAction] : player.actions.failedAction;
		let last = Utility.isSprintAction(player.actions.lastAction) ? sprint_to_movement[player.actions.lastAction] : player.actions.lastAction;

		return failed == a || last == a;
	}

	let assignPlayerAction = function(player, action){
		// if(cancelSprintTimeout == undefined && player.sprint.moveCounter > 0 && action != action_roll && action != action_move_up && action != action_move_right && action != action_move_down && action != action_move_left){
		// 	cancelSprintTimeout = setTimeout(function(){
		// 		decreasePlayerSprint(player);
		// 	}, CONFIG.PLAYER_SPRINT_REDUCTION_SPEED);
		// }
		// else if(cancelSprintTimeout != undefined && (action == action_roll || action == action_move_up || action == action_move_right || action == action_move_down || action == action_move_left)){
		// 	clearTimeout(cancelSprintTimeout);
		// 	cancelSprintTimeout = undefined;
		// }
		player.actions.nextAction = action;	
	}

	this.addObject = function(object){
		if(object instanceof Player) {
			player = object;
		}
	}
}

