import { assets, sounds, essentialAssets, nonEssentialAssets } from "@/config";
import * as htmlToImage from "html-to-image";
import { inviteFriend, addToHomescreen } from "@/api/telegram";
import { storeToRefs } from "pinia";

// stores
import { useMainStore } from "@/store/main";

const assetLibrary = { ...essentialAssets, ...nonEssentialAssets, ...assets, ...sounds };

const specialSymbols = {
  "<bolt>":
    '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#a)" stroke="#FBC44A" stroke-width="2"/><g filter="url(#b)"><path d="M8.496 17c-.24 0-.415-.05-.525-.15-.1-.11-.15-.275-.15-.495V7.46c0-.22.05-.385.15-.495.11-.11.285-.165.525-.165h4.395c1.1 0 1.925.255 2.475.765.55.5.825 1.195.825 2.085 0 .47-.115.89-.345 1.26-.22.37-.525.635-.915.795 1.03.34 1.545 1.095 1.545 2.265 0 .57-.135 1.085-.405 1.545-.26.46-.66.825-1.2 1.095-.53.26-1.19.39-1.98.39H8.496Zm3.975-6.075c.4 0 .71-.1.93-.3.22-.2.33-.49.33-.87 0-.41-.105-.7-.315-.87-.2-.18-.515-.27-.945-.27h-2.175v2.31h2.175Zm.24 4.26c.44 0 .765-.115.975-.345.22-.24.33-.55.33-.93 0-.43-.125-.75-.375-.96-.25-.22-.6-.33-1.05-.33h-2.295v2.565h2.415Z" fill="#fff"/></g><defs><linearGradient id="a" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#E1A300"/><stop offset="1" stop-color="#DB7510"/></linearGradient><filter id="b" x="3.821" y="2.8" width="16.655" height="18.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2448_2276"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2448_2276" result="shape"/></filter></defs></svg>',
  "<bolt_dark>":
    '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#a)" stroke="#484848" stroke-width="2"/><g filter="url(#b)"><path d="M8.496 17c-.24 0-.415-.05-.525-.15-.1-.11-.15-.275-.15-.495V7.46c0-.22.05-.385.15-.495.11-.11.285-.165.525-.165h4.395c1.1 0 1.925.255 2.475.765.55.5.825 1.195.825 2.085 0 .47-.115.89-.345 1.26-.22.37-.525.635-.915.795 1.03.34 1.545 1.095 1.545 2.265 0 .57-.135 1.085-.405 1.545-.26.46-.66.825-1.2 1.095-.53.26-1.19.39-1.98.39H8.496Zm3.975-6.075c.4 0 .71-.1.93-.3.22-.2.33-.49.33-.87 0-.41-.105-.7-.315-.87-.2-.18-.515-.27-.945-.27h-2.175v2.31h2.175Zm.24 4.26c.44 0 .765-.115.975-.345.22-.24.33-.55.33-.93 0-.43-.125-.75-.375-.96-.25-.22-.6-.33-1.05-.33h-2.295v2.565h2.415Z" fill="#FEAC3E"/></g><defs><linearGradient id="a" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#333"/><stop offset="1" stop-color="#222"/></linearGradient><filter id="b" x="3.821" y="2.8" width="16.655" height="18.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2460_2043"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2460_2043" result="shape"/></filter></defs></svg>',
  "<nut>":
    '<svg width="26" height="27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12" fill="url(#a)" stroke="#6C5FDC" stroke-width="2"/><g filter="url(#b)"><path d="M9.738 18c-.24 0-.415-.05-.525-.15-.1-.11-.15-.275-.15-.495v-8.91c0-.22.05-.38.15-.48.11-.11.29-.165.54-.165h.93c.17 0 .294.025.374.075.09.04.185.125.285.255l4.2 5.925V8.46c0-.22.05-.385.15-.495.11-.11.285-.165.526-.165h1.125c.25 0 .424.055.524.165.1.1.15.265.15.495v8.895c0 .22-.05.385-.15.495-.1.1-.274.15-.524.15h-.945a.946.946 0 0 1-.375-.06c-.08-.05-.17-.14-.27-.27l-4.216-5.91v5.595c0 .22-.05.385-.15.495-.1.1-.274.15-.524.15H9.738Z" fill="#fff"/></g><defs><linearGradient id="a" x1="13" y1="0" x2="13" y2="26" gradientUnits="userSpaceOnUse"><stop stop-color="#4747C9"/><stop offset="1" stop-color="#601A99"/></linearGradient><filter id="b" x="5.063" y="3.8" width="16.955" height="18.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2448_2277"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2448_2277" result="shape"/></filter></defs></svg>',
  "<ton>":
    '<svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M8.5 17a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" fill="#0098EA"/><path d="M11.402 4.744H5.597c-1.067 0-1.743 1.151-1.206 2.082l3.582 6.21a.608.608 0 0 0 1.054 0l3.583-6.21c.536-.93-.14-2.082-1.207-2.082Zm-3.432 6.43-.78-1.51-1.883-3.367a.329.329 0 0 1 .29-.492h2.372v5.37l.001-.002Zm3.72-4.878L9.81 9.664l-.78 1.51v-5.37h2.373c.26 0 .413.276.289.492Z" fill="#fff"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h17v17H0z"/></clipPath></defs></svg>',
  "<ads>":
    '<svg width="18" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.447 17a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z" fill="#C75C5C"/><path d="M6.312 7.969H5.25V9.03h1.062V7.97Zm0 1.859H5.25v1.063h1.062V9.828Zm0 1.86H5.25v1.062h1.062v-1.063Zm0-5.578H5.25v1.062h1.062V6.109Zm0-1.86H5.25v1.063h1.062V4.25Zm7.438 3.719h-1.063V9.03h1.063V7.97Zm0 1.859h-1.063v1.063h1.063V9.828Zm0 1.86h-1.063v1.062h1.063v-1.063Zm0-5.578h-1.063v1.062h1.063V6.109Zm0-1.86h-1.063v1.063h1.063V4.25Zm-2.125 0h-4.25v3.719h4.25V4.25Zm0 4.781h-4.25v3.719h4.25V9.031Z" fill="#4F5D73"/><path d="M13.75 3.719h-8.5c-.585 0-1.063.478-1.063 1.062v8.5c0 .585.478 1.063 1.063 1.063h8.5c.584 0 1.062-.478 1.062-1.063v-8.5c0-.584-.478-1.062-1.062-1.062ZM6.312 13.28H5.25v-1.06h1.062v1.062Zm0-1.86H5.25v-1.06h1.062v1.063Zm0-1.858H5.25V8.5h1.062v1.063Zm0-1.86H5.25V6.641h1.062v1.062Zm0-1.86H5.25v-1.06h1.062v1.063Zm5.313 7.438h-4.25V9.562h4.25v3.72Zm0-4.781h-4.25V4.781h4.25V8.5Zm2.125 4.781h-1.063v-1.06h1.063v1.062Zm0-1.86h-1.063v-1.06h1.063v1.063Zm0-1.858h-1.063V8.5h1.063v1.063Zm0-1.86h-1.063V6.641h1.063v1.062Zm0-1.86h-1.063v-1.06h1.063v1.063Z" fill="#231F20" opacity=".2"/><path d="M13.75 3.188h-8.5c-.585 0-1.063.478-1.063 1.062v8.5c0 .584.478 1.063 1.063 1.063h8.5c.584 0 1.062-.479 1.062-1.063v-8.5c0-.584-.478-1.063-1.062-1.063ZM6.312 12.75H5.25v-1.063h1.062v1.063Zm0-1.86H5.25V9.829h1.062v1.063Zm0-1.859H5.25V7.97h1.062v1.06Zm0-1.86H5.25V6.11h1.062v1.063Zm0-1.859H5.25V4.25h1.062v1.063Zm5.313 7.438h-4.25V9.031h4.25v3.719Zm0-4.781h-4.25V4.25h4.25v3.719Zm2.125 4.781h-1.063v-1.063h1.063v1.063Zm0-1.86h-1.063V9.829h1.063v1.063Zm0-1.859h-1.063V7.97h1.063v1.06Zm0-1.86h-1.063V6.11h1.063v1.063Zm0-1.859h-1.063V4.25h1.063v1.063Z" fill="#E0E0D1"/></svg>',
  "<star>":
    '<svg width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.433.804c-.33-.853-1.536-.853-1.866 0L6.085 4.642a1 1 0 0 1-.878.638l-4.108.224C.186 5.554-.187 6.7.522 7.278l2.475 2.013c.191.059.392.09.584.063.541-.075 3.694-.55 5.203-.777.111.027.29.128.114.314s-3.118 1.762-4.566 2.526a2.616 2.616 0 0 0-.6.683l-.74 2.783c-.234.883.742 1.593 1.51 1.096l3.455-2.234a1 1 0 0 1 1.086 0l3.455 2.234c.768.497 1.744-.213 1.51-1.096l-1.057-3.977a1 1 0 0 1 .335-1.032l3.192-2.596c.71-.577.337-1.725-.576-1.774l-4.108-.224a1 1 0 0 1-.879-.638L9.433.804Z" fill="url(#a)"/><defs><linearGradient id="a" x1="2.953" y1="10.702" x2="17.15" y2="5.883" gradientUnits="userSpaceOnUse"><stop stop-color="#F7C20F"/><stop offset="1" stop-color="#FF9B14"/></linearGradient></defs></svg>',
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

export const doAction = (action: string) => {
  const store = useMainStore();

  const { friends: friendsLocale } = storeToRefs(store.localeStore);
  const { sendInviteAnalitycsData, shareToStory } = store;

  switch (action) {
    case "invite": {
      sendInviteAnalitycsData();
      inviteFriend(friendsLocale.value?.["invite_message"] || "Invite message");
      break;
    }
    case "tg_story_editor": {
      shareToStory();
      break;
    }
    case "add_to_home_screen": {
      addToHomescreen();
      break;
    }
  }
};
