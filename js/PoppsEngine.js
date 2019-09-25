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

		$(window).resize(this.sendEvent.bind(this, event_window_resized));
		window.Utility = new Utility();

		this.sendEvent(event_new_game);
		this.sendEvent(event_start_game);

		setInterval(tick.bind(this), TICKRATE);
	};

	let tick = function(){
		for(let s of this.systems){
			s.run(this);
		}
	}

	this.sendEvent = function(e){
		for(let s of this.systems){
			s.handleEvent(this, e);
		}
	}

	this.addObject = function(object){
		for(let s of this.systems){
			s.addObject(object);
		}
	}

	this.clearObjects = function(){
		for(let s of this.systems){
			System.prototype.clearObjects.call(s);
		}
	}

	this.init();
}
