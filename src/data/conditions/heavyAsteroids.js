import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";

const mediumAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    return pickNextSpawnsWithWeightedMap(
      {
        6: 10,
        7: 20,
        8: 40,
        9: 20,
        10: 10,
      },
      colCount
    );
  },
  spawnEntities: (nextSpawns) => {
    return spawnEntitiesWithRandomSpeed(nextSpawns);
  },
};

export default mediumAsteroids;
