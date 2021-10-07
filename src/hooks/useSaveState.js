import { useEffect, useState } from "preact/hooks";

const useSaveState = ({ storageKey, savedFields = [[]] }) => {
  const [isSaveLoaded, setIsSaveLoaded] = useState(false);

  useEffect(() => {
    let localStorageData;

    try {
      localStorageData = localStorage.getItem(storageKey) || {};
      const saveData = JSON.parse(localStorageData);

      savedFields.forEach(([key, value, setter]) => {
        if (saveData[key] !== undefined) {
          setter(saveData[key]);
        }
      });

      console.log("Loaded save.");
    } catch (err) {
      console.error(
        `Error occurred trying to read saveData from local storage key "${storageKey}". Continuing with default start.`
      );
      console.error({ localStorageData });
      console.error(err);
    }

    setIsSaveLoaded(true);
  }, []);

  useEffect(
    () => {
      try {
        console.log("Saving progress...");

        const saveObject = savedFields.reduce((object, [key, value]) => {
          return {
            ...object,
            [key]: value,
          };
        }, {});
        const saveData = JSON.stringify(saveObject);

        localStorage.setItem(storageKey, saveData);

        console.log("Progress saved...");
      } catch (err) {
        console.error("An error occurred trying to save game.");
        console.error(err);
      }
    },
    savedFields.map(([key, value]) => value)
  );

  return isSaveLoaded;
};

export default useSaveState;
