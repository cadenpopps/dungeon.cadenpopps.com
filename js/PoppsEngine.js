function PoppsEngine(tickrate) {

	const TICKRATE = floor(1000/tickrate);

	let systems;

	this.init = function(systemsList){
		systems = systemsList;
		let dungeon = new Dungeon(this);
		setInterval(tick, TICKRATE);
	}

	let tick = function(){
		for(let s of systems){
			s.run();
		}
	}

	this.alertSystems = function(object){
		for(let s of systems){
			s.alert(object);
		}
	}
}

//let SQUARE_SIZE = 36;
//let PLAYER_VISION_RANGE = CONFIG.PLAYER_VISION_RANGE;
//const ACTIVE_MOB_RANGE = PLAYER_VISION_RANGE + 2;

//const ANIMATION_STAGES = CONFIG.ANIMATION_STAGES;

//let idleAnimationCounter = 0;
//let handleInputTimer = undefined;

//const dungeon = new Dungeon();
//const player = new Player([dungeon.currentStairUp().x, dungeon.currentStairUp().y]);
//dungeon.currentMobs()[getSquareCode(player.x - 2, player.y - 2)] = new Mob([player.x - 2, player.y - 2]);

//const dm = new DisplayManager(SQUARE_SIZE, PLAYER_VISION_RANGE, ANIMATION_STAGES);
//const am = new AudioManager();
//const im = new InputManager(dungeon, player);

//	let aLoop = function (code) {
//		switch(code){
//			case ACTION_STAIR_DOWN:
//				downLevel();
//				break;
//			case ACTION_STAIR_UP:
//				upLevel();
//				break;
//			case ACTION_ATTACK:
//				console.log("Attack");
//			default:
//				break;
//		}
//		idleAnimationCounter = CONFIG.IDLE_DELAY;
//		updateEntities();
//	}
//
//	this.activeLoop = function(code){
//		aLoop(code);
//	}
//
//	let iLoop = function () {
//		updateLevel();
//		updateAnimations();
//		idleUpdateEntities();
//	}
//
//	setInterval(() => {
//		iLoop();
//	}, CONFIG.IDLE_LOOP_SPEED);
//
//	this.display = function () {
//		dm._display(dungeon.currentBoard(), player, dungeon.currentMobs());
//	}
//
//	this.input = function(key, pressed){
//		if(pressed) im.down(key);
//		else im.up(key);
//	}
//
//	let updateEntities = function () {
//		player.update(dungeon.currentBoard(), dungeon.currentMobs());
//		let mobs = dungeon.currentMobs()
//		for (let m in mobs) {
//			let mob = mobs[m];
//			if(mob.alive){
//				if (!(mob instanceof Player) && abs(player.x - mob.x) < ACTIVE_MOB_RANGE && abs(player.y - mob.y) < ACTIVE_MOB_RANGE) {
//					mob.update(dungeon.currentBoard(), dungeon.currentMobs(), player);
//				}
//			}
//		}
//	}
//
//	let idleUpdateEntities = function () {
//		let mobs = dungeon.currentMobs()
//		for (let m in mobs) {
//			let mob = mobs[m];
//			if(mob.alive){
//			}
//			else if(!mob.alive && mob.deathCounter > 0){
//				mob.deathCounter--;
//			}
//			else{
//				delete mobs[m];
//			}
//		}
//	}
//
//
//	let updateLevel = function () {
//
//	}
//
//	let updateAnimations = function () {
//		mobs = dungeon.currentMobs();
//		for (let m in mobs) {
//			let mob = mobs[m];
//			if (player.x - mob.x < ACTIVE_MOB_RANGE && player.y - mob.y < ACTIVE_MOB_RANGE) {
//				mob.animate(idleAnimationCounter);
//			}
//		}
//		idleAnimationCounter++;
//		if (idleAnimationCounter >= CONFIG.IDLE_ANIMATION_SLOW_FACTOR) idleAnimationCounter = 0;
//	}
//
//	let downLevel = function () {
//        if (dungeon.currentLevelIndex < dungeon.levels.length - 1) {
//            dm.levelChange();
//            setTimeout(() => {
//                delete dungeon.currentMobs()[getSquareCode(player.x, player.y)];
//                dungeon.currentLevelIndex++;
//                player.x = dungeon.currentStairUp().x + 1;
//                player.y = dungeon.currentStairUp().y;
//                player.animation = RIGHT;
//                player.animationCounter = 0;
//                dungeon.currentMobs()[getSquareCode(player.x, player.y)] = player;
//            }, CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 2);
//            setTimeout(() => {
//                aLoop(true);
//            }, 3 * CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 4);
//        }
//        else {
//            dungeon.newLevel();
//            downLevel();
//        }
//    }
//
//    let upLevel = function () {
//        if (dungeon.currentLevelIndex > 0) {
//            dm.levelChange();
//            setTimeout(() => {
//                delete dungeon.currentMobs()[getSquareCode(player.x, player.y)];
//                dungeon.currentLevelIndex--;
//                player.x = dungeon.currentStairDown().x - 1;
//                player.y = dungeon.currentStairDown().y;
	//                player.animation = LEFT;
//                player.animationCounter = 0;
//                dungeon.currentMobs()[getSquareCode(player.x, player.y)] = player;
//            }, CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 2);
	//            setTimeout(() => {
//                aLoop(true);
//            }, 3 * CONFIG.LEVEL_CHANGE_ANIMATION_TIME / 4);
//        }
//    }
//
	//    let _init = (function () {
//        aLoop();
//    }());
