DisplaySystem.prototype = Object.create(System.prototype);
function DisplaySystem(DISPLAY_SETTINGS, VISION_SETTINGS, TEXTURES) {
	System.call(this);

	this.componentRequirements = [component_position, component_display];

	let camera = {
		x: 0,
		y: 0,
		shakeOffsetX : 0,
		shakeOffsetY : 0,
		zoom: DISPLAY_SETTINGS.CAMERA_DEFAULT_ZOOM
	}

	let player;

	let cameraZoomTimer = undefined;
	let cameraShakeTimer = undefined;
	let cameraMoving = false;

	let lightOffset = 0, lightOffsetScale = .02, lightOffsetSpeed = 600;

	let CENTER_X = floor(width / 2);
	let CENTER_Y = floor(height / 2);

	let HEART_SIZE = 28;
	let HEART_SPACING = 4;
	let HEART_OFFSET = 20;

	let HEALTH_BAR_OFFSET = 3;
	let HEALTH_BAR_HEIGHT = 4;

	let GRID_SIZE = 32;
	let HALF_GRID_SIZE = GRID_SIZE / 2;

	this.run = function(engine) {
		background(0);
		// lightOffset = osc(millis() / lightOffsetSpeed, 0, lightOffsetScale);
		drawTextures(this.objects); 
		drawLights(this.objects);
		drawHealth(this.objects);
		if(cameraMoving){
			if(player.animation.animation == animation_idle){ cameraMoving = false; }
			centerCamera(camera, player.position, player.animation.offsetX, player.animation.offsetY); 
		}

		// canvas.translate(width/2, height/2);
		// canvas.rotate(45 * Math.PI / 180);
		// fill(255, 0, 0);
		// rect(0, 0, 200, 200);
		// canvas.setTransform();
	}

	let drawTextures = function(objects){
		for(let o of objects){
			if(o.display.visible || o.display.discovered > 0){
				let x = CENTER_X - camera.zoom * (GRID_SIZE * (camera.x + camera.shakeOffsetX - o.position.x));
				let y = CENTER_Y - camera.zoom * (GRID_SIZE * (camera.y + camera.shakeOffsetY - o.position.y));
				let w = o.display.width * GRID_SIZE * camera.zoom;
				let h = o.display.height * GRID_SIZE * camera.zoom;
				if(Utility.positionOnScreen(x, y, w, h)){
					drawTexture(o, x, y, w, h); 
				}
			}
		}
	}

	let drawTexture = function(o, x, y, w, h){
		if(o.components.includes(component_animation)){
			x += GRID_SIZE * o.animation.offsetX;
			y += GRID_SIZE * o.animation.offsetY;
			let s = o.animation.sprite;
			if(s == undefined){
				if(o instanceof Player){
					fill(255);
				}
				else{
					fill(255, 150, 100);
				}
				rect(x + (GRID_SIZE / 8), y+ (GRID_SIZE / 8), w - (GRID_SIZE / 4), h - (GRID_SIZE / 4));
			}
			else{
				image(a, x, y, w, h);
			}
		}
		else{
			let t = o.display.texture;
			if(t == undefined){
				fill(255, 100, 100);
				rect(x, y, w, h);
			}
			else{
				image(t, x, y, w, h);
			}
			if(!o.display.visible && o.display.discovered > 0){
				// let opacity = min(1, 1 - (o.display.discovered/VISION_SETTINGS.DISCOVERED_MAX) + .2);
				fill(5, 10, 0, .2);
				rect(x, y, w, h);
			}
		}
	}

	let drawLights = function(objects){
		// let st = millis();
		let lightFill = light_fill_string + (lightOffset + light_intensity) + ")";
		for(let o of objects){
			if(o.display.discovered && o.components.includes(component_light)){
				canvas.fillStyle = lightFill;
				lightSquare(o);
			}
		}
		// console.log(millis() - st);
	}

	let lightSquare = function(o) {
		let x = CENTER_X - camera.zoom * (GRID_SIZE * (camera.x + camera.shakeOffsetX - o.position.x));
		let y = CENTER_Y - camera.zoom * (GRID_SIZE * (camera.y + camera.shakeOffsetY - o.position.y));
		let w = o.display.width * GRID_SIZE * camera.zoom;
		let h = o.display.height * GRID_SIZE * camera.zoom;

		rect(x, y, w, h);
		canvas.fillStyle = light_level_to_shadow[o.light.lightLevel];
		// fill(shadow_red, shadow_green, shadow_blue, constrainHigh(shadow_intensity * (light_max - o.light.lightLevel), shadow_max));
		// console.log(shadow_intensity * (light_max - o.light.lightLevel));
		rect(x, y, w, h);
	}

	let drawHealth = function(objects){
		for(let o of objects){
			if(o.components.includes(component_health) && (o.display.visible || o.display.discovered > 0)) {
				let x = CENTER_X - camera.zoom * (GRID_SIZE * (camera.x + camera.shakeOffsetX - o.position.x));
				let y = CENTER_Y - camera.zoom * (GRID_SIZE * (camera.y + camera.shakeOffsetY - o.position.y));
				let healthBarWidth = o.display.width * GRID_SIZE * camera.zoom;
				if(o instanceof Player) {
					drawPlayerHealth(o);
				}
				else {
					drawMobHealth(o, x, y, healthBarWidth);
				}
			}
		}
	}

	let drawPlayerHealth = function(player){
		let x = 0, y = 0;
		for(let i = 1; i <= player.health.maxHealth; i++){
			if(i <= player.health.health) { 
				image(TEXTURES.UI[HEART], (x * HEART_SIZE) + (x * HEART_SPACING) + HEART_OFFSET, (y * HEART_SIZE) + HEART_OFFSET, HEART_SIZE, HEART_SIZE);
			}
			else { 
				image(TEXTURES.UI[EMPTY_HEART], (x * HEART_SIZE) + (x * HEART_SPACING) + HEART_OFFSET, (y * HEART_SIZE) + HEART_OFFSET, HEART_SIZE, HEART_SIZE);
			}
			x++;
			if(i % 15 == 0) {
				y++;
				x = 0;
			}
		}
	}

	let drawMobHealth = function(mob, x, y, healthBarWidth){
		xoff = GRID_SIZE * mob.animation.offsetX;
		yoff = GRID_SIZE * mob.animation.offsetY;
		healthBarWidth = healthBarWidth - (GRID_SIZE / 4);
		fill(40,0,0);
		rect(xoff + x + (GRID_SIZE / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
		healthBarWidth = healthBarWidth * Utility.getHealthPercent(mob);
		fill(50, 220, 120);
		rect(xoff + x + (GRID_SIZE / 8), yoff + y - HEALTH_BAR_OFFSET, healthBarWidth, HEALTH_BAR_HEIGHT);
	}

	this.addObject = function(object){
		if(object instanceof Player){
			player = object;
		}
		System.prototype.addObject.call(this, object);
	}

	this.handleEvent = function(engine, eventID, data){
		switch(eventID){
			case event_start_game:
				centerCamera(camera, player.position);
				break;
			case event_up_level: case event_down_level: case event_player_moved:
				cameraMoving = true;
				break;
			case event_window_resized:
				resize();
				break;
			case event_begin_combat:
				changeZoom(camera, 10, DISPLAY_SETTINGS.CAMERA_DEFAULT_ZOOM + .20);
				break;
			case event_end_combat:
				changeZoom(camera, 25, DISPLAY_SETTINGS.CAMERA_DEFAULT_ZOOM);
				break;
			// case event_player_start_sprinting:
			// 	changeZoom(camera, 25, DISPLAY_SETTINGS.CAMERA_DEFAULT_ZOOM - .10);
			// 	break;
			// case event_player_stop_sprinting:
			// 	changeZoom(camera, 40, DISPLAY_SETTINGS.CAMERA_DEFAULT_ZOOM);
			// 	break;
		}
	}

	let centerCamera = function(camera, position, offsetX = 0, offsetY = 0){
		camera.x = position.x + offsetX;
		camera.y = position.y + offsetY;
		//if(entity.position.x > camera.x){
		//	camera.x = floor(camera.x * 40 + 1) / 40;
		//	cameraMoveTimer = setTimeout(function(){moveCamera(camera, entity, direction)}, DISPLAY_SETTINGS.CAMERA_MOVE_SPEED);
		//}
		//else{
		//	clearTimeout(cameraMoveTimer);
		//}
	}

	let changeZoom = function(camera, speed, zoom){
		clearTimeout(cameraZoomTimer);
		if(zoom > camera.zoom + .01){
			camera.zoom = floor(camera.zoom * 50 + 1) / 50;
			cameraZoomTimer = setTimeout(function(){changeZoom(camera, speed,  zoom)}, speed);
		}
		else if(zoom < camera.zoom - .01){
			camera.zoom = floor(camera.zoom * 50 - 1) / 50;
			cameraZoomTimer = setTimeout(function(){changeZoom(camera, speed, zoom)}, speed);
		}
	}

	let shakeCamera = function(camera, speed, shakeAmount, shakeDecreaseAmount){
		clearTimeout(cameraShakeTimer);
		if(shakeAmount > 0){
			let xSign, ySign;

			if(camera.shakeOffsetX == 0) xSign = random([-1, 1]);
			else if(camera.shakeOffsetX > 0) xSign = random([1, -1, -1]);
			else xSign = random([-1, 1, 1]);

			if(camera.shakeOffsetY == 0) ySign = random([-1, 1]);
			else if(camera.shakeOffsetY > 0) ySign = random([1, -1, -1]);
			else ySign = random([-1, 1, 1]);

			camera.shakeOffsetX = xSign * random(shakeAmount - (shakeDecreaseAmount/2), shakeAmount);
			camera.shakeOffsetY = ySign * random(shakeAmount - (shakeDecreaseAmount/2), shakeAmount);

			cameraShakeTimer = setTimeout(function(){shakeCamera(camera, speed, shakeAmount - shakeDecreaseAmount, shakeDecreaseAmount)}, speed);
		}
		else{
			camera.shakeOffsetX = 0;
			camera.shakeOffsetY = 0;
			cameraShakeTimer = undefined;
		}
	}

	let resize = function(){
		resizeCanvas(window.innerWidth, window.innerHeight);
		CENTER_X = floor(width / 2);
		CENTER_Y = floor(height / 2);
	}
}
