HealthSystem.prototype = Object.create(System.prototype);
function HealthSystem (){
	System.call(this);

	this.componentRequirements = [component_health];

	const HEALTH_REGEN_TIMER = 50;

	let healthRegenCounter = 0;
	let healthRegen = true;

	this.run = function(engine){ 
		if(healthRegen){
			if(healthRegenCounter % HEALTH_REGEN_TIMER == 0){	
				for(let o of this.objects){
					if(o.health.health < o.health.maxHealth){
						o.health.health++;
					}
				}
				heatlhRegenCounter = 1;
			}
			healthRegenCounter++;
		}
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){ 
			case event_entity_take_damage:
				applyDamage(engine, data.object, data.healthLost);
				break;
			case event_begin_combat:
				healthRegen = false;
				break;
			case event_end_combat:
				healthRegen = true;
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

