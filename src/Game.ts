import { PoppsEngine } from "../lib/PoppsEngine.js";
import { EntityManager } from "./EntityManager.js";
import { EventManager } from "./EventManager.js";
import { InputManager } from "./InputManager.js";
import { System } from "./System.js";
import AISystem from "./Systems/AISystem.js";
import AbilitySystem from "./Systems/AbilitySystem.js";
import CameraSystem from "./Systems/CameraSystem.js";
import ControllerSystem from "./Systems/ControllerSystem.js";
import EnemySystem from "./Systems/EnemySystem.js";
import GameSystem from "./Systems/GameSystem.js";
import GraphicsSystem from "./Systems/GraphicsSystem.js";
import HealthSystem from "./Systems/HealthSystem.js";
import HitboxSystem from "./Systems/HitboxSystem.js";
import InteractableSystem from "./Systems/InteractableSystem.js";
import LevelSystem from "./Systems/LevelSystem.js";
import LightSystem from "./Systems/LightSystem.js";
import MovementSystem from "./Systems/MovementSystem.js";
import PhysicsSystem from "./Systems/PhysicsSystem.js";
import PlayerSystem from "./Systems/PlayerSystem.js";
import TextureSystem from "./Systems/TextureSystem.js";
import UISystem from "./Systems/UISystem.js";
import VisibleSystem from "./Systems/VisibleSystem.js";

function gameLoop() {
    eventManager.tick();
    entityManager.tick();
    for (let s of systems) {
        s.tick();
    }
}

const systems = Array<System>();
const engine = new PoppsEngine();
const eventManager = new EventManager();
const entityManager = new EntityManager(eventManager);
const inputManager = new InputManager(eventManager);

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
systems.push(new AISystem(eventManager, entityManager));
systems.push(new UISystem(eventManager, entityManager));
systems.push(new AbilitySystem(eventManager, entityManager));
systems.push(new HitboxSystem(eventManager, entityManager));
systems.push(new HealthSystem(eventManager, entityManager));
systems.push(new TextureSystem(eventManager, entityManager));
systems.push(new EnemySystem(eventManager, entityManager));

engine.loop(gameLoop);
