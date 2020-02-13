class DisplaySystem extends System {

	constructor(config, images) {
		super([component_position, component_display]);
		this.config = config;
		this.textures = images;
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

		this.squares = [];
		this.entities = [];

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
		if(this.camera.display) {
			if(this.cameraMoving) {
				let player = engine.getPlayer();
				if(player.animation.animation == animation_idle) { this.cameraMoving = false; }
				this.centerCamera(this.camera, player.position, player.animation.offsetX, player.animation.offsetY);
			}
			canvas.translate(this.centerX + this.camera.shakeOffsetX, this.centerY + this.camera.shakeOffsetY);
			canvas.scale(this.camera.zoom, this.camera.zoom);


			this.drawSquares(this.squares);
			this.drawEntities(this.entities);
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
			case event_begin_level:
				this.determineSquareTextures(engine.getMap());
				this.cameraMoving = true;
				this.camera.display = true;
				break;
			case event_player_moved:
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
		if(object instanceof Square) {
			if(!this.squares.includes(object)) {
				this.squares.push(object);
			}
		}
		else if(this.componentRequirements.length > 0) {
			if(!this.entities.includes(object) && Utility.checkComponents(object, this.componentRequirements)) {
				this.entities.push(object);
			}
		}
		super.addObject(object);
	}

	removeObject(object) {
		if(this.squares.indexOf(object) !== -1) {
			this.squares.splice(this.squares.indexOf(object), 1);
		}
		else if(this.entities.indexOf(object) !== -1) {
			this.entities.splice(this.entities.indexOf(object), 1);
		}
		super.removeObject(object);
	}

	clearObjects(object) {
		this.squares = [];
		this.entities = [];
		super.clearObjects();
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
					switch(texture.textureType) {
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
		if(this.textures[texture.textureType][texture_num_alts] > 0) {
			let rand = random(texture_probability_distribution[this.textures[texture.textureType][texture_num_alts] + 1]);
			for(let i = 0; i < this.textures[texture.textureType][texture_num_alts] + 1; i++) {
				if(rand < texture_probability_distribution[i]) {
					texture.textureElements[0].element = texture_default + i;
					return;
				}
			}
		}
	}

	drawSquares(squares) {
		for(let s of squares) {
			if(s.display.discovered) {
				let bounds = this.getDrawBounds(s);
				if(this.onScreen(bounds, this.camera.zoom)) {
					this.drawTexture(s, bounds);
				}
			}
		}
	}

	drawTexture(object, bounds) {
		let x = bounds.x, y = bounds.y, w = bounds.w, h = bounds.h;
		for(let texture of object.textures) {
			for(let textureElement of texture.textureElements) {
				if(this.textures[texture.textureType][textureElement.element] == undefined) {
					image(this.textures[texture.textureType][texture_default], x + (this.gridSize * textureElement.xOff), y + (this.gridSize * textureElement.yOff), w, h);
				}
				else {
					image(this.textures[texture.textureType][textureElement.element], x + (this.gridSize * textureElement.xOff), y + (this.gridSize * textureElement.yOff), w, h);
				}
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
							fill(255, 230, 140, .7);
							ellipse(x, y, w, h);
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
		}
		else{
			image(a, x, y, w, h);
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
