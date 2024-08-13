import { useDataStore } from "@/store/data.ts";

export const useStoreHelpers = (_section) => {
  const dataStore = useDataStore();
  const section = _section;

  const getLocale = (key) => {
    return dataStore[section].locale[key];
  };

  const getStoreData = (key) => {
    return dataStore[section].store[key];
  };

  return {
    getLocale,
    getStoreData,
  };
};
