function PoppsEngine(tickrate, config) {

	const TICKRATE = floor(1000/tickrate);

	this.systems = [];

	this.init = function(){
		this.systems.push(new InputSystem());
		this.systems.push(new DisplaySystem());
		this.systems.push(new VisionSystem());
		this.systems.push(new ActionSystem());
		this.systems.push(new MovementSystem());
		this.systems.push(new LevelSystem());
		this.systems.push(new EntitySystem());
		this.systems.push(new AnimationSystem());

		this.sendCommand({commandID:command_init});
		this.sendEvent({eventID:event_game_start});

		setInterval(tick.bind(this), TICKRATE);
	};

	let tick = function(){
		for(let s of this.systems){
			s.run(this);
		}
	}

	this.updateObjects = function(object){
		for(let s of this.systems){
			s.updateObjects(object);
		}
	}

	this.sendEvent = function(e){
		for(let s of this.systems){
			s.handleEvent(this, e);
		}
	}

	this.sendCommand = function(c){
		for(let s of this.systems){
			s.handleCommand(this, c);
		}
	}

	this.clearObjects = function(){
		for(let s of this.systems){
			System.prototype.clearObjects.call(s);
		}
	}

	this.init();
}
