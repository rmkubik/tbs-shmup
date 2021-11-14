import findAllMatchingIndices from "../../utils/findAllMatchingIndices";

const slalomAsteroids = {
  chooseNextSpawns: (colCount, sector, turnCount, spawnPattern) => {
    const pattern = spawnPattern
      .split("\n")
      .map((string) => string.trim().split(""));

    const currentPattern = pattern[turnCount % pattern.length];

    return findAllMatchingIndices(currentPattern, (val) => val !== ".");
  },
  spawnEntities: (nextSpawns) => {},
};

export default slalomAsteroids;
