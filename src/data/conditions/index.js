import { stallCard } from "../cards";
import randInt from "../../utils/randInt";
import set from "../../utils/set";

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

const leftRightSwappedNames = {
  Left: "Right",
  Right: "Left",
  UpLeft: "UpRight",
  UpRight: "UpLeft",
  DownLeft: "DownRight",
  DownRight: "DownLeft",
};

const conditions = {
  default: { onShuffle: (deck) => deck },
  stalling: {
    onShuffle: (deck) => {
      // Remove stall cards that were used and already
      // in the deck.
      const stallsRemovedDeck = deck.map(restoreCard);

      const randomIndex = randInt(0, stallsRemovedDeck.length - 1);
      const randomCard = stallsRemovedDeck[randomIndex];

      const stallAddedDeck = set(stallsRemovedDeck, randomIndex, {
        // Make this card into a stallCard
        ...stallCard,
        data: {
          // Save any old data, and set our random card
          // as the oldCard so that we can restore it
          // later.
          ...(randomCard.data ?? {}),
          oldCard: randomCard,
        },
      });

      return stallAddedDeck;
    },
  },
  malfunctioning: {
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
  },
};

export default conditions;
