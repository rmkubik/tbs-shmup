const noShoot = {
  onShuffle: (deck) => {
    const noShootDeck = deck.filter((card) => card.effect !== "shoot");

    return noShootDeck;
  },
};

export default noShoot;
