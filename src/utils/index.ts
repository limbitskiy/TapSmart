import { images, assets, sounds } from "@/config.ts";

const assetLibrary = { ...images, ...assets, ...sounds };

const specialSymbols = {
  bolt: '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#FEAC3E"/><path d="M9.092 5.624c.752 0 1.348.064 1.788.192.448.12.768.336.96.648.192.312.288.752.288 1.32 0 .592-.116 1.044-.348 1.356-.224.304-.604.48-1.14.528v.072c.656.056 1.112.272 1.368.648.264.368.396.884.396 1.548 0 .568-.104 1.008-.312 1.32-.2.312-.516.532-.948.66-.424.12-.976.18-1.656.18-.568 0-1.068-.004-1.5-.012-.424 0-.816-.008-1.176-.024A59.747 59.747 0 0 1 5.72 14l.18-1.512c.208.008.596.016 1.164.024.576.008 1.248.012 2.016.012.288 0 .508-.024.66-.072a.504.504 0 0 0 .324-.312c.064-.152.096-.368.096-.648 0-.296-.032-.524-.096-.684a.54.54 0 0 0-.336-.324c-.152-.064-.376-.096-.672-.096H5.888V9.032h3.144c.248 0 .44-.024.576-.072a.468.468 0 0 0 .288-.276c.056-.136.084-.332.084-.588 0-.248-.028-.436-.084-.564a.472.472 0 0 0-.3-.264c-.144-.048-.348-.072-.612-.072h-1.26c-.36-.008-.688-.008-.984 0-.288 0-.568.012-.84.036L5.72 5.72c.344-.032.676-.052.996-.06.32-.016.672-.024 1.056-.024.384-.008.824-.012 1.32-.012Zm-1.176.096V14H5.72V5.72h2.196Z" fill="#222"/></svg>',
};

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
  return new Intl.NumberFormat("en-US", { style: "decimal" }).format(Math.round(number));
};

export const waitFor = (ms: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
};

export const getSpecialSymbol = (symbolName: string) => specialSymbols[symbolName];
