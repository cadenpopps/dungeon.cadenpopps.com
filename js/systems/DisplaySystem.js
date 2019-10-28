class DisplaySystem extends System {

	constructor(config, images) {
		super([component_position, component_display]);

		this.config = config;
		this.textures = images.TEXTURES;
		this.ui = images.UI;

		this.camera = {
			x: 0,
			y: 0,
			shakeOffsetX : 0,
			shakeOffsetY : 0,
			combat: false,
			sprinting: false,
			zoom: this.config.CAMERA_DEFAULT_ZOOM
		}

		this.player;

		this.cameraZoomTimer = undefined;
		this.cameraShakeTimer = undefined;
		this.cameraMoving = false;

		this.lightOffset = 0;
		this.lightOffsetScale = .02;
		this.lightOffsetSpeed = 600;

		this.centerX = floor(width / 2);
		this.centerY = floor(height / 2);

		this.gridSize = this.config.GRID_SIZE;
		this.halfGridSize = this.gridSize / 2;
	}

	run(engine) {
		background(0);
		this.drawTextures(this.objects); 
		this.drawLights(this.objects);
		this.drawHealth(this.objects);
		if(this.cameraMoving) {
			if(this.player.animation.animation == animation_idle) { this.cameraMoving = false; }
			this.centerCamera(this.camera, this.player.position, this.player.animation.offsetX, this.player.animation.offsetY); 
		}

		// canvas.translate(width/2, height/2);
		// canvas.rotate(45 * Math.PI / 180);
		// fill(255, 0, 0);
		// rect(0, 0, 200, 200);
		// canvas.setTransform();
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_start_game:
				this.centerCamera(this.camera, this.player.position);
				break;
			case event_up_level: case event_down_level: case event_player_moved:
				this.cameraMoving = true;
				break;
			case event_window_resized:
				this.resize();
				break;
			case event_begin_combat:
				this.camera.combat = true;
				this.decideCameraZoomState(this.camera);
				break;
			case event_end_combat:
				this.camera.combat = false;
				this.decideCameraZoomState(this.camera);
				break;
			case event_player_start_sprinting:
				this.camera.sprinting = true;
				this.decideCameraZoomState(this.camera);
				break;
			case event_player_stop_sprinting:
				this.camera.sprinting = false;
				this.decideCameraZoomState(this.camera);
				break;
			case event_player_melee_attack:
				this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_MEDIUM_SMALL);
				break;
			case event_player_spin_attack:
				this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_SMALL);
				break;
			case event_player_take_damage:
				this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_SMALL);
				break;
		}
	}

	addObject(object) {
		if(object instanceof Player) {
			this.player = object;
		}
		super.addObject(object);
	}

	drawTextures(objects) {
		for(let o of objects) {
			if(o.display.visible || o.display.discovered > 0) {
				let x = this.centerX - (this.camera.zoom * (this.gridSize * (this.camera.x - o.position.x))) + this.camera.shakeOffsetX;
				let y = this.centerY - (this.camera.zoom * (this.gridSize * (this.camera.y - o.position.y))) + this.camera.shakeOffsetY;
				let w = o.display.width * this.gridSize * this.camera.zoom;
				let h = o.display.height * this.gridSize * this.camera.zoom;
				if(Utility.positionOnScreen(x, y, w, h)) {
					this.drawTexture(o, x, y, w, h); 
				}
			}
		}
	}

	drawTexture(o, x, y, w, h) {
		if(o.components.includes(component_animation)) {
			x += this.gridSize * o.animation.offsetX;
			y += this.gridSize * o.animation.offsetY;
			let s = o.animation.sprite;
			if(s == undefined) {
				if(o instanceof Player) {
					fill(255);
				}
				else{
					fill(255, 150, 100);
				}
				rect(x + (this.gridSize / 8), y + (this.gridSize / 8), w - (this.gridSize / 4), h - (this.gridSize / 4));
			}
			else{
				image(a, x, y, w, h);
			}
		}
		else {
			let t = o.display.texture;
			if(t == undefined) {
				fill(255, 100, 100);
				rect(x, y, w, h);
			}
			else if(t.length > 1) {
				for(let i of t) {
					image(this.textures[i], x, y, w, h);
				}
			}
			else {
				image(this.textures[t], x, y, w, h);
			}
			if(!o.display.visible && o.display.discovered > 0) {
				fill(5, 10, 0, .2);
				rect(x, y, w, h);
			}
		}
	}

	drawLights(objects) {
		// let st = millis();
		let lightFill = light_fill_string + light_intensity + ")";
		for(let o of objects) {
			if(o.display.discovered && o.components.includes(component_light)) {
				canvas.fillStyle = lightFill;
				this.lightSquare(o);
			}
		}
		// console.log(millis() - st);
	}

	lightSquare(o) {
		let x = this.centerX - (this.camera.zoom * (this.gridSize * (this.camera.x - o.position.x))) + this.camera.shakeOffsetX;
		let y = this.centerY - (this.camera.zoom * (this.gridSize * (this.camera.y - o.position.y))) + this.camera.shakeOffsetY;
		let w = o.display.width * this.gridSize * this.camera.zoom;
		let h = o.display.height * this.gridSize * this.camera.zoom;

		rect(x, y, w, h);
		canvas.fillStyle = light_level_to_shadow[o.light.lightLevel];
		// fill(shadow_red, shadow_green, shadow_blue, constrainHigh(shadow_intensity * (light_max - o.light.lightLevel), shadow_max));
		// console.log(shadow_intensity * (light_max - o.light.lightLevel));
		rect(x, y, w, h);
	}

	drawHealth(objects) {
		for(let o of objects) {
			if(o.components.includes(component_health) && (o.display.visible || o.display.discovered > 0)) {
				let x = this.centerX - (this.camera.zoom * (this.gridSize * (this.camera.x - o.position.x))) + this.camera.shakeOffsetX;
				let y = this.centerY - (this.camera.zoom * (this.gridSize * (this.camera.y - o.position.y))) + this.camera.shakeOffsetY;
				let healthBarWidth = o.display.width * this.gridSize * this.camera.zoom;
				if(o instanceof Player) {
					this.drawPlayerHealth(o);
				}
				else {
					this.drawMobHealth(o, x, y, healthBarWidth);
				}
			}
		}
	}

	drawPlayerHealth(player) {
		const HEART_SIZE = 30;
		const HEART_SPACING = 5;
		const HEART_OFFSET = 20;
		let x = 0, y = 0;
		for(let i = 1; i <= this.player.health.maxHealth; i++) {
			if(i <= player.health.health) { 
				image(this.UI[HEART], (x * HEART_SIZE) + (x * HEART_SPACING) + HEART_OFFSET, (y * HEART_SIZE) + HEART_OFFSET, HEART_SIZE, HEART_SIZE);
			}
			else { 
				image(this.UI[EMPTY_HEART], (x * HEART_SIZE) + (x * HEART_SPACING) + HEART_OFFSET, (y * HEART_SIZE) + HEART_OFFSET, HEART_SIZE, HEART_SIZE);
			}
			x++;
			if(i % 15 == 0) {
				y++;
				x = 0;
			}
		}
	}

	drawMobHealth(mob, x, y, healthBarWidth) {
		const HEALTH_BAR_OFFSET = 3;
		const HEALTH_BAR_HEIGHT = 4;
		const xoff = this.gridSize * mob.animation.offsetX;
		const yoff = this.gridSize * mob.animation.offsetY;
		healthBarWidth = healthBarWidth - (this.gridSize / 4);
		fill(40,0,0);
		rect(xoff + x + (this.gridSize / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
		healthBarWidth = healthBarWidth * Utility.getHealthPercent(mob);
		fill(50, 220, 120);
		rect(xoff + x + (this.gridSize / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
	}

	centerCamera(camera, position, offsetX = 0, offsetY = 0) {
		camera.x = position.x + offsetX;
		camera.y = position.y + offsetY;
		//if(entity.position.x > camera.x) {
		//	camera.x = floor(camera.x * 40 + 1) / 40;
		//	cameraMoveTimer = setTimeout(function() {moveCamera(camera, entity, direction)}, this.config.CAMERA_MOVE_SPEED);
		//}
		//else{
		//	clearTimeout(cameraMoveTimer);
		//}
	}

	decideCameraZoomState(camera) {
		if(camera.combat) {
			if(camera.sprinting) {
				this.changeZoom(camera, this.config.CAMERA_ZOOM_STEPS_SLOW, this.config.CAMERA_COMBAT_ZOOM);
			}
			else {
				this.changeZoom(camera, this.config.CAMERA_ZOOM_STEPS_MEDIUM, this.config.CAMERA_COMBAT_ZOOM);
			}
		}
		else if(camera.sprinting) {
			this.changeZoom(camera, this.config.CAMERA_ZOOM_STEPS_MEDIUM, this.config.CAMERA_SPRINT_ZOOM);
		}
		else {
			this.changeZoom(camera, this.config.CAMERA_ZOOM_STEPS_MEDIUM, this.config.CAMERA_DEFAULT_ZOOM);
		}
	}

	changeZoom(camera, steps, zoom) {
		if(camera.zoom != zoom) {
			clearTimeout(this.cameraZoomTimer);
			this.recursiveZoom(camera, this.config.CAMERA_ZOOM_SPEED, zoom, (zoom - camera.zoom) / steps);
		}
	}

	recursiveZoom(camera, speed, zoom, dif) { 
		let self = this;
		if(dif <= 0 && zoom - camera.zoom >= 0) { 
			camera.zoom = zoom;
			return;
		}
		else if(dif > 0 && zoom - camera.zoom <= 0) { 
			camera.zoom = zoom;
			return;
		}
		else {
			camera.zoom += dif;
			this.cameraZoomTimer = setTimeout(function() { self.recursiveZoom(camera, speed, zoom, dif); }, speed);
		}
	}

	shakeCamera(camera, shakeAmount) {
		let self = this;
		clearTimeout(this.cameraShakeTimer);
		if(shakeAmount > 0) {
			camera.shakeOffestX = ((shakeAmount % 2 == 0) ? -1 : 1) * (randomInt(0, shakeAmount * this.config.CAMERA_SHAKE_MULTIPLIER) + this.config.CAMERA_SHAKE_CONSTANT);
			camera.shakeOffsetY = random(-1, 1) * this.config.CAMERA_SHAKE_CONSTANT / 2 * shakeAmount;
			this.cameraShakeTimer = setTimeout(function() { self.shakeCamera(camera, shakeAmount - 1); }, this.config.CAMERA_SHAKE_SPEED);
		}
		else{
			camera.shakeOffsetX = 0;
			camera.shakeOffsetY = 0;
			this.cameraShakeTimer = undefined;
		}
	}

	resize() {
		resizeCanvas(window.innerWidth, window.innerHeight);
		this.centerX = floor(width / 2);
		this.centerY = floor(height / 2);
	}
}
