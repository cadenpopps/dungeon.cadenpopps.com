import { max, min, round } from "../../lib/PoppsMath.js";
import { CType } from "../Component.js";
import { Direction } from "../Components/DirectionComponent.js";
import { System, SystemType } from "../System.js";
export default class MovementSystem extends System {
    BASE_ACCELERATION = 0.03;
    BASE_DIAGONAL_ACCELERATION = round(this.BASE_ACCELERATION / 1.4, 5);
    MAX_SPEED = 0.005;
    MAX_DIAGONAL_SPEED = round(this.MAX_SPEED / 1.4, 5);
    ROLL_ACCELERATION = round(this.BASE_ACCELERATION * 5, 5);
    ROLL_DIAGONAL_ACCELERATION = round(this.BASE_DIAGONAL_ACCELERATION * 5, 5);
    MAX_ROLL_SPEED = round(this.MAX_SPEED * 1.5, 5);
    MAX_ROLL_DIAGONAL_SPEED = round(this.MAX_DIAGONAL_SPEED * 1.5, 5);
    ROLL_VELOCITY_DAMPER = 0.6;
    EXTRA_FRICTION = 0.8;
    constructor(eventManager, entityManager) {
        super(SystemType.Movement, eventManager, entityManager, [
            CType.Movement,
            CType.Direction,
            CType.Position,
            CType.Velocity,
            CType.Acceleration,
        ]);
    }
    logic() {
        for (let entityId of this.entities) {
            const entity = this.entityManager.getEntity(entityId);
            const mov = entity.get(CType.Movement);
            mov.walking = false;
            const dir = entity.get(CType.Direction);
            const vel = entity.get(CType.Velocity);
            const acc = entity.get(CType.Acceleration);
            if (entity.has(CType.Controller)) {
                this.determineWalking(entityId);
                this.determineRolling(entityId);
            }
            if (mov.rolling) {
                this.applyRollingForce(mov, vel, acc, dir);
            }
            else if (mov.walking) {
                this.applyWalkingForce(mov, vel, acc, dir);
            }
            else {
                this.applyStoppingForce(vel, acc);
            }
        }
    }
    determineWalking(entityId) {
        const mov = this.entityManager.get(entityId, CType.Movement);
        const con = this.entityManager.get(entityId, CType.Controller);
        if (con.up || con.right || con.down || con.left) {
            mov.walking = true;
        }
    }
    determineRolling(entityId) {
        const mov = this.entityManager.get(entityId, CType.Movement);
        const con = this.entityManager.get(entityId, CType.Controller);
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
    applyStoppingForce(vel, acc) {
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
    applyWalkingForce(mov, vel, acc, dir) {
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
        }
        else if (acc.x > 0) {
            if (vel.x < 0) {
                vel.x *= this.EXTRA_FRICTION;
            }
        }
        else if (acc.x < 0) {
            if (vel.x > 0) {
                vel.x *= this.EXTRA_FRICTION;
            }
        }
        if (acc.y === 0) {
            vel.y *= this.EXTRA_FRICTION;
        }
        else if (acc.y > 0) {
            if (vel.y < 0) {
                vel.y *= this.EXTRA_FRICTION;
            }
        }
        else if (acc.y < 0) {
            if (vel.y > 0) {
                vel.y *= this.EXTRA_FRICTION;
            }
        }
    }
    applyRollingForce(mov, vel, acc, dir) {
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
//# sourceMappingURL=MovementSystem.js.map