import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";

const mediumAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    return pickNextSpawnsWithWeightedMap(
      {
        3: 40,
        4: 30,
        5: 25,
        6: 5,
      },
      colCount
    );
  },
  spawnEntities: (nextSpawns) => {
    return spawnEntitiesWithRandomSpeed(nextSpawns);
  },
};

export default mediumAsteroids;
