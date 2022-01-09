import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";

const lighterAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    return pickNextSpawnsWithWeightedMap(
      {
        3: 64,
        4: 35,
        5: 1,
      },
      colCount
    );
  },
  spawnEntities: (nextSpawns) => {
    return spawnEntitiesWithRandomSpeed(nextSpawns);
  },
};

export default lighterAsteroids;
