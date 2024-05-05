import { PoppsEngine } from "../../lib/PoppsEngine.js";
import CameraComponent from ".././Components/CameraComponent.js";
import { EntityManager } from ".././EntityManager.js";
import { Event, EventManager } from ".././EventManager.js";
import CameraSystem from ".././Systems/CameraSystem.js";
import GraphicsSystem from ".././Systems/GraphicsSystem.js";
import { CType } from "../Component.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { InputManager } from "../InputManager.js";
import ControllerSystem from "../Systems/ControllerSystem.js";
import MovementSystem from "../Systems/MovementSystem.js";
import PhysicsSystem from "../Systems/PhysicsSystem.js";
import PlayerSystem from "../Systems/PlayerSystem.js";
import TextureSystem from "../Systems/TextureSystem.js";
import UISystem from "../Systems/UISystem.js";
import VisibleSystem from "../Systems/VisibleSystem.js";
import LevelMakerSystem from "./LevelMakerSystem.js";
let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let inputManager = new InputManager(eventManager);
let systems = Array();
systems.push(new ControllerSystem(eventManager, entityManager, inputManager));
systems.push(new GraphicsSystem(eventManager, entityManager));
systems.push(new VisibleSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelMakerSystem(eventManager, entityManager));
systems.push(new TextureSystem(eventManager, entityManager));
systems.push(new UISystem(eventManager, entityManager));
eventManager.addEvent(Event.new_game);
entityManager.addEntity(new Map([
    [CType.Position, new PositionComponent(5, 5)],
    [CType.Velocity, new VelocityComponent()],
    [CType.Acceleration, new AccelerationComponent()],
    [CType.Controller, new ControllerComponent()],
    [CType.Movement, new MovementComponent()],
    [CType.Camera, new CameraComponent(5, 5, 0, 1, 32, 32, 120)],
]));
engine.loop(gameLoop);
function gameLoop() {
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}
//# sourceMappingURL=LevelMaker.js.map