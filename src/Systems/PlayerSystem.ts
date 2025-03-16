import { CType } from "../Component.js";
import AbilityComponent, { LungeAttack, SpinAttack } from "../Components/AbilityComponent.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import CameraComponent from "../Components/CameraComponent.js";
import CollisionComponent, { CollisionHandler } from "../Components/CollisionComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent from "../Components/DirectionComponent.js";
import ExperienceComponent from "../Components/ExperienceComponent.js";
import HealthComponent from "../Components/HealthComponent.js";
import LevelChangeComponent from "../Components/LevelChangeComponent.js";
import LightSourceComponent from "../Components/LightSourceComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import PlayerComponent from "../Components/PlayerComponent.js";
import PositionComponent from "../Components/PositionComponent.js";
import SizeComponent from "../Components/SizeComponent.js";
import TextureComponent, { Texture, TextureMap, TextureMaps } from "../Components/TextureComponent.js";
import UIComponent, { UIInputDisplay, UILifecycleState, UIPlayerHealthBar } from "../Components/UIComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import VisibleComponent from "../Components/VisibleComponent.js";
import { EntityManager } from "../EntityManager.js";
import { Event, EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";
import LightSystem from "./LightSystem.js";

export default class PlayerSystem extends System {
    public static PLAYER_SPAWN_POINT: PositionComponent = new PositionComponent(57, 19, 0);
    public static INITIAL_PLAYER_HEALTH: number = 40;

    private respawnPlayerNextTick: boolean = false;
    private movePlayerToLevelEntranceNextTick: boolean = false;
    private levelChangeIds: Array<number> = new Array<number>();

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Player, eventManager, entityManager, [CType.Player]);
        this.entityManager.subscribeToEntities([CType.LevelChange], this.levelChangeIds, this);
    }

    public handleEvent(event: Event): void {
        switch (event) {
            case Event.init:
                this.entityManager.addEntity([new PlayerComponent()]);
                break;
            case Event.new_game:
                this.createPlayer();
                break;
            case Event.respawn:
                this.respawnPlayerNextTick = true;
                break;
            case Event.level_loaded:
                this.movePlayerToLevelEntranceNextTick = true;
                break;
        }
    }

    public logic(): void {
        if (this.respawnPlayerNextTick) {
            this.respawnPlayerNextTick = false;
            this.respawnPlayer();
        }
        if (this.movePlayerToLevelEntranceNextTick) {
            this.movePlayerToLevelEntranceNextTick = false;
            this.movePlayerToLevelEntrance();
        }
    }

    public createPlayer(): void {
        this.entityManager.addComponents(this.entityManager.getPlayerId(), [
            new PlayerComponent(),
            new DirectionComponent(),
            new HealthComponent(PlayerSystem.INITIAL_PLAYER_HEALTH),
            new AbilityComponent(new LungeAttack(25), new SpinAttack(60)),
            new PositionComponent(
                PlayerSystem.PLAYER_SPAWN_POINT.x,
                PlayerSystem.PLAYER_SPAWN_POINT.y,
                PlayerSystem.PLAYER_SPAWN_POINT.z
            ),
            new VelocityComponent(0, 0),
            new AccelerationComponent(0, 0),
            new VisibleComponent(false, 5),
            new CollisionComponent(CollisionHandler.Stop),
            new SizeComponent(0.9),
            new ControllerComponent(),
            new CameraComponent(
                PlayerSystem.PLAYER_SPAWN_POINT.x,
                PlayerSystem.PLAYER_SPAWN_POINT.y,
                PlayerSystem.PLAYER_SPAWN_POINT.z,
                1,
                80,
                16,
                96
            ),
            new MovementComponent(30),
            new LightSourceComponent(LightSystem.LIGHT_MAX - 8, 300),
            new UIComponent([new UIInputDisplay(), new UIPlayerHealthBar(20)]),
            new TextureComponent([new Texture(TextureMaps.get(TextureMap.Player))]),
            new ExperienceComponent(),
        ]);

        // this.entityManager.addEntity([
        //     new AIComponent(),
        //     new AbilityComponent(new SpinAttack(20)),
        //     new DirectionComponent(),
        //     new ExperienceComponent(1),
        //     new PositionComponent(55, 13),
        //     new VelocityComponent(0, 0),
        //     new AccelerationComponent(0, 0),
        //     new VisibleComponent(false, 4),
        //     new UIComponent([new UIEnemyHealthBar(1, 1), new UIEnemyAI(1)]),
        //     new HealthComponent(10),
        //     new CollisionComponent(CollisionHandler.Stop),
        //     new SizeComponent(1),
        //     new ControllerComponent(),
        //     new MovementComponent(10),
        //     new TextureComponent([new Texture(TextureMaps.get(TextureMap.Skeleton))]),
        // ]);
    }

    public respawnPlayer(): void {
        const playerId = this.entityManager.getPlayerId();
        this.entityManager.get<PlayerComponent>(playerId, CType.Player).levelChangeId = -1;
        const uiElements = this.entityManager.get<UIComponent>(playerId, CType.UI).elements;
        for (const element of uiElements) {
            element.state = UILifecycleState.Initial;
        }
        this.entityManager.addComponents(playerId, [
            new HealthComponent(PlayerSystem.INITIAL_PLAYER_HEALTH),
            new PositionComponent(
                PlayerSystem.PLAYER_SPAWN_POINT.x,
                PlayerSystem.PLAYER_SPAWN_POINT.y,
                PlayerSystem.PLAYER_SPAWN_POINT.z
            ),
            new CollisionComponent(),
            new MovementComponent(),
            new DirectionComponent(),
            new ControllerComponent(),
            new VelocityComponent(),
            new AccelerationComponent(),
        ]);
    }

    public movePlayerToLevelEntrance(): void {
        const exitId = this.entityManager.get<PlayerComponent>(
            this.entityManager.getPlayerId(),
            CType.Player
        ).levelChangeId;
        for (let entityId of this.levelChangeIds) {
            const entity = this.entityManager.getEntity(entityId);
            if (entity.has(CType.LevelChange)) {
                if (this.entityManager.get<LevelChangeComponent>(entityId, CType.LevelChange).id === exitId) {
                    const destinationPos = this.entityManager.get<PositionComponent>(entityId, CType.Position);
                    const playerPos = this.entityManager.get<PositionComponent>(
                        this.entityManager.getPlayerId(),
                        CType.Position
                    );
                    const playerCamera = this.entityManager.get<CameraComponent>(
                        this.entityManager.getPlayerId(),
                        CType.Camera
                    );
                    playerPos.x = destinationPos.x + (destinationPos.z > playerPos.z ? 1 : -1);
                    playerPos.y = destinationPos.y;
                    playerPos.z = destinationPos.z;
                    playerCamera.x = playerPos.x;
                    playerCamera.y = playerPos.y;
                    playerCamera.z = playerPos.x;
                    return;
                }
            }
        }
    }
}
