import { images, sounds, fonts } from "@/config.ts";
import { Howl, Howler } from "howler";

async function preloadAssets({ addSound }) {
  return await Promise.allSettled([
    ...Object.keys(fonts).map(
      (key) =>
        new Promise((res, rej) => {
          const font = new FontFace(key, `url(${fonts[key].src})`, {
            weight: fonts[key].weight,
          });

          document.fonts.add(font);

          font
            .load()
            .then(() => res(font))
            .catch(() => rej(new Error(`Couldn't load font: '${key}'`)));
        })
    ),
    ...Object.keys(images).map(
      (key) =>
        new Promise((res, rej) => {
          const image = new Image();
          image.src = images[key];
          image.onload = () => {
            res(image);
          };
          image.onerror = () => {
            rej(new Error(`Couldn't load image: '${images[key]}'`));
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
