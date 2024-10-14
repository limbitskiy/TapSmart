import { images, assets, sounds } from "@/config.ts";

const assetLibrary = { ...images, ...assets, ...sounds };

const specialSymbols = {
  bolt: '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#FEAC3E"/><path d="M9.092 5.624c.752 0 1.348.064 1.788.192.448.12.768.336.96.648.192.312.288.752.288 1.32 0 .592-.116 1.044-.348 1.356-.224.304-.604.48-1.14.528v.072c.656.056 1.112.272 1.368.648.264.368.396.884.396 1.548 0 .568-.104 1.008-.312 1.32-.2.312-.516.532-.948.66-.424.12-.976.18-1.656.18-.568 0-1.068-.004-1.5-.012-.424 0-.816-.008-1.176-.024A59.747 59.747 0 0 1 5.72 14l.18-1.512c.208.008.596.016 1.164.024.576.008 1.248.012 2.016.012.288 0 .508-.024.66-.072a.504.504 0 0 0 .324-.312c.064-.152.096-.368.096-.648 0-.296-.032-.524-.096-.684a.54.54 0 0 0-.336-.324c-.152-.064-.376-.096-.672-.096H5.888V9.032h3.144c.248 0 .44-.024.576-.072a.468.468 0 0 0 .288-.276c.056-.136.084-.332.084-.588 0-.248-.028-.436-.084-.564a.472.472 0 0 0-.3-.264c-.144-.048-.348-.072-.612-.072h-1.26c-.36-.008-.688-.008-.984 0-.288 0-.568.012-.84.036L5.72 5.72c.344-.032.676-.052.996-.06.32-.016.672-.024 1.056-.024.384-.008.824-.012 1.32-.012Zm-1.176.096V14H5.72V5.72h2.196Z" fill="#222"/></svg>',
  nut: '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="url(#a)"/><path d="M12.052 5.72v7.488c0 .528-.26.792-.78.792h-1.008c-.24 0-.42-.056-.54-.168a2.244 2.244 0 0 1-.348-.492L7.348 9.812c-.096-.2-.192-.416-.288-.648a5.977 5.977 0 0 1-.24-.696h-.108c.032.232.056.472.072.72.024.24.036.472.036.696V14h-2.1V6.512c0-.528.264-.792.792-.792h.996c.24 0 .416.056.528.168.112.112.232.276.36.492L9.34 9.776c.112.192.22.404.324.636.104.232.204.476.3.732h.108a24.564 24.564 0 0 1-.06-.732c-.016-.24-.024-.48-.024-.72L9.976 5.72h2.076Z" fill="#fff"/><defs><linearGradient id="a" x1="5.368" y1="1.895" x2="14.316" y2="17.105" gradientUnits="userSpaceOnUse"><stop stop-color="#424FD2"/><stop offset="1" stop-color="#680A89"/></linearGradient></defs></svg>',
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

export const shortenNumber = (num: number) => {
  const number = showFormattedNumber(num);
  const numArr = number.split(",");

  if (numArr.length > 3) {
    return "BIG";
  } else if (numArr.length === 3) {
    return Math.round(num / 1000000) + "M";
  }
  // else if (numArr.length === 2) {
  //   return Math.round(num / 1000) + "K";
  // }
  else {
    return number;
  }
};

export const formattedTime = (timer: number) => {
  if (!timer) return "00:00";

  if (timer < 60000) {
    let roundedTimer = Math.round(timer / 1000);

    if (roundedTimer < 0) {
      roundedTimer = 0;
    }

    if (timer > 9000) {
      return "00:" + roundedTimer;
    } else {
      return "00:0" + roundedTimer;
    }
  } else {
    const min = Math.trunc(timer / 60000);
    let sec = Math.round((timer % 60000) / 1000) + "";
    if (sec.length === 1) {
      sec = "0" + sec;
    }
    return "0" + min + ":" + sec;
  }
};

export const getSpecialSymbol = (symbolName: string) => specialSymbols[symbolName];
