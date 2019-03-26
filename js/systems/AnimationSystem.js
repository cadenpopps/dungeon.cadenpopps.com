AnimationSystem.prototype = Object.create(System.prototype);
function AnimationSystem (){
	System.call(this);

	this.componentRequirements = [component_animation];
	this.acceptedEvents = [event_entity_moved, event_entity_sprinted, event_entity_rolled, event_entity_failed_roll];

	let animation_counter = 0;
	let idle_animation_counter = 0;

	this.run = function(engine){
		if(animation_counter == CONFIG.ANIMATION_SPEED){
			animation_counter = 0;
			if(idle_animation_counter == CONFIG.IDLE_ANIMATION_SLOW_FACTOR){
				idle_animation_counter = 0;
			}
			for(let o of this.objects){
				if((o.animation.animation == animation_idle && idle_animation_counter == 0) || o.animation.animation != animation_idle){
					if(o.animation.stage == o.animation.animations[o.animation.animation].length){
						startAnimation(o, action_none); 
					}
					updateAnimation(o);
					o.animation.stage++;
				}
			}
			idle_animation_counter++;
		}
		animation_counter++;
	}

	let startAnimation = function(entity, action){
		entity.animation.animation = action_to_animation[action];
		entity.animation.stage = 0;
		updateAnimation(entity);
	}

	let updateAnimation = function(entity){
		entity.animation.offsetX = entity.animation.animations[entity.animation.animation][entity.animation.stage].ox;
		if(entity.animation.offsetX == undefined){entity.animation.offsetX = 0;}
		entity.animation.offsetY = entity.animation.animations[entity.animation.animation][entity.animation.stage].oy;
		if(entity.animation.offsetY == undefined){entity.animation.offsetY = 0;}
		entity.animation.sprite = entity.animation.animations[entity.animation.animation][entity.animation.stage].sprite;
	}

	this.handleEvent = function(engine, e){
		if(this.acceptedEvents.includes(e.eventID)){
			switch(e.eventID){
				case event_entity_moved: case event_entity_sprinted: case event_entity_rolled: case event_entity_failed_roll:
					startAnimation(e.entity, e.direction);
					break;
			}
		}
	}
}
