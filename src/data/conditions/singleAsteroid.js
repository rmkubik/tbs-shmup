import randInt from "../../utils/randInt";
import { createAsteroid } from "../entities";

const singleAsteroid = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    return [randInt(0, colCount - 1)];
  },
  spawnEntities: (nextSpawns) => {
    const isDefined = (thing) => thing !== undefined;

    return nextSpawns
      .map((spawn, index) => {
        if (!spawn) {
          return;
        }

        return createAsteroid({ speed: 3, index });
      })
      .filter(isDefined);
  },
};

export default singleAsteroid;
