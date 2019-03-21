
EntitySystem.prototype = Object.create(System.prototype);
function EntitySystem (){
	System.call(this);

	this.acceptedEvents = [];
	this.acceptedCommands = [command_generate_player];

	this.run = function(engine){
	}

	this.handleEvent = function(e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
			}
		}
	}

	this.handleCommand = function(engine, c){
		if(this.acceptedCommands.includes(c.commandID)){
			switch(c.commandID){
				case command_generate_player:
					generatePlayer(engine, c.x, c.y);
					break;
			}
		}
	}

	let generatePlayer = function(engine, x, y){
		engine.updateObjects(new Player(x, y, 10, 3, 3, 3));
	}
}
