import { PoppsEngine } from "../lib/PoppsEngine.js";
import { CType } from "./Component.js";
import CameraComponent from "./Components/CameraComponent.js";
import CollisionComponent from "./Components/CollisionComponent.js";
import ControllerComponent from "./Components/ControllerComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import MovementComponent from "./Components/MovementComponent.js";
import PlayerComponent from "./Components/PlayerComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import VelocityComponent from "./Components/VelocityComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";
import { EntityManager } from "./EntityManager.js";
import { Event, EventManager } from "./EventManager.js";
import CameraSystem from "./Systems/CameraSystem.js";
import GameSystem from "./Systems/GameSystem.js";
import GraphicsSystem from "./Systems/GraphicsSystem.js";
import InputSystem from "./Systems/InputSystem.js";
import InteractableSystem from "./Systems/InteractableSystem.js";
import LevelSystem from "./Systems/LevelSystem.js";
import MovementSystem from "./Systems/MovementSystem.js";
import PhysicsSystem from "./Systems/PhysicsSystem.js";
import PlayerSystem from "./Systems/PlayerSystem.js";
let engine = new PoppsEngine();
let eventManager = new EventManager();
let entityManager = new EntityManager(eventManager);
let systems = Array();
systems.push(new GameSystem(eventManager, entityManager));
systems.push(new GraphicsSystem(eventManager, entityManager));
systems.push(new InputSystem(eventManager, entityManager));
systems.push(new PlayerSystem(eventManager, entityManager));
systems.push(new MovementSystem(eventManager, entityManager));
systems.push(new PhysicsSystem(eventManager, entityManager));
systems.push(new CameraSystem(eventManager, entityManager));
systems.push(new LevelSystem(eventManager, entityManager));
systems.push(new InteractableSystem(eventManager, entityManager));
entityManager.addEntity(new Map([
    [CType.Player, new PlayerComponent()],
    [CType.Position, new PositionComponent(55, 19, 0)],
    [CType.Velocity, new VelocityComponent(0, 0)],
    [CType.Visible, new VisibleComponent({ r: 0, g: 255, b: 255, a: 255 }, 5)],
    [CType.Collision, new CollisionComponent()],
    [CType.Controller, new ControllerComponent()],
    [CType.Camera, new CameraComponent(0, 0, 0, 60, 1)],
    [CType.Movement, new MovementComponent(45)],
    [CType.Interactable, new InteractableComponent(Interactable.Player)],
]));
eventManager.addEvent(Event.new_game);
engine.loop(gameLoop);
function gameLoop() {
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}
//# sourceMappingURL=Game.js.map