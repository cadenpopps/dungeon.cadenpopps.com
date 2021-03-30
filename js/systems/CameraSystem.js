class CameraSystem extends GameSystem {

	constructor(config) {
		super([component_position, component_camera]);
		this.config = config;
	}

	init(engine) {
		this.cameraZoomTimer = undefined;
		this.cameraShakeTimer = undefined;
		this.cameraMoving = false;
	}

	run(engine) {
		// for(let ID in this.entities) {
		// 	this.centerCamera(this.entities[ID][component_position]);
		// }

		// if(this.camera.x != this.camera.targetX || this.camera.y != this.camera.targetY) {
		// 	this.panCamera(engine);
		// }

		for(let ID in this.entities) {
			this.updateCamera(engine, this.entities[ID]);
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_begin_level:
				for(let ID in this.entities) {
					this.snapCamera(engine, this.entities[ID]);
					engine.sendEvent(event_camera_updated, {camera: this.entities[ID][component_camera]});
				}
				break;
			case event_player_moved:
				for(let ID in this.entities) {
					this.entities[ID][camera_component].smoothFrames = this.config.CAMERA_MOVE_SPEED;
				}
				break;
		}
	}

	panCamera(engine) {
		this.camera.x += (this.camera.targetX - this.camera.x) / 5;
		this.camera.y += (this.camera.targetY - this.camera.y) / 5;
		if(this.camera.targetX - this.camera.x < .1) {
			this.camera.x = this.camera.targetX;
		}
		if(this.camera.targetY - this.camera.y < .1) {
			this.camera.y = this.camera.targetY;
		}
		engine.sendEvent(event_camera_moved, {camera: this.camera});
	}

	updateCamera(engine, entity) {
		if(entity[component_camera].smoothFrame > 0) {
			let difX = entity[component_position].x - entity[component_camera].cameraX;
			let difY = entity[component_position].y - entity[component_camera].cameraY;
			difX = (difX / this.config.CAMERA_MOVE_SPEED) * entity[component_camera].smoothFrame
			difY = (difY / this.config.CAMERA_MOVE_SPEED) * entity[component_camera].smoothFrame
			entity[component_camera].cameraX += difX;
			entity[component_camera].cameraY += difY;
			entity[component_camera].smoothFrame--;
			engine.sendEvent(event_camera_updated, {camera: this.entities[ID][component_camera]});
		}
	}

	snapCamera(engine, entity) {
		entity[component_camera].cameraX = entity[component_position].x;
		entity[component_camera].cameraY = entity[component_position].y;
		entity[component_camera].smoothFrame = 0;
	}

}
