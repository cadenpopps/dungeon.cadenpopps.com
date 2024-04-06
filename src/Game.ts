import { PoppsEngine } from "../lib/PoppsEngine.js";
import { CType, Component } from "./Component.js";
import AccelerationComponent from "./Components/AccelerationComponent.js";
import CameraComponent from "./Components/CameraComponent.js";
import CollisionComponent, { CollisionHandler } from "./Components/CollisionComponent.js";
import ControllerComponent from "./Components/ControllerComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import LightSourceComponent from "./Components/LightSourceComponent.js";
import MovementComponent from "./Components/MovementComponent.js";
import PlayerComponent from "./Components/PlayerComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import SizeComponent from "./Components/SizeComponent.js";
import VelocityComponent from "./Components/VelocityComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";
import { EntityManager } from "./EntityManager.js";
import { Event, EventManager } from "./EventManager.js";
import { InputManager } from "./InputManager.js";
import { System } from "./System.js";
import CameraSystem from "./Systems/CameraSystem.js";
import ControllerSystem from "./Systems/ControllerSystem.js";
import GameSystem from "./Systems/GameSystem.js";
import GraphicsSystem from "./Systems/GraphicsSystem.js";
import InteractableSystem from "./Systems/InteractableSystem.js";
import LevelSystem from "./Systems/LevelSystem.js";
import LightSystem from "./Systems/LightSystem.js";
import MovementSystem from "./Systems/MovementSystem.js";
import PhysicsSystem from "./Systems/PhysicsSystem.js";
import PlayerSystem from "./Systems/PlayerSystem.js";
import VisibleSystem from "./Systems/VisibleSystem.js";

let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let inputManager = new InputManager(eventManager);
let systems = Array<System>();
systems.push(new GameSystem(eventManager, entityManager));
systems.push(new GraphicsSystem(eventManager, entityManager));
systems.push(new ControllerSystem(eventManager, entityManager, inputManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelSystem(eventManager, entityManager));
systems.push(new InteractableSystem(eventManager, entityManager));
systems.push(new LightSystem(eventManager, entityManager));
systems.push(new VisibleSystem(eventManager, entityManager));

entityManager.addEntity(
    new Map<CType, Component>([
        [CType.Player, new PlayerComponent()],
        [CType.Position, new PositionComponent(55, 19, 0)],
        [CType.Velocity, new VelocityComponent(0, 0)],
        [CType.Acceleration, new AccelerationComponent(0, 0)],
        [CType.Visible, new VisibleComponent({ r: 0, g: 255, b: 255, a: 1 }, false, 5)],
        [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
        [CType.Size, new SizeComponent(0.7)],
        [CType.Controller, new ControllerComponent()],
        [CType.Camera, new CameraComponent(55, 19, 0, 70, 1)],
        [CType.Movement, new MovementComponent(30)],
        [CType.Interactable, new InteractableComponent(Interactable.Player)],
        [CType.LightSource, new LightSourceComponent(LightSystem.LIGHT_MAX - 5)],
    ])
);

entityManager.addEntity(
    new Map<CType, Component>([
        [CType.Position, new PositionComponent(55, 17, 0)],
        [CType.Velocity, new VelocityComponent(0, 0)],
        [CType.Acceleration, new AccelerationComponent(0, 0)],
        [CType.Visible, new VisibleComponent({ r: 255, g: 255, b: 0, a: 1 }, true, 4)],
        [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
        [CType.Size, new SizeComponent(1.7)],
        [CType.Controller, new ControllerComponent()],
        [CType.Movement, new MovementComponent(10)],
    ])
);

// for (let i = 0; i < 5; i++) {
//     entityManager.addEntity(
//         new Map<CType, Component>([
//             [CType.Position, new PositionComponent(55 - i / 2, 17, 0)],
//             [CType.Velocity, new VelocityComponent(0.05 + random(0.05), 0.05 + random(0.05))],
//             [CType.Visible, new VisibleComponent({ r: 0, g: 0, b: 255, a: 255 }, false, 2)],
//             [CType.Collision, new CollisionComponent(random(0.3) + 0.5, CollisionHandler.Reflect)],
//         ])
//     );
// }

// Overview Camera
// entityManager.addEntity(new Map<CType, Component>([[CType.Camera, new CameraComponent(25, 25, 0, 10, 2)]]));

// let tickTime = Date.now();
function gameLoop() {
    // const newTime = Date.now();
    // console.log(`${newTime - tickTime}`);
    // tickTime = newTime;
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}

engine.loop(gameLoop);
eventManager.addEvent(Event.new_game);
