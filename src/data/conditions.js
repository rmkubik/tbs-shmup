const conditions = {
  "left-offline": {
    onShuffle: (deck) => {
      console.log({ deck });
      return [deck[0]];
    },
  },
  mediumAsteroids: {
    onShuffle: (deck) => {
      console.log("mediumAsteroids", { deck });
      return deck.slice(0, 2);
    },
  },
};

export default conditions;
