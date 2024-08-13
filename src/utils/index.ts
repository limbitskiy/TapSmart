import { images, assets, sounds } from "@/config.ts";

const assetLibrary = { ...images, ...assets, ...sounds };

export const getAsset = (name) => {
  if (assetLibrary[name].split("/")[0] === "assets") {
    return getAssetURL(assetLibrary[name]);
  } else {
    return assetLibrary[name];
  }
};

export const getAssetURL = (url) => {
  return new URL(`../${url}`, import.meta.url).href;
};
