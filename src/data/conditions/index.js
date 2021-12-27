import stalling from "./stalling";
import malfunctioning from "./malfunctioning";
import mediumAsteroids from "./mediumAsteroids";
import heavyAsteroids from "./heavyAsteroids";
import lightAsteroids from "./lightAsteroids";
import patternedAsteroidsSlalom from "./patternedAsteroids-slalom";
import noAsteroids from "./noAsteroids";
import noShoot from "./noShoot";
import upOnly from "./upOnly";

const conditions = {
  default: { onShuffle: (deck) => deck },
  stalling,
  malfunctioning,
  mediumAsteroids,
  heavyAsteroids,
  lightAsteroids,
  "patternedAsteroids-slalom": patternedAsteroidsSlalom,
  noAsteroids,
  noShoot,
  upOnly,
};

const findFirstConditionWithSpawns = (sector) => {
  return sector.conditions.find((condition) =>
    Boolean(conditions[condition].chooseNextSpawns)
  );
};

export default conditions;
export { findFirstConditionWithSpawns };
