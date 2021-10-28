function reduceEntries(entries) {
  return entries.reduce(
    (object, [key, value]) => ({
      ...object,
      [key]: value,
    }),
    {}
  );
}

export default reduceEntries;
