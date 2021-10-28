import reduceEntries from "./reduceEntries";

const omitKey = (omittedKey) => (object) => {
  const entries = Object.entries(object);
  const remainingEntries = entries.filter(([key]) => key !== omittedKey);

  return reduceEntries(remainingEntries);
};

export default omitKey;
