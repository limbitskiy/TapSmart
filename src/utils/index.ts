import { images, assets, sounds } from "@/config";
import * as htmlToImage from "html-to-image";

const assetLibrary = { ...images, ...assets, ...sounds };

const specialSymbols = {
  "<bolt>":
    '<svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#FEAC3E"/><path d="M9.092 5.624c.752 0 1.348.064 1.788.192.448.12.768.336.96.648.192.312.288.752.288 1.32 0 .592-.116 1.044-.348 1.356-.224.304-.604.48-1.14.528v.072c.656.056 1.112.272 1.368.648.264.368.396.884.396 1.548 0 .568-.104 1.008-.312 1.32-.2.312-.516.532-.948.66-.424.12-.976.18-1.656.18-.568 0-1.068-.004-1.5-.012-.424 0-.816-.008-1.176-.024A59.747 59.747 0 0 1 5.72 14l.18-1.512c.208.008.596.016 1.164.024.576.008 1.248.012 2.016.012.288 0 .508-.024.66-.072a.504.504 0 0 0 .324-.312c.064-.152.096-.368.096-.648 0-.296-.032-.524-.096-.684a.54.54 0 0 0-.336-.324c-.152-.064-.376-.096-.672-.096H5.888V9.032h3.144c.248 0 .44-.024.576-.072a.468.468 0 0 0 .288-.276c.056-.136.084-.332.084-.588 0-.248-.028-.436-.084-.564a.472.472 0 0 0-.3-.264c-.144-.048-.348-.072-.612-.072h-1.26c-.36-.008-.688-.008-.984 0-.288 0-.568.012-.84.036L5.72 5.72c.344-.032.676-.052.996-.06.32-.016.672-.024 1.056-.024.384-.008.824-.012 1.32-.012Zm-1.176.096V14H5.72V5.72h2.196Z" fill="#222"/></svg>',
  "<bolt_dark>":
    '<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="#333333"/><path d="M9.092 5.624C9.844 5.624 10.44 5.688 10.88 5.816C11.328 5.936 11.648 6.152 11.84 6.464C12.032 6.776 12.128 7.216 12.128 7.784C12.128 8.376 12.012 8.828 11.78 9.14C11.556 9.444 11.176 9.62 10.64 9.668V9.74C11.296 9.796 11.752 10.012 12.008 10.388C12.272 10.756 12.404 11.272 12.404 11.936C12.404 12.504 12.3 12.944 12.092 13.256C11.892 13.568 11.576 13.788 11.144 13.916C10.72 14.036 10.168 14.096 9.488 14.096C8.92 14.096 8.42 14.092 7.988 14.084C7.564 14.084 7.172 14.076 6.812 14.06C6.46 14.044 6.096 14.024 5.72 14L5.9 12.488C6.108 12.496 6.496 12.504 7.064 12.512C7.64 12.52 8.312 12.524 9.08 12.524C9.368 12.524 9.588 12.5 9.74 12.452C9.9 12.396 10.008 12.292 10.064 12.14C10.128 11.988 10.16 11.772 10.16 11.492C10.16 11.196 10.128 10.968 10.064 10.808C10 10.648 9.888 10.54 9.728 10.484C9.576 10.42 9.352 10.388 9.056 10.388H5.888V9.032H9.032C9.28 9.032 9.472 9.008 9.608 8.96C9.744 8.912 9.84 8.82 9.896 8.684C9.952 8.548 9.98 8.352 9.98 8.096C9.98 7.848 9.952 7.66 9.896 7.532C9.84 7.404 9.74 7.316 9.596 7.268C9.452 7.22 9.248 7.196 8.984 7.196C8.504 7.196 8.084 7.196 7.724 7.196C7.364 7.188 7.036 7.188 6.74 7.196C6.452 7.196 6.172 7.208 5.9 7.232L5.72 5.72C6.064 5.688 6.396 5.668 6.716 5.66C7.036 5.644 7.388 5.636 7.772 5.636C8.156 5.628 8.596 5.624 9.092 5.624ZM7.916 5.72V14H5.72V5.72H7.916Z" fill="#FEAC3E"/></svg>',
  "<nut>":
    '<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="9.5" r="8.5" fill="url(#paint0_linear_244_1769)"/><path d="M12.052 5.72V13.208C12.052 13.736 11.792 14 11.272 14H10.264C10.024 14 9.844 13.944 9.724 13.832C9.612 13.72 9.496 13.556 9.376 13.34L7.348 9.812C7.252 9.612 7.156 9.396 7.06 9.164C6.964 8.932 6.884 8.7 6.82 8.468H6.712C6.744 8.7 6.768 8.94 6.784 9.188C6.808 9.428 6.82 9.66 6.82 9.884V14H4.72V6.512C4.72 5.984 4.984 5.72 5.512 5.72H6.508C6.748 5.72 6.924 5.776 7.036 5.888C7.148 6 7.268 6.164 7.396 6.38L9.34 9.776C9.452 9.968 9.56 10.18 9.664 10.412C9.768 10.644 9.868 10.888 9.964 11.144H10.072C10.048 10.896 10.028 10.652 10.012 10.412C9.996 10.172 9.988 9.932 9.988 9.692L9.976 5.72H12.052Z" fill="white"/><defs><linearGradient id="paint0_linear_244_1769" x1="5.36842" y1="1.89474" x2="14.3158" y2="17.1053" gradientUnits="userSpaceOnUse"><stop stop-color="#424FD2"/><stop offset="1" stop-color="#680A89"/></linearGradient></defs></svg>',
  "<ton>":
    '<svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M8.5 17a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" fill="#0098EA"/><path d="M11.402 4.744H5.597c-1.067 0-1.743 1.151-1.206 2.082l3.582 6.21a.608.608 0 0 0 1.054 0l3.583-6.21c.536-.93-.14-2.082-1.207-2.082Zm-3.432 6.43-.78-1.51-1.883-3.367a.329.329 0 0 1 .29-.492h2.372v5.37l.001-.002Zm3.72-4.878L9.81 9.664l-.78 1.51v-5.37h2.373c.26 0 .413.276.289.492Z" fill="#fff"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h17v17H0z"/></clipPath></defs></svg>',
  "<ads>":
    '<svg width="18" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.447 17a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" fill="#C75C5C"/><path d="M6.312 7.969H5.25V9.03h1.062V7.97Zm0 1.859H5.25v1.063h1.062V9.828Zm0 1.86H5.25v1.062h1.062v-1.063Zm0-5.578H5.25v1.062h1.062V6.109Zm0-1.86H5.25v1.063h1.062V4.25Zm7.438 3.719h-1.063V9.03h1.063V7.97Zm0 1.859h-1.063v1.063h1.063V9.828Zm0 1.86h-1.063v1.062h1.063v-1.063Zm0-5.578h-1.063v1.062h1.063V6.109Zm0-1.86h-1.063v1.063h1.063V4.25Zm-2.125 0h-4.25v3.719h4.25V4.25Zm0 4.781h-4.25v3.719h4.25V9.031Z" fill="#4F5D73"/><path d="M13.75 3.719h-8.5c-.585 0-1.063.478-1.063 1.062v8.5c0 .585.478 1.063 1.063 1.063h8.5c.584 0 1.062-.478 1.062-1.063v-8.5c0-.584-.478-1.062-1.062-1.062ZM6.312 13.28H5.25v-1.06h1.062v1.062Zm0-1.86H5.25v-1.06h1.062v1.063Zm0-1.858H5.25V8.5h1.062v1.063Zm0-1.86H5.25V6.641h1.062v1.062Zm0-1.86H5.25v-1.06h1.062v1.063Zm5.313 7.438h-4.25V9.562h4.25v3.72Zm0-4.781h-4.25V4.781h4.25V8.5Zm2.125 4.781h-1.063v-1.06h1.063v1.062Zm0-1.86h-1.063v-1.06h1.063v1.063Zm0-1.858h-1.063V8.5h1.063v1.063Zm0-1.86h-1.063V6.641h1.063v1.062Zm0-1.86h-1.063v-1.06h1.063v1.063Z" fill="#231F20" opacity=".2"/><path d="M13.75 3.188h-8.5c-.585 0-1.063.478-1.063 1.062v8.5c0 .584.478 1.063 1.063 1.063h8.5c.584 0 1.062-.479 1.062-1.063v-8.5c0-.584-.478-1.063-1.062-1.063ZM6.312 12.75H5.25v-1.063h1.062v1.063Zm0-1.86H5.25V9.829h1.062v1.063Zm0-1.859H5.25V7.97h1.062v1.06Zm0-1.86H5.25V6.11h1.062v1.063Zm0-1.859H5.25V4.25h1.062v1.063Zm5.313 7.438h-4.25V9.031h4.25v3.719Zm0-4.781h-4.25V4.25h4.25v3.719Zm2.125 4.781h-1.063v-1.063h1.063v1.063Zm0-1.86h-1.063V9.829h1.063v1.063Zm0-1.859h-1.063V7.97h1.063v1.06Zm0-1.86h-1.063V6.11h1.063v1.063Zm0-1.859h-1.063V4.25h1.063v1.063Z" fill="#E0E0D1"/></svg>',
  "<star>":
    '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><mask id="a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><path d="m8.389.253 2.045 4.786 5.184.464a.415.415 0 0 1 .238.731L11.932 9.66l1.16 5.077a.416.416 0 0 1-.637.44l-4.459-2.663-4.47 2.675a.416.416 0 0 1-.62-.452l1.16-5.077L.142 6.234a.42.42 0 0 1-.041-.588.429.429 0 0 1 .297-.137l5.172-.464L7.616.253a.415.415 0 0 1 .547-.22.41.41 0 0 1 .226.22Z" fill="#fff"/></mask><g mask="url(#a)"><mask id="b" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-1" y="-1" width="18" height="17"><path d="M16.017-.062H-.043v15.37h16.06V-.063Z" fill="#fff"/></mask><g mask="url(#b)"><path transform="matrix(1 0 0 -1 -.672 15.901)" fill="url(#c)" d="M0 0h18.264v16.267H0z"/></g></g><path d="m8.389.253 2.045 4.786 5.184.464a.415.415 0 0 1 .238.731l-.701.613c-1.909.66-4.412 1.058-7.153 1.058-2.74 0-5.25-.398-7.152-1.058l-.702-.613a.42.42 0 0 1-.041-.588.409.409 0 0 1 .29-.137l5.173-.464L7.616.253a.415.415 0 0 1 .547-.22.41.41 0 0 1 .226.22Z" fill="#FFD401"/><defs><pattern id="c" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#d" transform="scale(.01493 .01667)"/></pattern><image id="d" width="67" height="60" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAlgCWAAD/7AARRHVja3kAAQAEAAAAHgAA/+4AIUFkb2JlAGTAAAAAAQMAEAMCAwYAAAJIAAACsAAAA4b/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoaJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEIADwAQwMBIgACEQEDEQH/xACiAAADAQEBAQAAAAAAAAAAAAAABAUCAQMGAQACAwEAAAAAAAAAAAAAAAAAAwQFBgIQAAIABQMEAwAAAAAAAAAAAAARAQIDBAUTJBUSIzMlMhQ0EQABAQYGAQUAAAAAAAAAAAABABAgEXGhMrECEkJyAzEhUSITFBIAAgADBAgHAQAAAAAAAAAAAQIAEAMhMaEiUXGBkbHRMtIRYRJykjNzQv/aAAwDAQACEQMRAAAA+68SfRyaBPIrKBPAoektl3NMDQREp1Cbmp+jJAbruANsptSOKwGsrkJlKXnLHRkgu0ZA00m2/iyBqqudKto0FikOkNyQ6Ak51h66IGkrP//aAAgBAgABBQC/v7ijccreHK3hbZG6nrmUhu0Is4bkycN2hFnDcmRkljc6chpyFrJLC4P/2gAIAQMAAQUApUpJpNCmaFMnoyQlLeHbQirDtltDtIRWh2y2mjCl1ROqJVmjpn//2gAIAQEAAQUAr14UIcjIcjIcjIcjIcjIcjIUbyWtOZH4MYxjGWH6DJfBjGMYzH/oMp42MYxjMdHcmV8bGMYxmNjujL+NjGMYzGR3RmPExjGMZi/1l/8AV6PUnqT1J6k9SepLL6Guf//aAAgBAgIGPwBqdNgFAX+QbxHWPiI6x8RFNGcFXcA5RcZPqXhOj+iyfUvCdH9FkxNRFsWw+rR5Ax9tPc/bH209z9sUiKiHOtgDdsv/2gAIAQMCBj8ABIti7GLsYJAuEhtm3tMhtm/tMhlJvu8OcdDYc46Gw5w+VhlOjnL/2gAIAQEBBj8ABIJiYeisKsKsKsKsKsK0DKQYRizJMviRZkmcHxIsyTOD4kWdczg+JFnXyOD44lnXyOD44lmT9MdMfjp91vqt9Vvqt9Vvqt9UPz6vsgfPiDP/2Q=="/></defs></svg>',
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
  const result = await htmlToImage.toJpeg(element, { quality: 0.85 });
  return result;
};
