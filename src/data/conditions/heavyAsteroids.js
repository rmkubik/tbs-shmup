import randInt from "../../utils/randInt";
import WeightedMap from "../../utils/WeightedMap";

const heavyAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    const spawnCountMap = new WeightedMap({
      6: 10,
      7: 20,
      8: 40,
      9: 20,
      10: 10,
    });

    const spawnCount = parseInt(spawnCountMap.pickRandom());

    const indices = [];

    let iterationCount = 0;

    // Try up to 100 times to place spawnCount amount of asteroids
    while (indices.length < spawnCount && iterationCount < 100) {
      iterationCount += 1;

      // Choose random int in top row
      const spawnIndex = randInt(0, colCount - 1);

      if (indices.some((index) => index === spawnIndex)) {
        // Skip indices we've already chosen
        continue;
      }

      indices.push(spawnIndex);
    }

    return indices;
  },
  spawnEntities: (nextSpawns) => {},
};

export default heavyAsteroids;
