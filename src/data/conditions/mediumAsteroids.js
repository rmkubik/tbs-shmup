import randInt from "../../utils/randInt";
import WeightedMap from "../../utils/WeightedMap";
import asteroidIcon1 from "../../../assets/asteroid1.png";
import asteroidIcon2 from "../../../assets/asteroid2.png";
import asteroidIcon3 from "../../../assets/asteroid3.png";
import asteroidIcon4 from "../../../assets/asteroid4.png";

const mediumAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    const spawnCountMap = new WeightedMap({
      4: 5,
      5: 45,
      6: 35,
      7: 15,
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
  spawnEntities: (nextSpawns) => {
    const newEntities = [];

    nextSpawns.forEach((spawn, spawnIndex) => {
      if (!spawn) {
        // This index isn't a spawn location
        return;
      }

      let spawnSpeed = randInt(2, 5);

      // TODO: We should probably make a createAsteroid
      // factory function that can make this logic
      // reusable and consistent across any number of
      // different sector conditions.
      // I think we'd probably want to create a new
      // data/entities section to contain this.
      let img;

      if (spawnSpeed <= 2) {
        img = asteroidIcon1;
      } else if (spawnSpeed > 2 && spawnSpeed <= 3) {
        img = asteroidIcon2;
      } else if (spawnSpeed > 3 && spawnSpeed <= 4) {
        img = asteroidIcon3;
      } else if (spawnSpeed >= 5) {
        img = asteroidIcon4;
      }

      newEntities.push({
        name: "🪨",
        speed: spawnSpeed,
        index: spawnIndex,
        img,
        color: "hazardColor",
      });
    });

    console.log({ nextSpawns, newEntities });

    return newEntities;
  },
};

export default mediumAsteroids;
