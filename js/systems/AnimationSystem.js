class AnimationSystem extends System {

	constructor(config) {
		super([component_animation]);
		this.config = config;
	}

	init(engine) {
		this.animationCounter = 0;
		this.idleAnimationCounter = 0;
	}

	run(engine) {
		// for(let o of this.objects) {
		// 	if(o.animation.newAnimation) {
		// 		startAnimation(o);
		// 	}
		// }
		if(this.animationCounter == this.config.ANIMATION_SPEED) {
			this.animationCounter = 0;
			if(this.idleAnimationCounter == this.config.IDLE_ANIMATION_SLOW_FACTOR) {
				this.idleAnimationCounter = 0;
			}
			for(let o of this.objects) {
				o.animation.stage++;
				// console.log(o);
				if(o.animation.stage == o.animation.animations[o.animation.animation].length) {
					this.startIdleAnimation(o);
				}
				this.updateAnimation(o);
				// if((o.animation.nextAnimation == animation_idle && this.idleAnimationCounter == 0) || o.animation.nextAnimation != animation_idle) {
				// 	if(o.animation.stage == o.animation.animations[o.animation.animation].length) {
				// 		this.startAnimation(o, action_none);
				// 	}
				// }
			}
			this.idleAnimationCounter++;
		}
		this.animationCounter++;
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_new_animation:
				this.startAnimation(data);
				break;
		}
	}

	startIdleAnimation(entity) {
		entity.animation.animation = animation_idle;
		entity.animation.stage = 0;
		this.updateAnimation(entity);
	}

	updateAnimation(entity) {
		entity.animation.offsetX = entity.animation.animations[entity.animation.animation][entity.animation.stage].ox;
		entity.animation.offsetY = entity.animation.animations[entity.animation.animation][entity.animation.stage].oy;
		entity.animation.sprite = entity.animation.animations[entity.animation.animation][entity.animation.stage].sprite;
		// if(entity.animation.offsetX == undefined) {entity.animation.offsetX = 0;}
		// if(entity.animation.offsetY == undefined) {entity.animation.offsetY = 0;}
	}

	startAnimation(object) {
		object.animation.stage = 0;
		this.updateAnimation(object);
	}
}
