import randInt from "../../utils/randInt";
import { restoreCard } from "./utils";

const leftRightSwappedNames = {
  Left: "Right",
  Right: "Left",
  UpLeft: "UpRight",
  UpRight: "UpLeft",
  DownLeft: "DownRight",
  DownRight: "DownLeft",
};

const malfunctioning = {
  onShuffle: (deck) => {
    // Reset cards to their old values
    const restoredDeck = deck.map(restoreCard);

    const swappedDeck = restoredDeck.map((card) => {
      if (
        !card.directions.some(
          (direction) => direction === "left" || direction === "right"
        )
      ) {
        // If a card does not have a left or right direction, this rule does not apply
        return card;
      }

      // 50/50 chance to swap this card's directions
      const shouldSwap = randInt(0, 1) === 0;

      if (!shouldSwap) {
        return card;
      }

      const newCard = {
        ...card,
        directions: card.directions.map((direction) => {
          switch (direction) {
            case "left":
              return "right";
            case "right":
              return "left";
            default:
              return direction;
          }
        }),
        name: leftRightSwappedNames[card.name],
        data: {
          ...card.data,
          oldCard: card,
        },
      };

      return newCard;
    });

    return swappedDeck;
  },
};

export default malfunctioning;
