import { PoppsEngine } from "../lib/PoppsEngine.js";
import { loadImage } from "../lib/PoppsLoad.js";
import { CType, Component } from "./Component.js";
import AbilityComponent, { SlashAttack, SpinAttack } from "./Components/AbilityComponent.js";
import AccelerationComponent from "./Components/AccelerationComponent.js";
import CameraComponent from "./Components/CameraComponent.js";
import CollisionComponent, { CollisionHandler } from "./Components/CollisionComponent.js";
import ControllerComponent from "./Components/ControllerComponent.js";
import ExperienceComponent from "./Components/ExperienceComponent.js";
import HealthComponent from "./Components/HealthComponent.js";
import InteractableComponent, { Interactable } from "./Components/InteractableComponent.js";
import LightSourceComponent from "./Components/LightSourceComponent.js";
import MovementComponent from "./Components/MovementComponent.js";
import PlayerComponent from "./Components/PlayerComponent.js";
import PositionComponent from "./Components/PositionComponent.js";
import SizeComponent from "./Components/SizeComponent.js";
import TextureComponent, { Texture } from "./Components/TextureComponent.js";
import UIComponent, { UIAbilityCooldowns } from "./Components/UIComponent.js";
import VelocityComponent from "./Components/VelocityComponent.js";
import VisibleComponent from "./Components/VisibleComponent.js";
import { EntityManager } from "./EntityManager.js";
import { Event, EventManager } from "./EventManager.js";
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
systems.push(new AISystem(eventManager, entityManager));
systems.push(new UISystem(eventManager, entityManager));
systems.push(new AbilitySystem(eventManager, entityManager));
systems.push(new HitboxSystem(eventManager, entityManager));
systems.push(new HealthSystem(eventManager, entityManager));
systems.push(new TextureSystem(eventManager, entityManager));
systems.push(new EnemySystem(eventManager, entityManager));

entityManager.addEntity(
    new Map<CType, Component>([
        [CType.Player, new PlayerComponent()],
        [CType.Health, new HealthComponent(30)],
        [CType.Ability, new AbilityComponent(new SpinAttack(100), new SlashAttack(10))],
        [CType.Position, new PositionComponent(55, 19, 0)],
        [CType.Velocity, new VelocityComponent(0, 0)],
        [CType.Acceleration, new AccelerationComponent(0, 0)],
        [CType.Visible, new VisibleComponent(false, 5)],
        [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
        [CType.Size, new SizeComponent(0.9)],
        [CType.Controller, new ControllerComponent()],
        [CType.Camera, new CameraComponent(55, 19, 0, 1, 80, 16, 96)],
        [CType.Movement, new MovementComponent(30)],
        [CType.Interactable, new InteractableComponent(Interactable.Player)],
        [CType.LightSource, new LightSourceComponent(LightSystem.LIGHT_MAX - 8, 300)],
        [
            CType.UI,
            new UIComponent([
                new UIAbilityCooldowns(
                    { r: 20, g: 200, b: 40, a: 1 },
                    { r: 200, g: 200, b: 40, a: 1 },
                    { r: 150, g: 20, b: 200, a: 1 },
                    { r: 100, g: 100, b: 100, a: 0.8 }
                ),
            ]),
        ],
        [CType.Texture, new TextureComponent([new Texture(loadImage("/assets/img/sprites/playerSpriteSheet.png"))])],

        [CType.Experience, new ExperienceComponent()],
    ])
);

// for (let i = 0; i < 10; i++) {
// }

// Overview Camera
// entityManager.addEntity(
//     new Map<CType, Component>([
//         [CType.Position, new PositionComponent(25, 25)],
//         [CType.Velocity, new VelocityComponent()],
//         [CType.Acceleration, new AccelerationComponent()],
//         [CType.Controller, new ControllerComponent()],
//         [CType.Movement, new MovementComponent(1)],
//         [CType.Camera, new CameraComponent(25, 25, 0, 10, 2)],
//     ])
// );

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
