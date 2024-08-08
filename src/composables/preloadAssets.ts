import { images, sounds } from "@/config.ts";
import { Howl, Howler } from "howler";

async function preloadAssets() {
  const result = await Promise.allSettled([
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
              res(sound);
            },
            onloaderror: () => {
              rej(new Error(`Couldn't load sound: '${sounds[key]}'`));
            },
          });
        })
    ),
  ]);

  return result;
}

export default preloadAssets;
