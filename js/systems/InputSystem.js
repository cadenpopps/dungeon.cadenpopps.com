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
				let priority = action_priority[a];
				if(player.actions.lastAction == a) priority-=.1;
				if(priority > highestPriority){
					if(player.actions.cooldowns[a] == 0){
						action = a;
						highestPriority = priority;
					}
				}
			}
		}
		return action;
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

	let decreasePlayerSprint = function(player){
		// player.sprint.moveCounter--;
		// player.sprint.sprinting = false;
		// if(player.sprint.moveCounter == 0){
		// 	cancelSprintTimeout = undefined;
		// }
		// else{
		// 	cancelSprintTimeout = setTimeout(function(){
		// 		decreasePlayerSprint(player);
		// 	}, CONFIG.PLAYER_SPRINT_REDUCTION_SPEED);
		// }
	}

	this.addObject = function(object){
		if(object instanceof Player) {
			player = object;
		}
	}
}

