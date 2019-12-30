class DisplaySystem extends System {

	constructor(config, images) {
		super([component_position, component_display]);
		this.config = config;
		this.textures = images.textures;
	}

	init(engine) {
		this.camera = {
			display: true,
			x: 0,
			y: 0,
			shakeOffsetX : 0,
			shakeOffsetY : 0,
			combat: false,
			sprinting: false,
			zoom: this.config.CAMERA_DEFAULT_ZOOM
		};

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

		// let st = millis();

		if(this.camera.display) {
			if(this.cameraMoving) {
				if(this.player.animation.animation == animation_idle) { this.cameraMoving = false; }
				this.centerCamera(this.camera, this.player.position, this.player.animation.offsetX, this.player.animation.offsetY);
			}
			canvas.translate(this.centerX + this.camera.shakeOffsetX, this.centerY + this.camera.shakeOffsetY);
			canvas.scale(this.camera.zoom, this.camera.zoom);
			this.drawTextures(this.objects);
			this.drawLights(this.objects);
			this.drawMobHealth(this.objects);
			canvas.setTransform();
		}

		// let et = millis() - st;
		// console.log("Time for draw loop: " + et);


		// canvas.translate(width/2, height/2);
		// canvas.rotate(45 * Math.PI / 180);
		// canvas.shadowBlur = 10;
		// canvas.shadowColor = 'black';
		// canvas.shadowOffsetX = 5;
		// canvas.setTransform();
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_begin_level: case event_player_moved:
				this.cameraMoving = true;
				this.camera.display = true;
				break;
			case event_up_level: case event_down_level:
				this.camera.display = false;
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
				engine.sendEvent(event_hitstun, { "ticks": 4 });
				break;
			case event_player_spin_attack:
				this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_SMALL);
				engine.sendEvent(event_hitstun, { "ticks": 2 });
				break;
			case event_player_take_damage:
				this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_MEDIUM);
				engine.sendEvent(event_hitstun, { "ticks": 6 });
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
			if(o instanceof Square && (o.display.visible || o.display.discovered)) {
				let bounds = this.getDrawBounds(o);
				if(this.onScreen(bounds, this.camera.zoom)) {
					this.drawTexture(o, bounds.x, bounds.y, bounds.w, bounds.h);
				}
			}
		}
		for(let o of objects) {
			if(!(o instanceof Square) && o.display.visible) {
				let bounds = this.getDrawBounds(o);
				if(this.onScreen(bounds, this.camera.zoom)) {
					this.drawTexture(o, bounds.x, bounds.y, bounds.w, bounds.h);
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
				fill(20);
				rect(x + (this.gridSize / 8) - 2, y + (this.gridSize / 8) - 2, w - (this.gridSize / 4) + 4, h - (this.gridSize / 4) + 4);
				if(o instanceof Player) {
					fill(0, 200, 230);
				}
				else{
					fill(200, 20, 40);
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
				if(o instanceof Torch) {
					fill(255, 230, 140, .7);
					ellipse(x, y, w, h);
				}
				else {
					fill(255, 100, 100);
					rect(x, y, w, h);
				}
			}
			else if(t.length > 1) {
				for(let i of t) {
					image(this.textures[i], x, y, w, h);
				}
			}
			else {
				image(this.textures[t], x, y, w, h);
			}
		}
	}

	drawLights(objects) {
		// let st = millis();
		for(let o of objects) {
			if(o.display.discovered && o.components.includes(component_light)) {
				this.lightSquare(o);
			}
		}
		// console.log(millis() - st);
	}

	lightSquare(o) {
		let bounds = this.getDrawBounds(o);
		if(o.display.visible) {
			if(o instanceof WallSquare || o instanceof DoorSquare) {
				canvas.fillStyle = light_level_to_light[2];
				rect(bounds.x, bounds.y, bounds.w, bounds.h);
				canvas.fillStyle = light_level_to_shadow[2];
				rect(bounds.x, bounds.y, bounds.w, bounds.h);
			}
			else {
				canvas.fillStyle = light_level_to_light[o.light.level];
				rect(bounds.x, bounds.y, bounds.w, bounds.h);
				canvas.fillStyle = light_level_to_shadow[o.light.level];
				rect(bounds.x, bounds.y, bounds.w, bounds.h);
			}
		}
		else {
			canvas.fillStyle = light_level_to_light[0];
			rect(bounds.x, bounds.y, bounds.w, bounds.h);
			canvas.fillStyle = light_level_to_shadow[0];
			rect(bounds.x, bounds.y, bounds.w, bounds.h);
			fill(0, 0, 0, .25);
			rect(bounds.x, bounds.y, bounds.w, bounds.h);
		}
	}

	drawMobHealth(objects) {
		const HEALTH_BAR_OFFSET = 3;
		const HEALTH_BAR_HEIGHT = 4;
		for(let mob of objects) {
			if(mob instanceof Mob && mob.components.includes(component_health) && mob.display.visible) {
				let bounds = this.getDrawBounds(mob);
				let x = bounds.x;
				let y = bounds.y;
				// let x = (this.gridSize * (this.camera.x - mob.position.x)) + this.camera.shakeOffsetX;
				// let y = (this.gridSize * (this.camera.y - mob.position.y)) + this.camera.shakeOffsetY;
				let xoff = this.gridSize * mob.animation.offsetX;
				let yoff = this.gridSize * mob.animation.offsetY;
				let healthBarWidth = mob.display.width * this.gridSize - (this.gridSize / 4);
				fill(40,0,0);
				rect(xoff + x + (this.gridSize / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
				healthBarWidth = healthBarWidth * HealthSystem.getHealthPercent(mob);
				fill(50, 220, 120);
				rect(xoff + x + (this.gridSize / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
			}
		}
	}

	getDrawBounds(object) {
		return {
			'x': this.gridSize * (object.position.x + object.display.offsetX - this.camera.x),
			'y': this.gridSize * (object.position.y + object.display.offsetY - this.camera.y),
			'w': object.display.width * this.gridSize,
			'h': object.display.height * this.gridSize
		};
	}

	onScreen(bounds, scale) {
		const border = max(bounds.w, bounds.h) + 10;
		const t = -(height / scale / 2) - border;
		const r = (width / scale / 2) + border;
		const b = (height / scale / 2) + border;
		const l = -(width / scale / 2) - border;
		return bounds.y > t && bounds.x + bounds.w < r && bounds.y + bounds.h < b && bounds.x > l;
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
		let w = document.documentElement.clientWidth;
		let h = document.documentElement.clientHeight;
		resizeCanvas(w, h);
		width = w;
		height = h;
		this.centerX = floor(w / 2);
		this.centerY = floor(h / 2);
	}
}
