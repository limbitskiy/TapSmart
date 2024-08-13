import { images, assets, sounds } from "@/config.ts";
import { useDataStore } from "@/store/data.ts";

const assetLibrary = { ...images, ...assets, ...sounds };

export const getAsset = (name) => {
  return assetLibrary[name];
};

export const getLocale = (section, key) => {
  const dataStore = useDataStore();

  return dataStore[section].locale[key];
};
