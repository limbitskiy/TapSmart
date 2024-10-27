import { tg } from "@/api/telegram";
import { getAsset, takeScreenshot } from "@/utils";

const createFinalImage = (image, data, screenshotArray) =>
  new Promise((res, rej) => {
    const bgSrc = getAsset("battle_results_final");

    const fgImage = new Image();
    fgImage.src = image;
    const bgImage = new Image();
    bgImage.src = bgSrc;

    fgImage.onload = () => {
      bgImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(bgImage, 0, 0);
        ctx?.drawImage(fgImage, 32, canvas.height / 2 + 55);

        ctx.fillRect(0, 0, canvas.width, 18);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "white";
        const textWidth = ctx?.measureText(data.value?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram").width;
        ctx.fillText(data.value?.["story_call_to_action"] ?? "Played at @Tapsmart in Telegram", canvas.width / 2 - textWidth / 2, 14);

        const dataURL = canvas.toDataURL();
        screenshotArray.value?.push(dataURL);
        res(true);
      };
    };
  });

export const handleBattleScreeshots = (data, screenshotArray, leaderboardRef, useFetch, generatingStory) => {
  console.log(`generatingStory.value = true`);

  takeScreenshot(leaderboardRef.value)
    .then(async (image) => {
      // screenshotArray.value?.push(image);
      // console.log(image);
      console.log(`creating final image`);

      await createFinalImage(image, data, screenshotArray);
      console.log(`final image created`);

      console.log(`starting usefetch`);
      try {
        const res = await useFetch({ key: "tg_story", data: { images: screenshotArray.value } })!;
        console.log(`got usefetch response. sharing to story`);
        tg.shareToStory(res.data.url, { text: data.value?.["story_text"], widget_link: { url: data.value?.["story_link"], name: "Подключайся к баттлам" } });
      } catch (error) {
        console.error(error);
        console.log(`generatingStory.value = false`);
        generatingStory.value = false;
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(`generatingStory.value = false`);
      generatingStory.value = false;
    })
    .finally(() => {
      console.log(`finally`);
      generatingStory.value = false;
      screenshotArray.value = [];
    });
};
