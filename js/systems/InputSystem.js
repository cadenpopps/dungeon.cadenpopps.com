InputSystem.prototype = Object.create(System.prototype);
function InputSystem(){
	System.call(this);

	let player;
	let cancelSprintTimeout = undefined;

	this.run = function(engine){
		let action = determineAction();
		assignPlayerAction(engine, player, action);		
	}

	let determineAction = function(){
		let action = action_none;
		if(keys.length > 0){
			let highestPriority = 0;
			for(let k of keys){
				let a = key_to_action[k];
				let priority = action_priority[a];
				if(player.actions.lastAction == a) priority -= .1;
				if(priority > highestPriority){
					let skip = false;
					for(let c of player.actions.cooldowns){
						if(c.action == a){
							skip = true;
							break;
						}
					}
					if(!skip){
						action = a;
						highestPriority = priority;
					}
				}
			}
		}
		return action;
	}

	let assignPlayerAction = function(engine, player, action){
		if(cancelSprintTimeout == undefined && player.sprint.moveCounter > 0 && action != action_roll && action != action_move_up && action != action_move_right && action != action_move_down && action != action_move_left){
			cancelSprintTimeout = setTimeout(function(){
				decreasePlayerSprint(player);
			}, CONFIG.PLAYER_SPRINT_REDUCTION_SPEED);
		}
		else if(cancelSprintTimeout != undefined && (action == action_roll || action == action_move_up || action == action_move_right || action == action_move_down || action == action_move_left)){
			clearTimeout(cancelSprintTimeout);
			cancelSprintTimeout = undefined;
		}
		player.actions.nextAction = action;	
	}

	let decreasePlayerSprint = function(player){
		player.sprint.moveCounter--;
		player.sprint.sprinting = false;
		if(player.sprint.moveCounter == 0){
			cancelSprintTimeout = undefined;
		}
		else{
			cancelSprintTimeout = setTimeout(function(){
				decreasePlayerSprint(player);
			}, CONFIG.PLAYER_SPRINT_REDUCTION_SPEED);
		}
	}

	this.updateObjects = function(obj){
		if(obj instanceof Player) player = obj;
	}
}

//		let returnCode = 0;
//		let actionSpeed = NORMAL_ACTION;
//		if (inputs.length > 0) {
//			switch (inputs[0]) {
//				case 'e':
//					returnCode = player.attack(dungeon.currentBoard(), dungeon.currentMobs());
//					break;
//				default:
//					console.log("Invalid input");
//					break;
//			}
//			if(returnCode != ACTION_FAIL){
//				if(shift) inputs.splice(0, 1);
//				else{
//					let newEnd = inputs.splice(0, 1)[0];
//					inputs.push(newEnd);
//				}
//				actionSpeed = SLOW_ACTION;
//			}
//		}
//		if(returnCode == 0 && moveInputs.length > 0){
//			switch (moveInputs[0]) {
//				case 'w':
//					returnCode = player.move(UP, dungeon.currentBoard(), dungeon.currentMobs());
//					break;
//				case 'd':
//					returnCode = player.move(RIGHT, dungeon.currentBoard(), dungeon.currentMobs());
//					break;
//				case 's':
//					returnCode = player.move(DOWN, dungeon.currentBoard(), dungeon.currentMobs());
//					break;
//				case 'a':
//					returnCode = player.move(LEFT, dungeon.currentBoard(), dungeon.currentMobs());
//					break;
//				default:
//					console.log("Invalid input");
//					break;
//			}
//			if(moveInputs.length > 1) {
			//				let newEnd = moveInputs.splice(0, 1)[0];
			//				moveInputs.push(newEnd);
			//			}
			//			if (returnCode != ACTION_FAIL) {
			//				actionSpeed = FAST_ACTION;
			//			}
			//			else if (returnCode == ACTION_FAIL && moveInputs.length > 1) {
			//				actionSpeed = IMMEDIATE_ACTION;
			//			}
			//		}
			//		if (returnCode != ACTION_FAIL) {
			//			//decreaseMoveDelay();
			//			gm.activeLoop(returnCode);
			//		}
			//
			//		if(inputs.length == 0 && moveInputs.length == 0) stopInputLoop();
			//		else nextInputLoop(actionSpeed);
// let inputs = [];
// let moveInputs = [];
// let shift = false;

// let inputLooping = false;
// let inputTimer= undefined;

// var VALID_INPUTS = ['e'];
// var VALID_MOVE_INPUTS = ['w', 'a', 's', 'd'];

