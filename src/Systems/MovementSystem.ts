import { max, min, round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import DirectionComponent, { Direction } from "../Components/DirectionComponent.js";
import MovementComponent from "../Components/MovementComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class MovementSystem extends System {
    private BASE_ACCELERATION = 0.03;
    private BASE_DIAGONAL_ACCELERATION = round(this.BASE_ACCELERATION / 1.4, 5);
    private MAX_SPEED = 0.005;
    private MAX_DIAGONAL_SPEED = round(this.MAX_SPEED / 1.4, 5);
    private ROLL_ACCELERATION = round(this.BASE_ACCELERATION * 5, 5);
    private ROLL_DIAGONAL_ACCELERATION = round(this.BASE_DIAGONAL_ACCELERATION * 5, 5);
    private MAX_ROLL_SPEED = round(this.MAX_SPEED * 1.5, 5);
    private MAX_ROLL_DIAGONAL_SPEED = round(this.MAX_DIAGONAL_SPEED * 1.5, 5);
    private ROLL_VELOCITY_DAMPER = 0.6;
    private EXTRA_FRICTION = 0.8;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Movement, eventManager, entityManager, [
            CType.Movement,
            CType.Direction,
            CType.Position,
            CType.Velocity,
            CType.Acceleration,
        ]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const mov = entity.get(CType.Movement) as MovementComponent;
            mov.walking = false;
            const dir = entity.get(CType.Direction) as DirectionComponent;
            const vel = entity.get(CType.Velocity) as VelocityComponent;
            const acc = entity.get(CType.Acceleration) as AccelerationComponent;

            if (entity.has(CType.Controller)) {
                this.determineWalking(entityId);
                this.determineRolling(entityId);
            }

            if (mov.rolling) {
                this.applyRollingForce(mov, vel, acc, dir);
            } else if (mov.walking) {
                this.applyWalkingForce(mov, vel, acc, dir);
            } else {
                this.applyStoppingForce(vel, acc);
            }
        }
    }

    private determineWalking(entityId: number): void {
        const mov = this.entityManager.get<MovementComponent>(entityId, CType.Movement);
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);
        if (con.up || con.right || con.down || con.left) {
            mov.walking = true;
        }
    }

    private determineRolling(entityId: number): void {
        const mov = this.entityManager.get<MovementComponent>(entityId, CType.Movement);
        const con = this.entityManager.get<ControllerComponent>(entityId, CType.Controller);

        if (con.roll && mov.rollCooldown === 0) {
            mov.rolling = true;
            mov.rollCounter = mov.rollLength;
            mov.rollCooldown = mov.rollCooldownLength;
        }

        if (mov.rollCooldown > 0) {
            mov.rollCooldown--;
            if (mov.rollCounter === 0) {
                mov.rolling = false;
            }
        }
    }

    private applyStoppingForce(vel: VelocityComponent, acc: AccelerationComponent): void {
        if (vel.x !== 0) {
            vel.x *= this.EXTRA_FRICTION;
        }
        if (vel.y !== 0) {
            vel.y *= this.EXTRA_FRICTION;
        }
        if (acc.x !== 0) {
            acc.x = 0;
        }
        if (acc.y !== 0) {
            acc.y = 0;
        }
    }

    private applyWalkingForce(
        mov: MovementComponent,
        vel: VelocityComponent,
        acc: AccelerationComponent,
        dir: DirectionComponent
    ): void {
        mov.walking = false;
        switch (dir.direction) {
            case Direction.North:
                acc.x = 0;
                acc.y = -this.BASE_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_SPEED);
                break;
            case Direction.East:
                acc.x = this.BASE_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_SPEED);
                acc.y = 0;
                break;
            case Direction.South:
                acc.x = 0;
                acc.y = this.BASE_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_SPEED);
                break;
            case Direction.West:
                acc.x = -this.BASE_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_SPEED);
                acc.y = 0;
                break;
            case Direction.NorthEast:
                acc.x = this.BASE_DIAGONAL_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = -this.BASE_DIAGONAL_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_DIAGONAL_SPEED);
                break;
            case Direction.SouthEast:
                acc.x = this.BASE_DIAGONAL_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = this.BASE_DIAGONAL_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_DIAGONAL_SPEED);
                break;
            case Direction.SouthWest:
                acc.x = -this.BASE_DIAGONAL_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = this.BASE_DIAGONAL_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_DIAGONAL_SPEED);
                break;
            case Direction.NorthWest:
                acc.x = -this.BASE_DIAGONAL_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = -this.BASE_DIAGONAL_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_DIAGONAL_SPEED);
                break;
        }

        if (acc.x === 0) {
            vel.x *= this.EXTRA_FRICTION;
        } else if (acc.x > 0) {
            if (vel.x < 0) {
                vel.x *= this.EXTRA_FRICTION;
            }
        } else if (acc.x < 0) {
            if (vel.x > 0) {
                vel.x *= this.EXTRA_FRICTION;
            }
        }

        if (acc.y === 0) {
            vel.y *= this.EXTRA_FRICTION;
        } else if (acc.y > 0) {
            if (vel.y < 0) {
                vel.y *= this.EXTRA_FRICTION;
            }
        } else if (acc.y < 0) {
            if (vel.y > 0) {
                vel.y *= this.EXTRA_FRICTION;
            }
        }
    }

    private applyRollingForce(
        mov: MovementComponent,
        vel: VelocityComponent,
        acc: AccelerationComponent,
        dir: DirectionComponent
    ): void {
        if (mov.rollCounter > mov.rollLength / 2) {
            switch (dir.direction) {
                case Direction.North:
                    acc.x = 0;
                    acc.y = -this.ROLL_ACCELERATION;
                    vel.y = max(vel.y, -mov.speed * this.MAX_ROLL_SPEED);
                    break;
                case Direction.East:
                    acc.x = this.ROLL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_SPEED);
                    acc.y = 0;
                    break;
                case Direction.South:
                    acc.x = 0;
                    acc.y = this.ROLL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_SPEED);
                    break;
                case Direction.West:
                    acc.x = -this.ROLL_ACCELERATION;
                    vel.x = max(vel.x, -mov.speed * this.MAX_ROLL_SPEED);
                    acc.y = 0;
                    break;
                case Direction.NorthEast:
                    acc.x = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = max(vel.y, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.SouthEast:
                    acc.x = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.SouthWest:
                    acc.x = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = max(vel.x, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.NorthWest:
                    acc.x = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = max(vel.x, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = max(vel.y, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
            }
        }
        mov.rollCounter--;
        vel.x *= this.ROLL_VELOCITY_DAMPER;
        vel.y *= this.ROLL_VELOCITY_DAMPER;
        if (mov.rollCounter === 0) {
            mov.rolling = false;
        }
    }
}
