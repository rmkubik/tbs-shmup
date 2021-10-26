import randInt from "../../utils/randInt";
import set from "set-value";
import { stallCard } from "../cards";
import { restoreCard } from "./utils";

const stalling = {
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
};

export default stalling;
