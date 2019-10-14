HealthSystem.prototype = Object.create(System.prototype);
function HealthSystem (){
	System.call(this);

	this.componentRequirements = [component_health];

	this.run = function(engine){ 
		

	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){ 
			case event_entity_take_damage:
				applyDamage(engine, data.object, data.healthLost);
				break;
		}
	}

	let applyDamage = function(engine, object, healthLost){
		object.health.health -= healthLost;
		checkDead(engine, object);
	}

	let checkDead = function(engine, object){
		if(object.health.health <= 0){
			engine.removeObject(object);
		}
	}
}

