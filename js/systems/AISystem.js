AISystem.prototype = Object.create(System.prototype);
function AISystem (){
	System.call(this);

	this.componentRequirements = [component_ai];
	let player;

	this.run = function(engine){
		for(let entity of this.objects){
			if(Utility.entityWithinRange(player, entity, entity_active_range)){
				entity.actions.nextAction = determineAction(entity, player);
			}
		}
	}

	let determineAction = function(entity, player){
		if(Utility.entityDistance(entity, player) < entity.ai.maxRange){
			return getAttackAction(entity, player);
		}
		else{
			return getMoveCloserAction(entity, player);
		}
	}

	let getAttackAction = function(entity, player){
		let dir = Utility.getDirectionToEntity(entity, player);
		entity.direction.direction = dir;
		return direction_to_attack[dir];	
	}

	let getMoveCloserAction = function(entity, player){
		return direction_to_movement[Utility.getDirectionToEntity(entity, player)];	
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){ }
	}

	this.addObject = function(object){
		if(object instanceof Player){ player = object; }
		else{ System.prototype.addObject.call(this, object); }
	}
}
