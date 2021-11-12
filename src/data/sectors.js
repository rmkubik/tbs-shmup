import concatMany from "../utils/concatMany";
import repeat from "../utils/repeat";

const repeatSectors = (sectors, times) => {
  return concatMany(repeat(sectors, times));
};

let sectors = [
  { conditions: ["mediumAsteroids", "checkpoint"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["mediumAsteroids"] },
  { conditions: ["heavyAsteroids"] },
  ...repeatSectors(
    [
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["mediumAsteroids"] },
      { conditions: ["heavyAsteroids"] },
    ],
    3
  ),
];

export default sectors;
export { repeatSectors };
