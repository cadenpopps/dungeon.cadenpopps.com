import { Component, CType } from "../Component.js";

export default class MovementComponent extends Component {
    public speed: number;
    public walking: boolean;
    public sneaking: boolean;
    public rolling: boolean;
    public rollLength: number;
    public rollCounter: number;
    public rollCooldownLength: number;
    public rollCooldown: number;

    constructor(speed: number = 30, rollLength: number = 12, rollCooldownLength: number = 70) {
        super(CType.Movement);
        this.speed = speed;
        this.walking = false;
        this.sneaking = false;
        this.rolling = false;
        this.rollLength = rollLength;
        this.rollCounter = 0;
        this.rollCooldownLength = rollCooldownLength;
        this.rollCooldown = 0;
    }
}
