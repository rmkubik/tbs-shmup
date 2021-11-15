import randInt from "../../utils/randInt";
import {
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
} from "./utils";
import { update } from "ramda";
import { createMetalCube } from "../entities";

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

    const metalCubeIndex = randInt(0, newEntities.length - 1);

    return update(
      metalCubeIndex,
      createMetalCube({ index: newEntities[metalCubeIndex].index }),
      newEntities
    );
  },
};

export default mediumAsteroids;
