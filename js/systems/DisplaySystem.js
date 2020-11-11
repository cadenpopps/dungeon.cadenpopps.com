class DisplaySystem extends GameSystem {

	constructor(config, images) {
		super([component_position, component_display]);
		this.config = config;
		this.textures = images;
	}

	init(engine) {
		this.cameraZoomTimer = undefined;
		this.cameraShakeTimer = undefined;
		this.cameraMoving = false;

		this.lightOffset = 0;
		this.lightOffsetScale = .02;
		this.lightOffsetSpeed = 600;

		this.centerX = floor(width / 2);
		this.centerY = floor(height / 2);

		this.canvas = {
			ready: false,
			centerX: this.centerX,
			centerY: this.centerY,
			zoom: 1
		}

		// this.cameraReady = false;
		// this.cameraX = 0;
		// this.cameraY = 0;
		// this.zoom = 1;

		this.gridSize = this.config.GRID_SIZE;
		this.halfGridSize = this.gridSize / 2;
	}

	run(engine) {
		background(0);

		if(this.canvas.ready) {
			// let player = engine.getPlayer();
			// if(player.animation.animation == animation_idle) { this.cameraMoving = false; }
			// this.centerCamera(this.camera, player);

			//move to camera event handler
			canvas.translate(this.canvas.centerX, this.canvas.centerY);
			canvas.scale(this.canvas.zoom, this.canvas.zoom);

			for(let ID in this.entities) {
				if(Utility.entityHasComponent(this.entities[ID], component_animation)) {
					this.drawEntityWithAnimation(this.entities[ID]);
				}
				else {
					this.drawEntityWithoutAnimation(this.entities[ID]);
				}

			}

			// this.drawSquares(engine.getMap());
			// this.drawEntities(engine.getEntities());
			// this.drawLights(this.objects);
			// this.drawMobHealth(this.objects);

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
			case event_begin_level:
				// MOVE THIS TO TEXTURE SYSTEM
				// this.determineSquareTextures(engine.getMap());
				// this.cameraMoving = true;
				// this.camera.display = true;
				break;
			case event_camera_ready:
				this.canvas.ready = true;
				this.canvas.centerX = this.centerX + (data.camera.x * this.gridSize);
				this.canvas.centerY = this.centerY + (data.camera.y * this.gridSize);
				this.zoom = data.camera.zoom;
				console.log(this.canvas);
				break;
			case event_camera_moved:
				this.canvas.centerX = this.centerX + (data.camera.x * this.gridSize);
				this.canvas.centerY = this.centerY + (data.camera.y * this.gridSize);
				this.zoom = data.camera.zoom;
				break;
			case event_down_level:
				this.camera.display = false;
				break;
			case event_window_resized:
				this.resize();
				break;
				// case event_begin_combat:
				// 	this.camera.combat = true;
				// 	this.decideCameraZoomState(this.camera);
				// 	break;
				// case event_end_combat:
				// 	this.camera.combat = false;
				// 	this.decideCameraZoomState(this.camera);
				// 	break;
			case event_player_start_sprinting:
				this.camera.sprinting = true;
				this.decideCameraZoomState(this.camera);
				break;
			case event_player_stop_sprinting:
				this.camera.sprinting = false;
				this.decideCameraZoomState(this.camera);
				break;
				// case event_player_melee_attack:
				// 	this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_MEDIUM_SMALL);
				// 	engine.sendEvent(event_hitstun, { "ticks": 4 });
				// 	break;
				// case event_player_spin_attack:
				// 	this.shakeCamera(this.camera, this.config.CAMERA_SHAKE_SMALL);
				// 	engine.sendEvent(event_hitstun, { "ticks": 2 });
				// 	break;
				//event_entity_take_damage
			case event_entity_take_damage:
				this.shakeCamera(this.camera, data.healthLost);
				// engine.sendEvent(event_hitstun, { "ticks": 6 });
				break;
		}
	}

	getDrawBounds(entity) {
		let bounds = {};
		bounds.x = this.canvas.centerX - (this.gridSize * (entity[component_position].x + entity[component_display].offsetX));
		bounds.y = this.canvas.centerY - (this.gridSize * (entity[component_position].y + entity[component_display].offsetY));
		bounds.w = entity[component_display].width * this.gridSize;
		bounds.h = entity[component_display].height * this.gridSize;
		console.log(bounds);
		return bounds;
	}

	onScreen(bounds, scale) {
		const border = max(bounds.w, bounds.h) + 10;
		const t = -(height / scale / 2) - border;
		const r = (width / scale / 2) + border;
		const b = (height / scale / 2) + border;
		const l = -(width / scale / 2) - border;
		return bounds.y > t && bounds.x + bounds.w < r && bounds.y + bounds.h < b && bounds.x > l;
	}

	drawEntityWithAnimation(entity) {

	}

	drawEntityWithoutAnimation(entity) {
		// if(squareEntity[component_display].discovered) {
		let bounds = this.getDrawBounds(entity);
		// if(this.onScreen(bounds, this.camera.zoom)) {
		this.drawTexture(entity, bounds);
		// }
		// }
	}

	drawTexture(entity, bounds) {
		let x = bounds.x, y = bounds.y, w = bounds.w, h = bounds.h;
		// for(let texture of object.textures) {
		// 	for(let textureElement of texture.textureElements) {
		let texture = entity[component_texture];
		// console.log(this.textures[texture.type]);
		if(this.textures[texture.type][texture.subtype] == undefined) {
			console.log("undefined");
			image(this.textures[texture.type][texture_default], x, y, w, h);
		}
		else {
			image(this.textures[texture.type][texture.subtype], x, y, w, h);
		}
		// }
		// }
	}

	static texturesConnect(t1, t2) {
		if(t2 === undefined) {
			return false;
		}
		if(t1 instanceof WallSquare) {
			return (t2 instanceof WallSquare);
		}
		else if(t1 instanceof FloorSquare) {
			return !(t2 instanceof WallSquare);
		}
	}

	static determineTextureType(square, texture, map) {
		let TOP = false, RIGHT = false, BOTTOM = false, LEFT = false;
		let numNeighbors = 0;
		if(square.position.y > 0) {
			TOP = DisplaySystem.texturesConnect(square, map[square.position.x][square.position.y - 1]);
			if(TOP) { numNeighbors++; }
		}
		if(square.position.x < map.length - 1) {
			RIGHT = DisplaySystem.texturesConnect(square, map[square.position.x + 1][square.position.y]);
			if(RIGHT) { numNeighbors++; }
		}
		if(square.position.y < map.length - 1) {
			BOTTOM = DisplaySystem.texturesConnect(square, map[square.position.x][square.position.y + 1]);
			if(BOTTOM) { numNeighbors++; }
		}
		if(square.position.x > 0) {
			LEFT = DisplaySystem.texturesConnect(square, map[square.position.x - 1][square.position.y]);
			if(LEFT) { numNeighbors++; }
		}

		switch(numNeighbors) {
			case 0:
				texture.textureElements.push(new TextureElementComponent(texture_cross, 0, 0));
				break;
			case 1:
				if(TOP) {
					texture.textureElements.push(new TextureElementComponent(texture_U_top, 0, 0));
				}
				else if(RIGHT) {
					texture.textureElements.push(new TextureElementComponent(texture_U_right, 0, 0));
				}
				else if(BOTTOM) {
					texture.textureElements.push(new TextureElementComponent(texture_U_bottom, 0, 0));
				}
				else if(LEFT) {
					texture.textureElements.push(new TextureElementComponent(texture_U_left, 0, 0));
				}
				break;
			case 2:
				if(LEFT && RIGHT) {
					texture.textureElements.push(new TextureElementComponent(texture_side_top, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_bottom, 0, 0));
				}
				else if(TOP && BOTTOM) {
					texture.textureElements.push(new TextureElementComponent(texture_side_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_left, 0, 0));
				}
				else if(TOP && RIGHT) {
					texture.textureElements.push(new TextureElementComponent(texture_in_corner_bottom_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_right, 0, 0));
				}
				else if(BOTTOM && RIGHT) {
					texture.textureElements.push(new TextureElementComponent(texture_in_corner_top_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_right, 0, 0));
				}
				else if(BOTTOM && LEFT) {
					texture.textureElements.push(new TextureElementComponent(texture_in_corner_top_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_left, 0, 0));
				}
				else if(LEFT && TOP) {
					texture.textureElements.push(new TextureElementComponent(texture_in_corner_bottom_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_left, 0, 0));
				}
				break;
			case 3:
				if(!TOP) {
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_top, 0, 0));
				}
				else if(!RIGHT) {
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_right, 0, 0));
				}
				else if(!BOTTOM) {
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_left, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_bottom, 0, 0));
				}
				else if(!LEFT) {
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_bottom_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_out_corner_top_right, 0, 0));
					texture.textureElements.push(new TextureElementComponent(texture_side_left, 0, 0));
				}
				break;
			case 4:
				texture.textureElements.push(new TextureElementComponent(texture_default, 0, 0));
				break;
			default:
				texture.textureElements.push(new TextureElementComponent(texture_default, 0, 0));
				break;
		}

		// if(square.position.y > 0 && square.position.x < map.length - 1) {
		// 	topright = texturesConnect(square, map[square.position.x + 1][square.position.y - 1]);
		// }
		// if(square.position.x < map.length - 1 && square.position.y < map.length - 1) {
		// 	bottomright = texturesConnect(square, map[square.position.x + 1][square.position.y + 1]);
		// }
		// if(square.position.y < map.length - 1 && square.position.x > 0) {
		// 	bottomleft = texturesConnect(square, map[square.position.x - 1][square.position.y + 1]);
		// }
		// if(square.position.x > 0 && square.position.y > 0) {
		// 	topleft = texturesConnect(square, map[square.position.x - 1][square.position.y - 1]);
		// }
	}

	determineSquareTextures(map) {
		for(let i = 0; i < map.length; i++) {
			for(let j = 0; j < map.length; j++) {
				let square = map[i][j];
				for(let texture of square.textures) {
					switch(texture.type) {
						case texture_wall: case texture_floor:
							DisplaySystem.determineTextureType(square, texture, map);
							break;
						default:
							texture.textureElements.push(new TextureElementComponent(texture_default, 0, 0));
							break;
					}
					if(texture.textureElements.length == 1 && texture.textureElements[0].element == texture_default) {
						this.setTextureAlt(texture);
					}
				}
			}
		}
	}

	setTextureAlt(texture) {
		if(this.textures[texture.type][texture_num_alts] > 0) {
			let rand = random(texture_probability_distribution[this.textures[texture.type][texture_num_alts] + 1]);
			for(let i = 0; i < this.textures[texture.type][texture_num_alts] + 1; i++) {
				if(rand < texture_probability_distribution[i]) {
					texture.textureElements[0].element = texture_default + i;
					return;
				}
			}
		}
	}

	drawSquare(squareEntity) {
		if(squareEntity[component_display].discovered) {
			let bounds = this.getDrawBounds(s);
			if(this.onScreen(bounds, this.camera.zoom)) {
				this.drawTexture(s, bounds);
			}
		}
	}


	drawEntities(entities) {
		for(let e of entities) {
			if(e.display.visible) {
				let bounds = this.getDrawBounds(e);
				if(this.onScreen(bounds, this.camera.zoom)) {
					if(e.components.indexOf(component_animation) !== -1) {
						this.drawAnimation(e, bounds);
					}
					else if(e.components.indexOf(component_texture) !== -1) {
						this.drawAnimation(e, bounds);
					}
					else {
						//========NEED TEXTURES========
						let x = bounds.x, y = bounds.y, w = bounds.w, h = bounds.h;
						if(e instanceof Torch) {
							fill(255, 220, 130, .75);
							switch(e.direction.direction) {
								case direction_up:
									arc(x, y, w, Math.PI, 2 * Math.PI);
									break;
								case direction_right:
									arc(x, y, h, Math.PI / 2, 1.5 * Math.PI, true);
									break;
								case direction_down:
									arc(x, y, w, 0, Math.PI);
									break;
								case direction_left:
									arc(x, y, h, Math.PI / 2, 1.5 * Math.PI);
									break;
							}
						}
						else {
							fill(255, 100, 100);
							rect(x, y, w, h);
						}
					}
				}
			}
		}
	}

	drawAnimation(object, bounds) {
		let x = bounds.x, y = bounds.y, w = bounds.w, h = bounds.h;
		x += this.gridSize * object.animation.offsetX;
		y += this.gridSize * object.animation.offsetY;
		let s = object.animation.sprite;
		if(s == undefined) {
			fill(20);
			rect(x + (this.gridSize / 8) - 2, y + (this.gridSize / 8) - 2, w - (this.gridSize / 4) + 4, h - (this.gridSize / 4) + 4);
			if(object instanceof Player) {
				fill(0, 200, 230);
			}
			else{
				fill(200, 20, 40);
			}
			rect(x + (this.gridSize / 8), y + (this.gridSize / 8), w - (this.gridSize / 4), h - (this.gridSize / 4));
			if(object instanceof Player) {
				fill(255, 255, 0);
				switch(object.direction.direction) {
					case direction_up:
						ellipse(x + (this.gridSize / 2), y + (this.gridSize / 2) - (this.gridSize / 3), (this.gridSize / 6), (this.gridSize / 6));
						break;
					case direction_right:
						ellipse(x + (this.gridSize / 2) + (this.gridSize / 3), y + (this.gridSize / 2), (this.gridSize / 6), (this.gridSize / 6));
						break;
					case direction_down:
						ellipse(x + (this.gridSize / 2), y + (this.gridSize / 2) + (this.gridSize / 3), (this.gridSize / 6), (this.gridSize / 6));
						break;
					case direction_left:
						ellipse(x + (this.gridSize / 2) - (this.gridSize / 3), y + (this.gridSize / 2), (this.gridSize / 6), (this.gridSize / 6));
						break;
				}
			}
		}
		else{
			image(a, x, y, w, h);
		}
	}

	drawLights(objects) {
		for(let o of objects) {
			if(o.display.discovered && o.components.includes(component_light)) {
				this.lightSquare(o);
			}
		}
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
		clearTimeout(this.cameraShakeTimer);
		this.shakeCameraHelper(camera, random(2 * Math.PI), shakeAmount);
	}

	shakeCameraHelper(camera, angle, shakeAmount) {
		let self = this;
		if(shakeAmount > 2) {
			// camera.shakeOffsetX = ((step % 2 == 0) ? -1 : 1) * (randomInt(shakeAmount - .1, shakeAmount) * step / 5);
			// camera.shakeOffsetY = ((step % 2 == 0) ? -1 : 1) * (randomInt(shakeAmount - .1, shakeAmount) * step / 5);
			camera.shakeOffsetX = shakeAmount * Math.cos(angle);
			camera.shakeOffsetY = shakeAmount * Math.sin(angle);
			angle += random(Math.PI * .8, Math.PI * 1.2);
			if(angle > (2 * Math.PI)) {
				angle = angle - (2 * Math.PI);
			}
			this.cameraShakeTimer = setTimeout(function() { self.shakeCameraHelper(camera, angle, shakeAmount * .8); }, this.config.CAMERA_SHAKE_SPEED);
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
