import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";

const mediumAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    return pickNextSpawnsWithWeightedMap(
      {
        4: 5,
        5: 45,
        6: 35,
        7: 15,
      },
      colCount
    );
  },
  spawnEntities: (nextSpawns) => {
    return spawnEntitiesWithRandomSpeed(nextSpawns);
  },
};

export default mediumAsteroids;
