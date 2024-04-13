import { max, min, round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import AccelerationComponent from "../Components/AccelerationComponent.js";
import ControllerComponent from "../Components/ControllerComponent.js";
import MovementComponent, { Direction } from "../Components/MovementComponent.js";
import VelocityComponent from "../Components/VelocityComponent.js";
import { EntityManager } from "../EntityManager.js";
import { EventManager } from "../EventManager.js";
import { System, SystemType } from "../System.js";

export default class MovementSystem extends System {
    private BASE_ACCELERATION = 0.03;
    private BASE_DIAGONAL_ACCELERATION = round(this.BASE_ACCELERATION / 1.4, 5);
    private MAX_SPEED = 0.005;
    private MAX_DIAGONAL_SPEED = round(this.MAX_SPEED / 1.4, 5);
    private SNEAK_ACCELERATION_FACTOR = 0.25;
    private MAX_SNEAK_SPEED = round(this.MAX_SPEED / 2, 5);
    private MAX_SNEAK_DIAGONAL_SPEED = round(this.MAX_DIAGONAL_SPEED / 2, 5);
    private ROLL_ACCELERATION = round(this.BASE_ACCELERATION * 5, 5);
    private ROLL_DIAGONAL_ACCELERATION = round(this.BASE_DIAGONAL_ACCELERATION * 5, 5);
    private MAX_ROLL_SPEED = round(this.MAX_SPEED * 1.5, 5);
    private MAX_ROLL_DIAGONAL_SPEED = round(this.MAX_DIAGONAL_SPEED * 1.5, 5);
    private ROLL_VELOCITY_DAMPER = 0.6;
    private EXTRA_FRICTION = 0.8;

    constructor(eventManager: EventManager, entityManager: EntityManager) {
        super(SystemType.Movement, eventManager, entityManager, [CType.Movement]);
    }

    public logic(): void {
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const mov = entity.get(CType.Movement) as MovementComponent;
            const vel = entity.get(CType.Velocity) as VelocityComponent;
            const acc = entity.get(CType.Acceleration) as AccelerationComponent;
            const con = entity.get(CType.Controller) as ControllerComponent;
            if (con.roll && mov.rollCooldown === 0) {
                mov.rolling = true;
                mov.rollCounter = mov.rollLength;
                mov.rollCooldown = mov.rollCooldownLength;
            } else if (con.sneak) {
                mov.sneaking = true;
            } else {
                mov.sneaking = false;
            }
            if (mov.rollCooldown > 0) {
                mov.rollCooldown--;
            }

            if (mov.rolling) {
                this.applyRollingForce(mov, vel, acc);
            } else {
                this.applyWalkingForce(mov, vel, acc);
                if (mov.sneaking) {
                    this.applySneakingForce(mov, vel, acc);
                }
            }
        }
    }

    private applyWalkingForce(mov: MovementComponent, vel: VelocityComponent, acc: AccelerationComponent): void {
        switch (mov.direction) {
            case Direction.NONE:
                acc.x = 0;
                acc.y = 0;
                mov.moving = false;
                break;
            case Direction.NORTH:
                acc.x = 0;
                acc.y = -this.BASE_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_SPEED);
                mov.moving = true;
                break;
            case Direction.EAST:
                acc.x = this.BASE_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_SPEED);
                acc.y = 0;
                mov.moving = true;
                break;
            case Direction.SOUTH:
                acc.x = 0;
                acc.y = this.BASE_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_SPEED);
                mov.moving = true;
                break;
            case Direction.WEST:
                acc.x = -this.BASE_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_SPEED);
                acc.y = 0;
                mov.moving = true;
                break;
            case Direction.NORTHEAST:
                acc.x = this.BASE_DIAGONAL_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = -this.BASE_DIAGONAL_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_DIAGONAL_SPEED);
                mov.moving = true;
                break;
            case Direction.SOUTHEAST:
                acc.x = this.BASE_DIAGONAL_ACCELERATION;
                vel.x = min(vel.x, mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = this.BASE_DIAGONAL_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_DIAGONAL_SPEED);
                mov.moving = true;
                break;
            case Direction.SOUTHWEST:
                acc.x = -this.BASE_DIAGONAL_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = this.BASE_DIAGONAL_ACCELERATION;
                vel.y = min(vel.y, mov.speed * this.MAX_DIAGONAL_SPEED);
                mov.moving = true;
                break;
            case Direction.NORTHWEST:
                acc.x = -this.BASE_DIAGONAL_ACCELERATION;
                vel.x = max(vel.x, -mov.speed * this.MAX_DIAGONAL_SPEED);
                acc.y = -this.BASE_DIAGONAL_ACCELERATION;
                vel.y = max(vel.y, -mov.speed * this.MAX_DIAGONAL_SPEED);
                mov.moving = true;
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

    private applySneakingForce(mov: MovementComponent, vel: VelocityComponent, acc: AccelerationComponent): void {
        acc.x *= this.SNEAK_ACCELERATION_FACTOR;
        acc.y *= this.SNEAK_ACCELERATION_FACTOR;
        switch (mov.direction) {
            case Direction.NORTH:
                vel.y = max(vel.y, -mov.speed * this.MAX_SNEAK_SPEED);
                break;
            case Direction.EAST:
                vel.x = min(vel.x, mov.speed * this.MAX_SNEAK_SPEED);
                break;
            case Direction.SOUTH:
                vel.y = min(vel.y, mov.speed * this.MAX_SNEAK_SPEED);
                break;
            case Direction.WEST:
                vel.x = max(vel.x, -mov.speed * this.MAX_SNEAK_SPEED);
                break;
            case Direction.NORTHEAST:
                vel.x = min(vel.x, mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                vel.y = max(vel.y, -mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                break;
            case Direction.SOUTHEAST:
                vel.x = min(vel.x, mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                vel.y = min(vel.y, mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                break;
            case Direction.SOUTHWEST:
                vel.x = max(vel.x, -mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                vel.y = min(vel.y, mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                break;
            case Direction.NORTHWEST:
                vel.x = max(vel.x, -mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                vel.y = max(vel.y, -mov.speed * this.MAX_SNEAK_DIAGONAL_SPEED);
                break;
        }
    }

    private applyRollingForce(mov: MovementComponent, vel: VelocityComponent, acc: AccelerationComponent): void {
        if (mov.rollCounter > mov.rollLength / 2) {
            switch (mov.direction) {
                case Direction.NORTH:
                    acc.x = 0;
                    acc.y = -this.ROLL_ACCELERATION;
                    vel.y = max(vel.y, -mov.speed * this.MAX_ROLL_SPEED);
                    break;
                case Direction.EAST:
                    acc.x = this.ROLL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_SPEED);
                    acc.y = 0;
                    break;
                case Direction.SOUTH:
                    acc.x = 0;
                    acc.y = this.ROLL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_SPEED);
                    break;
                case Direction.WEST:
                    acc.x = -this.ROLL_ACCELERATION;
                    vel.x = max(vel.x, -mov.speed * this.MAX_ROLL_SPEED);
                    acc.y = 0;
                    break;
                case Direction.NORTHEAST:
                    acc.x = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = max(vel.y, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.SOUTHEAST:
                    acc.x = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = min(vel.x, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.SOUTHWEST:
                    acc.x = -this.ROLL_DIAGONAL_ACCELERATION;
                    vel.x = max(vel.x, -mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    acc.y = this.ROLL_DIAGONAL_ACCELERATION;
                    vel.y = min(vel.y, mov.speed * this.MAX_ROLL_DIAGONAL_SPEED);
                    break;
                case Direction.NORTHWEST:
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
