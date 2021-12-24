const tutorialDeck1 = {
  onShuffle: (deck) => {
    return [
      {
        name: "Up",
        cost: 1,
        range: 4,
        directions: ["up"],
        selectionStyle: "precise",
      },
      {
        name: "UpRight",
        cost: 1,
        range: 2,
        directions: ["upRight"],
        selectionStyle: "precise",
      },
    ];
  },
};

const tutorialDeck2 = {
  onShuffle: (deck) => {
    return [
      {
        name: "Up",
        cost: 1,
        range: 4,
        directions: ["up"],
        selectionStyle: "precise",
      },
      {
        name: "UpRight",
        cost: 1,
        range: 2,
        directions: ["upRight"],
        selectionStyle: "precise",
      },
    ];
  },
};

export { tutorialDeck1, tutorialDeck2 };
