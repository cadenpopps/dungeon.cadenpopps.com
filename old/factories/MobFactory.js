function MobFactory() {

    const HEALTH_LEVEL_MULT = 2;
    const STRENGTH_LEVEL_MULT = 1;
    const INTELLIGENCE_LEVEL_MULT = 1;
    const MAGIC_LEVEL_MULT = 1;


    this.createMob = function (x, y, type, currentLevel) {

        stats = [];
        stats[0] = MOB_INFO[type].bHealth + (currentLevel * HEALTH_LEVEL_MULT);
        stats[1] = MOB_INFO[type].bStrength + (currentLevel * STRENGTH_LEVEL_MULT);
        stats[2] = MOB_INFO[type].bIntelligence + (currentLevel * INTELLIGENCE_LEVEL_MULT);
        stats[3] = MOB_INFO[type].bMagic + (currentLevel * MAGIC_LEVEL_MULT);
        type = type;


        return new Skeleton(x, y, stats, type);

    }


}