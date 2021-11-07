import { constructMatrix } from "functional-game-utils";
import convertLetterCoordinatesToLocation from "../../utils/convertLetterCoordinatesToLocation";
import convertLocationToLetterCoordinates from "../../utils/convertLocationToLetterCoordinates";
import omitKey from "../../utils/omitKey.js";
import reduceEntries from "../../utils/reduceEntries.js";
import currentDirectoryModules from "./*.js";

const defaultZones = {
  A1: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  A2: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  A3: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  A4: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  A5: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  B1: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  B2: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  B3: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  B4: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  B5: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  C1: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  C2: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  C3: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  C4: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  C5: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  D1: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  D2: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  D3: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  D4: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  D5: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  E1: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  E2: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  E3: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  E4: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
  E5: {
    name: "Default Name",
    ship: "Speed Racer",
    palette: "default",
  },
};

const zoneModules = omitKey("index")(currentDirectoryModules);
const zoneEntries = Object.entries(zoneModules).map(
  ([zoneModuleKey, zoneModuleValue]) => [zoneModuleKey, zoneModuleValue.default]
);
const importedZones = reduceEntries(zoneEntries);
const zones = {
  ...defaultZones,
  ...importedZones,
};

const getDimensionsFromZones = (zones) => {
  let largestRow = 0;
  let largestCol = 0;

  Object.keys(zones).forEach((letterCoordinates) => {
    const location = convertLetterCoordinatesToLocation(letterCoordinates);

    if (location.row > largestRow) {
      largestRow = location.row;
    }

    if (location.col > largestCol) {
      largestCol = location.col;
    }
  });

  return { width: largestCol + 1, height: largestRow + 1 };
};
const dimensions = getDimensionsFromZones(zones);
const zonesMatrix = constructMatrix((location) => {
  const letterCoordinates = convertLocationToLetterCoordinates(location);

  return zones[letterCoordinates];
}, dimensions);

export default zones;
export { zonesMatrix };
