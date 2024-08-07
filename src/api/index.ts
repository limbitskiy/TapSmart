import axios from "axios";
import { Howl, Howler } from "howler";

export const fetchSounds = async () => {
  //   return await axios.get("https://httpbin.org/delay/4");
  return new Promise((res, rej) => {
    const sound = new Howl({
      src: ["/soundtrack.mp3"],
      volume: 0.3,
      loop: true,
      onload: () => {
        res(sound);
      },
    });
  });
};

export const fetchInitData = async () => {
  return await axios.get("https://httpbin.org/delay/2");
};
