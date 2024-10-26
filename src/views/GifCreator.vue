<template>
  <div class="scene-cnt flex-1 flex">
    <div ref="el" class="scene flex-1 relative">
      <!-- vs container -->
      <div v-if="scenes[currentScene] === 'vs'" class="vs-container w-full grid gap-8 place-items-center">
        <div class="first-player exo-black text-[10vw]" :style="`color: ${getPlayerColor(leaderboardSorted[0])}`">
          <span>{{ leaderboardSorted[0].name }}</span>
        </div>

        <div class="vs">
          <img class="w-[40vw] contain" :src="getAsset('vs')" />
        </div>
        <div class="second-player exo-black text-[10vw]" :style="`color: ${getPlayerColor(leaderboardSorted[1])}`">
          <span>{{ leaderboardSorted[1].name }}</span>
        </div>
      </div>

      <!-- battle scene -->
      <div v-else-if="scenes[currentScene] === 'battle'" class="battle-scene-cnt absolute inset-0 p-4 pt-8 flex-1 flex flex-col">
        <div class="title text-center z-10 bg-[#222] absolute top-0 left-0 right-0">
          <span class="text-sm exo-bold" style="background: linear-gradient(to right, #418afc, #864a9c); -webkit-background-clip: text; -webkit-text-fill-color: transparent"
            >Played at @Tapsmart in Telegram</span
          >
        </div>

        <BackgroundImage type="red" />

        <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
          <ChallengeStatus :timer="30000" :score="120" :position="[1, 2]" />
          <ChallengeProgressBar :timer="30000" :progressBarValue="50" :battleDuration="45000" :playersProgress="playersProgress" />
        </div>

        <!-- battle mechanic -->
        <div class="battle-mech-cnt flex-1 flex mt-2">
          <BattleMechanicMock mech="yesno" :task="currentTask" />
        </div>
      </div>

      <!-- leaderboard -->
      <BackgroundPill v-if="scenes[currentScene] === 'leaderboard'" class="py-8 mt-12 overflow-y-hidden flex-1 z-10 w-full">
        <div class="pill-header flex items-center justify-between">
          <span class="bg-pill-title">{{ locale?.["battle_results_title"] || "Battle results:" }}</span>
        </div>

        <div class="scrollable-cnt flex-1 overflow-y-auto mt-2">
          <div class="leaderboard flex flex-col gap-1 pt-4">
            <Pill v-for="player in leaderboardSorted" :key="player.id" class="py-2 flex items-center justify-between gap-4" color="light">
              <div class="player-meta leading-3 flex gap-4 items-center">
                <div class="rounded-full bg-[var(--grey-dark)] w-[30px] h-[30px] grid place-items-center">
                  <span class="league exo-black text-lg mb-[1px]" :style="`color: ${getPlayerColor(player)}`">{{ player.position }}</span>
                </div>
                <span class="fira-bold text-lg max-w-1/2 text-ellipsis">{{ player.name }}</span>
              </div>
              <span class="bolts exo-black text-[var(--accent-color)]">{{ player?.score || 0 }}</span>
            </Pill>
          </div>
        </div>
      </BackgroundPill>
    </div>

    <!-- loader -->
    <!-- <div v-if="!gifUrl" class="loader absolute inset-0 bg-[#222] grid place-items-center z-[999]">
      <div class="text flex flex-col gap-2 justify-center items-center">
        <span>Creating screenshots</span>
        <span class="exo-black text-4xl">{{ battleScene }}</span>
      </div>
    </div> -->

    <!-- download button -->
    <!-- <div v-if="gifUrl" class="link-cnt absolute inset-0 bg-[#222] grid place-items-center z-[999]">
    <Button class="z-10">
      <a class="" :href="gifUrl" download="screenshot.png">Скачать</a>
    </Button>
  </div> -->
    <img v-if="gifUrl" class="absolute top-0 z-[1000] w-[150px]" :src="gifUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from "vue";
import { getAsset } from "@/utils";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import html2canvas from "html2canvas";
import GIF from "gif.js";
import { tg } from "@/api/telegram";
import constants from "@/constants";
import { makeRequest } from "@/api/server";

// stores
import { useMainStore } from "@/store/main";

const route = useRoute();
const router = useRouter();
const { apiUrl } = constants;

const store = useMainStore();

const { uploadGif, useFetch } = store;
const { data } = storeToRefs(store.battleStore);
const { battles: locale } = storeToRefs(store.localeStore);

const previewSrc = ref("");

