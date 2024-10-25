import { images, assets, sounds } from "@/config";
import * as htmlToImage from "html-to-image";
// import { toPng } from "html-to-image";

const assetLibrary = { ...images, ...assets, ...sounds };

const specialSymbols = {
  "<bolt>":
    '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#FEAC3E"/><path d="M9.092 5.624c.752 0 1.348.064 1.788.192.448.12.768.336.96.648.192.312.288.752.288 1.32 0 .592-.116 1.044-.348 1.356-.224.304-.604.48-1.14.528v.072c.656.056 1.112.272 1.368.648.264.368.396.884.396 1.548 0 .568-.104 1.008-.312 1.32-.2.312-.516.532-.948.66-.424.12-.976.18-1.656.18-.568 0-1.068-.004-1.5-.012-.424 0-.816-.008-1.176-.024A59.747 59.747 0 0 1 5.72 14l.18-1.512c.208.008.596.016 1.164.024.576.008 1.248.012 2.016.012.288 0 .508-.024.66-.072a.504.504 0 0 0 .324-.312c.064-.152.096-.368.096-.648 0-.296-.032-.524-.096-.684a.54.54 0 0 0-.336-.324c-.152-.064-.376-.096-.672-.096H5.888V9.032h3.144c.248 0 .44-.024.576-.072a.468.468 0 0 0 .288-.276c.056-.136.084-.332.084-.588 0-.248-.028-.436-.084-.564a.472.472 0 0 0-.3-.264c-.144-.048-.348-.072-.612-.072h-1.26c-.36-.008-.688-.008-.984 0-.288 0-.568.012-.84.036L5.72 5.72c.344-.032.676-.052.996-.06.32-.016.672-.024 1.056-.024.384-.008.824-.012 1.32-.012Zm-1.176.096V14H5.72V5.72h2.196Z" fill="#222"/></svg>',
  "<bolt_dark>":
    '<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#333333"/><path d="M9.092 5.624C9.844 5.624 10.44 5.688 10.88 5.816C11.328 5.936 11.648 6.152 11.84 6.464C12.032 6.776 12.128 7.216 12.128 7.784C12.128 8.376 12.012 8.828 11.78 9.14C11.556 9.444 11.176 9.62 10.64 9.668V9.74C11.296 9.796 11.752 10.012 12.008 10.388C12.272 10.756 12.404 11.272 12.404 11.936C12.404 12.504 12.3 12.944 12.092 13.256C11.892 13.568 11.576 13.788 11.144 13.916C10.72 14.036 10.168 14.096 9.488 14.096C8.92 14.096 8.42 14.092 7.988 14.084C7.564 14.084 7.172 14.076 6.812 14.06C6.46 14.044 6.096 14.024 5.72 14L5.9 12.488C6.108 12.496 6.496 12.504 7.064 12.512C7.64 12.52 8.312 12.524 9.08 12.524C9.368 12.524 9.588 12.5 9.74 12.452C9.9 12.396 10.008 12.292 10.064 12.14C10.128 11.988 10.16 11.772 10.16 11.492C10.16 11.196 10.128 10.968 10.064 10.808C10 10.648 9.888 10.54 9.728 10.484C9.576 10.42 9.352 10.388 9.056 10.388H5.888V9.032H9.032C9.28 9.032 9.472 9.008 9.608 8.96C9.744 8.912 9.84 8.82 9.896 8.684C9.952 8.548 9.98 8.352 9.98 8.096C9.98 7.848 9.952 7.66 9.896 7.532C9.84 7.404 9.74 7.316 9.596 7.268C9.452 7.22 9.248 7.196 8.984 7.196C8.504 7.196 8.084 7.196 7.724 7.196C7.364 7.188 7.036 7.188 6.74 7.196C6.452 7.196 6.172 7.208 5.9 7.232L5.72 5.72C6.064 5.688 6.396 5.668 6.716 5.66C7.036 5.644 7.388 5.636 7.772 5.636C8.156 5.628 8.596 5.624 9.092 5.624ZM7.916 5.72V14H5.72V5.72H7.916Z" fill="#FEAC3E"/></svg>',
  "<nut>":
    '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="url(#a)"/><path d="M12.052 5.72v7.488c0 .528-.26.792-.78.792h-1.008c-.24 0-.42-.056-.54-.168a2.244 2.244 0 0 1-.348-.492L7.348 9.812c-.096-.2-.192-.416-.288-.648a5.977 5.977 0 0 1-.24-.696h-.108c.032.232.056.472.072.72.024.24.036.472.036.696V14h-2.1V6.512c0-.528.264-.792.792-.792h.996c.24 0 .416.056.528.168.112.112.232.276.36.492L9.34 9.776c.112.192.22.404.324.636.104.232.204.476.3.732h.108a24.564 24.564 0 0 1-.06-.732c-.016-.24-.024-.48-.024-.72L9.976 5.72h2.076Z" fill="#fff"/><defs><linearGradient id="a" x1="5.368" y1="1.895" x2="14.316" y2="17.105" gradientUnits="userSpaceOnUse"><stop stop-color="#424FD2"/><stop offset="1" stop-color="#680A89"/></linearGradient></defs></svg>',
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

export const showFormattedNumber = (number) => new Intl.NumberFormat("en-US", { style: "decimal" }).format(Math.round(number));

export const waitFor = (ms: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
};

export const shortenNumber = (num?: number) => {
  if (!num) return 0;
  if (num <= 999999) {
    return showFormattedNumber(num);
  } else {
    return showFormattedNumber(Math.round(num).toString().slice(0, -3)) + "K";
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

export const replaceWithSpecialSymbols = (text?: string) => {
  if (!text) return "";
  let result = text;

  Object.keys(specialSymbols).forEach((symbol) => {
    result = result.replace(new RegExp(symbol), specialSymbols[symbol]);
  });

  return result;
};

export const sliceTextAmount = (text: string, charLength?: number) => {
  if (!charLength || text.length <= charLength) return text;
  return text.slice(0, charLength) + "...";
};

export const takeScreenshot = async (element: HTMLElement) => {
  console.log(`taking screenshot`);
  const result = await htmlToImage.toPng(element);
  return result;
};

// htmlToImage
//   .toPng(element)
//   .then((dataURL) => {
//     const image = new Image();
//     image.src = dataURL;

//     image.onload = async () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = image.width;
//       canvas.height = image.height;

//       ctx.drawImage(image, 0, 0);

//       ctx.fillRect(0, 0, image.width, 18);
//       ctx.font = "14px sans-serif";
//       ctx.fillStyle = "white";
//       ctx.fillText("Played at @Tapsmart in Telegram", image.width / 2 - 105, 14);

//       const resultBase64 = canvas.toDataURL("image/png");

//       // testing image size
//       // const testImage = new Image();
//       // testImage.src = resultBase64;
//       // testImage.onload = () => {
//       //   console.log("width:", testImage.width);
//       //   console.log("height:", testImage.height);
//       // };

//       res(resultBase64);
//     };
//   })
//   .catch((e) => {
//     console.error(e);
//   });
