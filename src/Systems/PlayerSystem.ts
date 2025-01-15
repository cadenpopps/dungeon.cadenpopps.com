import { loadImage } from "../../lib/PoppsLoad.js";
import { CType, Component } from "../Component.js";
import AbilityComponent, { LungeAttack, SpinAttack } from "../Components/AbilityComponent.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import AIComponent from "../Components/AIComponent.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent, { CollisionHandler } from "../Components/CollisionComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import ExperienceComponent from "../Components/ExperienceComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import InteractableComponent, { Interactable } from "../Components/InteractableComponent.js";
import LightSourceComponent from "../Components/LightSourceComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import TextureComponent, { Texture, TextureMap, TextureMaps } from "../Components/TextureComponent.js";
import UIComponent, {
    UIAbilityCooldowns,
    UIEnemyAI,
    UIEnemyHealthBar,
    UIPlayerHealthBar,
} from "../Components/UIComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import LightSystem from "./LightSystem.js";

export default class PlayerSystem extends System {
    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Player]);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.new_game:
                this.createPlayer();
                break;
        }
    }

    public createPlayer(): void {
        this.entityManager.addEntity(
            new Map<CType, Component>([
                [CType.Player, new PlayerComponent()],
                [CType.Direction, new DirectionComponent()],
                [CType.Health, new HealthComponent(20)],
                [CType.Ability, new AbilityComponent(new LungeAttack(20), new SpinAttack(60))],
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
                        new UIPlayerHealthBar(20),
                    ]),
                ],
                [CType.Texture, new TextureComponent([new Texture(loadImage("/assets/img/sprites/Player.png"))])],
                [CType.Experience, new ExperienceComponent()],
            ])
        );

        this.entityManager.addEntity(
            new Map<CType, Component>([
                [CType.AI, new AIComponent()],
                [CType.Ability, new AbilityComponent(new SpinAttack(20))],
                [CType.Direction, new DirectionComponent()],
                [CType.Experience, new ExperienceComponent(1)],
                [CType.Position, new PositionComponent(55, 17)],
                [CType.Velocity, new VelocityComponent(0, 0)],
                [CType.Acceleration, new AccelerationComponent(0, 0)],
                [CType.Visible, new VisibleComponent(false, 4)],
                [CType.UI, new UIComponent([new UIEnemyHealthBar(1, 1), new UIEnemyAI(1)])],
                [CType.Health, new HealthComponent(4)],
                [CType.Collision, new CollisionComponent(CollisionHandler.Stop)],
                [CType.Size, new SizeComponent(1)],
                [CType.Controller, new ControllerComponent()],
                [CType.Movement, new MovementComponent(10)],
                [CType.Texture, new TextureComponent([new Texture(TextureMaps.get(TextureMap.Skeleton))])],
            ])
        );
    }
}