const tasks = [
  {
    api: "battle_data_get",
    correct: "вопрос",
    id: 28,
    key: "269",
    task: {
      answer: "вопрос",
      question: "question",
      variants: ["вопрос", "адрес", "ответ", "ресторан"],
    },
  },
  {
    api: null,
    correct: "карикатура",
    id: 29,
    key: "3433",
    task: {
      answer: "карикатура",
      question: "cartoon",
      variants: ["карикатура", "станция", "блог", "культура"],
    },
  },
  {
    api: null,
    correct: "относительно",
    id: 30,
    key: "2952",
    task: {
      answer: "к сожалению",
      question: "over",
      variants: ["к сожалению", "так же", "относительно", "возможно"],
    },
  },
  {
    api: null,
    correct: "доска",
    id: 31,
    key: "340",
    task: {
      answer: "запад",
      question: "board",
      variants: ["запад", "доска", "матч", "работа"],
    },
  },
  {
    api: null,
    correct: "перебирать",
    id: 32,
    key: "19949",
    task: {
      answer: "повесить трубку",
      question: "look through",
      variants: ["повесить трубку", "извлекать пользу", "завершить", "перебирать"],
    },
  },
];
const colors = {
  0: "F01515",
  1: "519A58",
  2: "FEEB3E",
  3: "A142EC",
  4: "3C4FF9",
  5: "FFFFFF",
  6: "24CAFF",
};
const currentTask = computed(() => tasks[battleScene.value]);
const playersProgress = ref([
  {
    id: 0,
    isPlayer: true,
    score: 20,
  },
  {
    id: 2,
    isPlayer: false,
    score: 47,
  },
]);

const scenes = ["vs", "battle", "leaderboard"];
let battleScene = ref(0);
const imageArr = ref([]);

const gifUrl = ref(null);
const currentScene = ref(1);
const leaderBoard = ref([
  {
    id: 2,
    isPlayer: false,
    name: "Zinov",
    position: 2,
    score: 164,
  },
  {
    id: 1,
    isPlayer: true,
    name: "Eugeny",
    position: 1,
    score: 208,
  },
]);
const el = ref();

const leaderboardSorted = computed(() => {
  if (!leaderBoard.value?.length) return [];

  const clone = [...leaderBoard.value];

  return clone.sort((a, b) => b.score - a.score);
});

const getPlayerColor = (player: {}) => {
  if (player.isPlayer) {
    return "#26df26";
  } else {
    return "#" + colors[+player.id];
  }
};

const canvasToFile = (canvas) => {
  const dataURL = canvas.toDataURL("image/png");

  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([byteArray], { type: mimeString });

  return new File([blob], "screenshot.png", { type: "image/png" });
};

const leaderboardSrc =
  "data:image/png;base64,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";

const generateGIF = async () => {
  const bgSrc = getAsset("battle_results_final");
  console.log(bgSrc);

  const fgImage = new Image();
  fgImage.src = leaderboardSrc;
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
      ctx.fillText("Played at @Tapsmart in Telegram", canvas.width / 2 - 105, 14);

      const dataURL = canvas.toDataURL();

      gifUrl.value = dataURL;
    };
  };
  // const imageFile = canvasToFile(canvas);

  // previewSrc.value = dataURL;

  // gifUrl.value = imageFile;

  // const response = await uploadGif(imageFile);

  // const url = response?.httpResponse?.body?.data?.url;

  // tg.shareToStory(url, { text: "Check out my latest battle!" });

  // let interval = null;

  // const gif = new GIF({
  //   workers: 2,
  //   quality: 10,
  // });

  // interval = setInterval(async () => {
  //   if (battleScene.value < 5) {
  //     console.log(`capturing scene ${battleScene.value}`);

  //     const canvas = await html2canvas(el.value);
  //     const dataURL = canvas.toDataURL("image/png");
  //     imageArr.value.push(dataURL);
  //     previewSrc.value = dataURL;
  //     // gif.addFrame(canvas, { delay: 2000 });

  //     //   const newIdx = (currentScene.value + 1) % scenes.length;
  //     battleScene.value += 1;
  //   } else {
  //     console.log(`clearing interval`);

  //     clearInterval(interval);
  //     console.log(`sending data...`);

  //     //   console.log(`images: ${imageArr.value}`);

  //     //   await useFetch({ key: "tg_story", data: { images: imageArr.value } });
  //     //   router.push("/home/relax");
  //   }
  // }, 500);

  // gif.on("finished", async (blob) => {
  //   const response = await uploadGif(blob);

  //   console.log(response);

  //   const url = response?.httpResponse?.body?.data?.url;

  //   console.log(url);

  //   gifUrl.value = url;
  //   tg.shareToStory(url);
  // });
};

onMounted(() => {
  setTimeout(() => {
    generateGIF();
  }, 1000);
});
</script>
