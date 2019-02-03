function Skeleton(x, y, stats, type) {
    Mob.call(this, x, y, stats);
    Skeleton.prototype = Object.create(Mob.prototype);
    Skeleton.prototype.constructor = Skeleton;

    this.type = type;

    console.log(this.type);
}