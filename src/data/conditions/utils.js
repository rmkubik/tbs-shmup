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

export { restoreCard };