// this.down = function(key){
// 	if(VALID_INPUTS.includes(key) && inputs.length < 1){
// 		inputs.unshift(key);
// 		if (!inputLooping) {
// 			startInputLoop();
// 		}
// 	}
// 	else if(VALID_MOVE_INPUTS.includes(key) && moveInputs.length < 3 && !moveInputs.includes(key)){
// 		moveInputs.unshift(key);
// 		if (!inputLooping) {
// 			startInputLoop();
// 		}
// 	}
// 	else if(keycode == 16) shift = true;

// }

// this.up = function(key){
// 	if(inputs.includes(key)) inputs.splice(inputs.indexOf(key), 1);
// 	else if(moveInputs.includes(key)) moveInputs.splice(moveInputs.indexOf(key), 1);
// 	else if(keycode == 16) shift = false;
// }

// this.clearInputs = function () {
// 	inputs = [];
// 	moveInputs = [];
// 	shift = false;
// 	resetMoveDelay();
// 	clearTimeout(inputTimer);
// 	inputTimer = undefined;
// }

// let startInputLoop = function(){
// 	inputLooping = true;
// 	handleInputs();
// }

// let nextInputLoop = function(speed){
// 	if(speed == IMMEDIATE_ACTION){
// 		setTimeout(handleInputs, 3);
// 	}
// 	else if(shift){
// 		if(speed <= NORMAL_ACTION) setTimeout(handleInputs, CONFIG.INPUT_DELAY_NORMAL);
// 		else setTimeout(handleInputs, CONFIG.INPUT_DELAY_SPRINT);
// 	}
// 	else{
// 		if(speed == SLOW_ACTION) setTimeout(handleInputs, CONFIG.INPUT_DELAY_SLOW);
// 		else if(speed == NORMAL_ACTION) setTimeout(handleInputs, CONFIG.INPUT_DELAY);
// 		else setTimeout(handleInputs, CONFIG.INPUT_DELAY_FAST);
// 	}
// }

// let stopInputLoop = function(){
// 	clearTimeout(inputTimer);
// 	inputTimer= undefined;
// 	inputLooping = false;
// }

// //let resetMoveDelay = function () {
// //	player.currentMoveDelay = CONFIG.MAX_MOVE_DELAY;
// //}

// //let decreaseMoveDelay = function () {
// //	if (player.currentMoveDelay != CONFIG.MIN_MOVE_DELAY) {
// //		player.currentMoveDelay = floor(constrainLow(player.currentMoveDelay * CONFIG.MOVE_DELAY_DECREASE, CONFIG.MIN_MOVE_DELAY));
// //	}
// //}

// let handleInputs = function () {
// 	let returnCode = 0;
// 	let actionSpeed = NORMAL_ACTION;
// 	if (inputs.length > 0) {
// 		switch (inputs[0]) {
// 			case 'e':
// 				returnCode = player.attack(dungeon.currentBoard(), dungeon.currentMobs());
// 				break;
// 			default:
// 				console.log("Invalid input");
// 				break;
// 		}
// 		if(returnCode != ACTION_FAIL){
// 			if(shift) inputs.splice(0, 1);
// 			else{
// 				let newEnd = inputs.splice(0, 1)[0];
// 				inputs.push(newEnd);
// 			}
// 			actionSpeed = SLOW_ACTION;
// 		}
// 	}
// 	if(returnCode == 0 && moveInputs.length > 0){
// 		switch (moveInputs[0]) {
// 			case 'w':
// 				returnCode = player.move(UP, dungeon.currentBoard(), dungeon.currentMobs());
// 				break;
// 			case 'd':
// 				returnCode = player.move(RIGHT, dungeon.currentBoard(), dungeon.currentMobs());
// 				break;
// 			case 's':
// 				returnCode = player.move(DOWN, dungeon.currentBoard(), dungeon.currentMobs());
// 				break;
// 			case 'a':
// 				returnCode = player.move(LEFT, dungeon.currentBoard(), dungeon.currentMobs());
// 				break;
// 			default:
// 				console.log("Invalid input");
// 				break;
// 		}
// 		if(moveInputs.length > 1) {
// 			let newEnd = moveInputs.splice(0, 1)[0];
// 			moveInputs.push(newEnd);
// 		}
// 		if (returnCode != ACTION_FAIL) {
// 			actionSpeed = FAST_ACTION;
// 		}
// 		else if (returnCode == ACTION_FAIL && moveInputs.length > 1) {
// 			actionSpeed = IMMEDIATE_ACTION;
// 		}
// 	}
// 	if (returnCode != ACTION_FAIL) {
// 		//decreaseMoveDelay();
// 		gm.activeLoop(returnCode);
// 	}

// 	if(inputs.length == 0 && moveInputs.length == 0) stopInputLoop();
// 	else nextInputLoop(actionSpeed);
// }
