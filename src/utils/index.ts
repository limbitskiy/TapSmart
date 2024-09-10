import { images, assets, sounds } from "@/config.ts";

const assetLibrary = { ...images, ...assets, ...sounds };

export const getAsset = (name) => {
  if (!assetLibrary[name]) {
    console.error(`Asset not found: ${name}`);
    return;
  }

  if (assetLibrary[name].split("/")[0] === "assets") {
    return getAssetURL(assetLibrary[name]);
  } else {
    return assetLibrary[name];
  }
};

export const getAssetURL = (url) => {
  return new URL(`../${url}`, import.meta.url).href;
};

export const showFormattedNumber = (number) => {
  return new Intl.NumberFormat("en-US", { style: "decimal" }).format(number);
};

export const waitFor = (ms: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
};
