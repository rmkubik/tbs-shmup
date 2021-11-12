import { defaultDeck } from "../cards";
import sectors, { repeatSectors } from "../sectors";
import shipIcon from "../../../assets/ship1.png";
import asteroidIcon from "../../../assets/asteroid4.png";

export default {
  name: "HEAVY Zone",
  unlock: {
    cost: 4,
  },
  icon: {
    src: asteroidIcon,
    color: "hazardColor",
  },
  mission: {
    winCondition: 3,
    description: "Are you a bad enough dude to get to the end?",
    ship: {
      name: "Speed Racer",
      icon: shipIcon,
      color: "primaryColor",
    },
    theme: "default",
    sectors: repeatSectors([{ conditions: ["heavyAsteroids"] }], 100),
    dimensions: { width: 10, height: 15 },
    playerIndex: 145,
    deck: defaultDeck,
    action: "default", // This should import a function directly, maybe?
    power: 2,
    maxPower: 2,
    drawSize: 3,
  },
  dare: {},
};
