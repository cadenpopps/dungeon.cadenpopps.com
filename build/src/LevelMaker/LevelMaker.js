import { PoppsEngine } from "../../lib/PoppsEngine.js";
import CameraComponent from ".././Components/CameraComponent.js";
import ControllerComponent from ".././Components/ControllerComponent.js";
import MovementComponent from ".././Components/MovementComponent.js";
import PositionComponent from ".././Components/PositionComponent.js";
import VelocityComponent from ".././Components/VelocityComponent.js";
import VisibleComponent from ".././Components/VisibleComponent.js";
import { EntityManager } from ".././EntityManager.js";
import { Event, EventManager } from ".././EventManager.js";
import CameraSystem from ".././Systems/CameraSystem.js";
import GraphicsSystem from ".././Systems/GraphicsSystem.js";
import InputSystem from ".././Systems/InputSystem.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import MovementSystem from "../Systems/MovementSystem.js";
import PhysicsSystem from "../Systems/PhysicsSystem.js";
import PlayerSystem from "../Systems/PlayerSystem.js";
import LevelMakerSystem from "./LevelMakerSystem.js";
let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let systems = Array();
systems.push(new GraphicsSystem(eventManager, entityManager));
systems.push(new InputSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelMakerSystem(eventManager, entityManager));
eventManager.addEvent(Event.new_game);
entityManager.addEntity([
    new PositionComponent(5, 5, 0),
    new VelocityComponent(0, 0),
    new VisibleComponent([0, 255, 255], 1),
    new CollisionComponent(),
    new ControllerComponent(),
    new CameraComponent(0, 0, 0, 50, 1),
    new MovementComponent(),
]);
engine.loop(gameLoop);
function gameLoop() {
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}
//# sourceMappingURL=LevelMaker.js.map