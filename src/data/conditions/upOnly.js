const upOnly = {
  onShuffle: (deck) => {
    const upOnlyDeck = deck.filter((card) =>
      card.directions.some((direction) =>
        direction.toLowerCase().includes("up")
      )
    );

    return upOnlyDeck;
  },
};

export default upOnly;
