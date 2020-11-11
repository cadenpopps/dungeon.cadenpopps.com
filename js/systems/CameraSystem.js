class CameraSystem extends GameSystem {

	constructor(config) {
		super([component_controller]);
		this.config = config;
	}

	init(engine) {
		this.camera = {
			ready: false,
			x: 0,
			y: 0,
			targetX: 0,
			targetY: 0,
			shakeOffsetX : 0,
			shakeOffsetY : 0,
			combat: false,
			sprinting: false,
			zoom: this.config.CAMERA_DEFAULT_ZOOM
		};

		this.cameraZoomTimer = undefined;
		this.cameraShakeTimer = undefined;
		this.cameraMoving = false;
	}

	run(engine) {
		for(let ID in this.entities) {
			this.centerCamera(this.entities[ID][component_position]);
		}

		if(this.camera.x != this.camera.targetX || this.camera.y != this.camera.targetY) {
			this.panCamera(engine);
		}
	}

	handleEvent(engine, eventID, data) {
		switch(eventID) {
			case event_begin_level:
				for(let ID in this.entities) {
					this.snapCamera(this.entities[ID][component_position]);
					this.camera.ready = true;
					engine.sendEvent(event_camera_ready, {camera: this.camera});
				}
				break;
			case event_player_moved:
				let player = this.entities[Object.keys(this.entities)[0]];
				this.centerCamera(player[component_position]);
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

	centerCamera(position) {
		this.camera.targetX = position.x;
		this.camera.targetY = position.y;
	}

	snapCamera(position) {
		this.camera.x = position.x;
		this.camera.y = position.y;
	}

}
