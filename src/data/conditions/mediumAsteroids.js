import randInt from "../../utils/randInt";
import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";
import { update } from "ramda";
import { createExplodingTriangle, createMetalCube } from "../entities";

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
    const newEntities = spawnEntitiesWithRandomSpeed(nextSpawns);

    return newEntities.map((entity) => {
      if (entity.speed === 3) {
        return createExplodingTriangle({ index: entity.index });
      }

      if (entity.speed === 4) {
        return createMetalCube({ index: entity.index });
      }

      return entity;
    });
  },
};

export default mediumAsteroids;
