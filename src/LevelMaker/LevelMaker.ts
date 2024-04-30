import { PoppsEngine } from "../../lib/PoppsEngine.js";
import CameraComponent from ".././Components/CameraComponent.js";
import { EntityManager } from ".././EntityManager.js";
import { Event, EventManager } from ".././EventManager.js";
import { System } from ".././System.js";
import CameraSystem from ".././Systems/CameraSystem.js";
import GraphicsSystem from ".././Systems/GraphicsSystem.js";
import { CType, Component } from "../Component.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import { InputManager } from "../InputManager.js";
import ControllerSystem from "../Systems/ControllerSystem.js";
import MovementSystem from "../Systems/MovementSystem.js";
import PhysicsSystem from "../Systems/PhysicsSystem.js";
import PlayerSystem from "../Systems/PlayerSystem.js";
import VisibleSystem from "../Systems/VisibleSystem.js";
import LevelMakerSystem from "./LevelMakerSystem.js";

let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let inputManager = new InputManager(eventManager);
let systems = Array<System>();
systems.push(new ControllerSystem(eventManager, entityManager, inputManager));
systems.push(new GraphicsSystem(eventManager, entityManager));
systems.push(new VisibleSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelMakerSystem(eventManager, entityManager));

eventManager.addEvent(Event.new_game);

entityManager.addEntity(
    new Map<CType, Component>([
        [CType.Position, new MovementComponent()],
        [CType.Velocity, new MovementComponent()],
        [CType.Acceleration, new MovementComponent()],
        [CType.Controller, new ControllerComponent()],
        [CType.Movement, new MovementComponent()],
        [CType.Camera, new CameraComponent(5, 5, 0, 1, 30, 10, 100)],
    ])
);

engine.loop(gameLoop);

function gameLoop() {
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}
