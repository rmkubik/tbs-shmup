import randInt from "../../utils/randInt";
import WeightedMap from "../../utils/WeightedMap";
import { createAsteroid } from "../entities";

const restoreCard = (card) => {
  if (card.data?.oldCard) {
    // Persist data across cards, but remove the oldCard
    // data that we're restoring now.
    return {
      ...card.data.oldCard,
      data: {
        ...card.data,
        oldCard: undefined,
      },
    };
  }

  return card;
};

const pickNextSpawnsWithWeightedMap = (mapWeights, colCount) => {
  const spawnCountMap = new WeightedMap(mapWeights);

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
};

const spawnEntitiesWithRandomSpeed = (nextSpawns) => {
  const newEntities = [];

  nextSpawns.forEach((spawn, spawnIndex) => {
    if (!spawn) {
      // This index isn't a spawn location
      return;
    }

    let spawnSpeed = randInt(2, 5);

    const newAsteroid = createAsteroid({
      speed: spawnSpeed,
      index: spawnIndex,
    });
    newEntities.push(newAsteroid);
  });

  return newEntities;
};

export {
  restoreCard,
  pickNextSpawnsWithWeightedMap,
  spawnEntitiesWithRandomSpeed,
};
