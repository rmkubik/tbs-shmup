const asteroidPatterns = {
  slalom: `...???????
           ..........
           ???????...
           ..........
           5555555555`,
  kreldfarr: `.......333
              ..........
              ...4444...
              ..........
              222.......
              ..........
              ...5555...
              ..........`,
  hwaranklex: `333....333
               ..........
               ...????...
               ..........
               555....555
               ..........
               ...????...
               ..........
               .22.22.22.`,
  wildRoids: `..2.55.2..
              22......44
              44.????.22
              ..........
              5.25..52.5
              ..........
              ...????...
              ..........
              .???..???.`,
};

const doesSectorHavePatternedAsteroids = (sector) => {
  if (!sector) {
    return false;
  }

  return sector.conditions.some((condition) =>
    condition.includes("patternedAsteroids")
  );
};

const getCurrentSpawnPattern = (sector) => {
  if (!doesSectorHavePatternedAsteroids(sector)) {
    // Default to the slalom pattern
    return asteroidPatterns.slalom;
  }

  const conditionKey = sector.conditions.find((condition) =>
    condition.includes("patternedAsteroids")
  );

  const [, patternKey] = conditionKey.split("-");

  return asteroidPatterns[patternKey];
};

export { doesSectorHavePatternedAsteroids, getCurrentSpawnPattern };
export default asteroidPatterns;