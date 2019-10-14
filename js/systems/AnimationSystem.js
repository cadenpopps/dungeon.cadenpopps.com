AnimationSystem.prototype = Object.create(System.prototype);
function AnimationSystem (CONFIG){
	System.call(this);

	this.componentRequirements = [component_animation];

	let animation_counter = 0;
	let idle_animation_counter = 0;

	this.run = function(engine){
		// for(let o of this.objects){
		// 	if(o.animation.newAnimation){
		// 		startAnimation(o);	
		// 	}
		// }
		if(animation_counter == CONFIG.ANIMATION_SPEED){
			animation_counter = 0;
			if(idle_animation_counter == CONFIG.IDLE_ANIMATION_SLOW_FACTOR){
				idle_animation_counter = 0;
			}
			for(let o of this.objects){
				o.animation.stage++;
				// console.log(o);
				if(o.animation.stage == o.animation.animations[o.animation.animation].length){
					startIdleAnimation(o);
				}
				updateAnimation(o);
				// if((o.animation.nextAnimation == animation_idle && idle_animation_counter == 0) || o.animation.nextAnimation != animation_idle){
				// 	if(o.animation.stage == o.animation.animations[o.animation.animation].length){
				// 		startAnimation(o, action_none); 
				// 	}
				// }
			}
			idle_animation_counter++;
		}
		animation_counter++;
	}

	let startIdleAnimation = function(entity){
		entity.animation.animation = animation_idle;
		entity.animation.stage = 0;
		updateAnimation(entity);
	}

	let updateAnimation = function(entity){
		entity.animation.offsetX = entity.animation.animations[entity.animation.animation][entity.animation.stage].ox;
		// if(entity.animation.offsetX == undefined){entity.animation.offsetX = 0;}
		entity.animation.offsetY = entity.animation.animations[entity.animation.animation][entity.animation.stage].oy;
		// if(entity.animation.offsetY == undefined){entity.animation.offsetY = 0;}
		entity.animation.sprite = entity.animation.animations[entity.animation.animation][entity.animation.stage].sprite;
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){
			case event_new_animation:
				startAnimation(data);
				break;
		}
	}

	let startAnimation = function(object){
		object.animation.stage = 0;
		updateAnimation(object);
	}
}
