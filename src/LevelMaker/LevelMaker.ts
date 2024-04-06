import { PoppsEngine } from "../../lib/PoppsEngine.js";
import CameraComponent from ".././Components/CameraComponent.js";
import ControllerComponent from ".././Components/ControllerComponent.js";
import MovementComponent from ".././Components/MovementComponent.js";
import PositionComponent from ".././Components/PositionComponent.js";
import VelocityComponent from ".././Components/VelocityComponent.js";
import VisibleComponent from ".././Components/VisibleComponent.js";
import { EntityManager } from ".././EntityManager.js";
import { Event, EventManager } from ".././EventManager.js";
import { System } from ".././System.js";
import CameraSystem from ".././Systems/CameraSystem.js";
import GraphicsSystem from ".././Systems/GraphicsSystem.js";
import { CType, Component } from "../Component.js";
import CollisionComponent from "../Components/CollisionComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import MovementSystem from "../Systems/MovementSystem.js";
import PhysicsSystem from "../Systems/PhysicsSystem.js";
import PlayerSystem from "../Systems/PlayerSystem.js";
import LevelMakerSystem from "./LevelMakerSystem.js";

let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let systems = Array<System>();
systems.push(new GraphicsSystem(eventManager, entityManager));
// systems.push(new ControllerSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelMakerSystem(eventManager, entityManager));

eventManager.addEvent(Event.new_game);

entityManager.addEntity(
    new Map<CType, Component>([
        [CType.Position, new PositionComponent(5, 5, 0)],
        [CType.Velocity, new VelocityComponent(0, 0)],
        [CType.Visible, new VisibleComponent({ r: 0, g: 255, b: 255, a: 255 }, false, 1)],
        [CType.Collision, new CollisionComponent()],
        [CType.Controller, new ControllerComponent()],
        [CType.Camera, new CameraComponent(0, 0, 0, 20, 1)],
        [CType.Movement, new MovementComponent()],
        [CType.Player, new PlayerComponent()],
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
