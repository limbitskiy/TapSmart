import { useDataStore } from "@/store/data.ts";

export const useStoreHelpers = (_section) => {
  const dataStore = useDataStore();
  const section = _section;

  const getLocale = (key, sectionOverride) => {
    return dataStore[sectionOverride ?? section].locale[key];
  };

  const getStoreData = (key, sectionOverride) => {
    return dataStore[sectionOverride ?? section].store[key];
  };

  return {
    getLocale,
    getStoreData,
  };
};
