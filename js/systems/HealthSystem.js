class HealthSystem extends System {

	constructor(config) {
		super([component_health]);

		this.config = config;

		this.healthRegenCounter = 0;
		this.healthRegen = true;
	}

	run(engine) { 
		if(this.healthRegen) {
			if(this.healthRegenCounter % this.config.HEALTH_REGEN_TIMER == 0) {	
				for(let o of this.objects) {
					if(o.health.health < o.health.maxHealth) {
						o.health.health++;
					}
				}
				this.healthRegenCounter = 1;
			}
			this.healthRegenCounter++;
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) { 
			case event_entity_take_damage:
				if(data.object instanceof Player) { engine.sendEvent(event_player_take_damage); }
				this.applyDamage(engine, data.object, data.healthLost);
				console.log(data.object);
				break;
			case event_begin_combat:
				this.healthRegen = false;
				break;
			case event_end_combat:
				this.healthRegen = true;
				break;
		}
	}

	applyDamage(engine, object, healthLost) {
		object.health.health -= healthLost;
		this.checkDead(engine, object);
	}

	checkDead(engine, object) {
		if(object.health.health <= 0) {
			engine.removeObject(object);
			if(object instanceof Player) {
				engine.sendEvent(event_game_over);
			}
		}
	}
}

