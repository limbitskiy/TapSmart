import { sounds, fonts, assets, essentialAssets } from "@/config.ts";
import { Howl, Howler } from "howler";
import { getAssetURL } from "@/utils";

async function preloadAssets({ addSound }) {
  return await Promise.allSettled([
    ...Object.keys(fonts).map(
      (key) =>
        new Promise((res, rej) => {
          const font = new FontFace(key, `url(${getAssetURL(fonts[key].src)}`, {
            weight: fonts[key].weight,
          });

          document.fonts.add(font);

          font
            .load()
            .then(() => res(font))
            .catch((err) => {
              console.error(err);
              rej(new Error(`Couldn't load font: '${key}'`));
            });
        })
    ),
    ...Object.keys(assets).map(
      (key) =>
        new Promise((res, rej) => {
          const image = new Image();
          image.src = getAssetURL(assets[key]);
          image.onload = () => {
            res(image);
          };
          image.onerror = () => {
            rej(new Error(`Couldn't load image: '${assets[key]}'`));
          };
        })
    ),
    ...Object.keys(essentialAssets).map(
      (key) =>
        new Promise((res, rej) => {
          const image = new Image();
          image.src = essentialAssets[key];
          image.onload = () => {
            res(image);
          };
          image.onerror = () => {
            rej(new Error(`Couldn't load image: '${essentialAssets[key]}'`));
          };
        })
    ),
    ...Object.keys(sounds).map(
      (key) =>
        new Promise((res, rej) => {
          const sound = new Howl({
            src: sounds[key],
            volume: 0.3,
            loop: true,
            onload: () => {
              addSound(key, sound);
              res(sound);
            },
            onloaderror: () => {
              rej(new Error(`Couldn't load sound: '${sounds[key]}'`));
            },
          });
        })
    ),
  ]);
}

export default preloadAssets;
