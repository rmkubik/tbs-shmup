import { weaverDeck } from "../cards";
import sectors from "../sectors";
import shipIcon from "../../../assets/ship2.png";

export default {
  name: "Weaver Zone",
  unlock: {
    cost: 3,
  },
  mission: {
    winCondition: 3,
    ship: {
      name: "The Weaver",
      icon: shipIcon,
    },
    theme: "default",
    sectors,
    dimensions: { width: 10, height: 15 },
    playerIndex: 145,
    deck: weaverDeck,
    action: "default",
    power: 2,
    maxPower: 2,
    drawSize: 3,
  },
  dare: {},
};
