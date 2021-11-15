import { update } from "ramda";
import randInt from "../../utils/randInt";
import { createMetalCube } from "../entities";
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
    const newEntities = spawnEntitiesWithRandomSpeed(nextSpawns);

    return newEntities.map((entity) => {
      if (entity.speed === 4) {
        return createMetalCube({ index: entity.index });
      }

      return entity;
    });
  },
};

export default mediumAsteroids;
