<template>
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
    <div v-else-if="scenes[currentScene] === 'battle'" class="battle-scene-cnt absolute inset-0 p-4 flex-1 flex flex-col">
      <BackgroundImage type="red" />

      <div class="challenge-stats z-10 flex flex-col gap-2 min-h-[136px]">
        <ChallengeStatus :timer="30000" />
        <ChallengeProgressBar :timer="30000" />
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
  <div v-if="!gifUrl" class="loader absolute inset-0 bg-[#222] grid place-items-center z-[999]">
    <div class="text flex flex-col gap-2 justify-center items-center">
      <span>Creating screenshots</span>
      <span class="exo-black text-4xl">{{ battleScene }}</span>
    </div>
  </div>

  <!-- download button -->
  <!-- <div v-if="gifUrl" class="link-cnt absolute inset-0 bg-[#222] grid place-items-center z-[999]">
    <Button class="z-10">
      <a class="" :href="gifUrl" download="screenshot.png">Скачать</a>
    </Button>
  </div> -->
  <!-- <img v-if="imageArr.length" class="absolute top-0 z-[1000] w-[150px]" :src="previewSrc" /> -->
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

const generateGIF = async () => {
  // const imageFile = canvasToFile(canvas);

  // previewSrc.value = dataURL;

  // gifUrl.value = imageFile;

  // const response = await uploadGif(imageFile);

  // const url = response?.httpResponse?.body?.data?.url;

  // tg.shareToStory(url, { text: "Check out my latest battle!" });

  let interval = null;

  // const gif = new GIF({
  //   workers: 2,
  //   quality: 10,
  // });

  interval = setInterval(async () => {
    if (battleScene.value < 5) {
      console.log(`capturing scene ${battleScene.value}`);

      const canvas = await html2canvas(el.value);
      const dataURL = canvas.toDataURL("image/png");
      imageArr.value.push(dataURL);
      previewSrc.value = dataURL;
      // gif.addFrame(canvas, { delay: 2000 });

      //   const newIdx = (currentScene.value + 1) % scenes.length;
      battleScene.value += 1;
    } else {
      console.log(`clearing interval`);

      clearInterval(interval);
      console.log(`sending data...`);

      console.log(`images: ${imageArr.value}`);

      await useFetch({ key: "tg_story", data: { images: imageArr.value } });
      router.push("/home/relax");
    }
  }, 500);

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

<!-- [
    {
        "api": null,
        "correct": "направлять",
        "id": 1,
        "key": "3093",
        "task": {
            "answer": "перемешивать",
            "question": "point",
            "variants": [
                "перемешивать",
                "упорядочивать",
                "направлять",
                "двигаться"
            ]
        }
    },
    {
        "api": null,
        "correct": "очень",
        "id": 2,
        "key": "6999",
        "task": {
            "answer": "очень",
            "question": "greatly",
            "variants": [
                "очень",
                "внутри",
                "постепенно",
                "обычно"
            ]
        }
    },
    {
        "api": null,
        "correct": "ходить",
        "id": 3,
        "key": "290",
        "task": {
            "answer": "присесть",
            "question": "walk",
            "variants": [
                "присесть",
                "знать",
                "расслабиться",
                "ходить"
            ]
        }
    },
    {
        "api": null,
        "correct": "следовать",
        "id": 4,
        "key": "4011",
        "task": {
            "answer": "исключить",
            "question": "follow",
            "variants": [
                "исключить",
                "следовать",
                "обменяться",
                "наткнуться"
            ]
        }
    },
    {
        "api": null,
        "correct": "понимать",
        "id": 5,
        "key": "1976",
        "task": {
            "answer": "понимать",
            "question": "get",
            "variants": [
                "понимать",
                "уезжать",
                "информировать",
                "согласовывать"
            ]
        }
    },
    {
        "api": null,
        "correct": "коридор",
        "id": 6,
        "key": "6181",
        "task": {
            "answer": "строительство",
            "question": "hallway",
            "variants": [
                "строительство",
                "место",
                "коридор",
                "доставка"
            ]
        }
    },
    {
        "api": null,
        "correct": "пересаживаться",
        "id": 7,
        "key": "1960",
        "task": {
            "answer": "сообщить",
            "question": "change",
            "variants": [
                "сообщить",
                "принадлежать",
                "пересаживаться",
                "связаться"
            ]
        }
    },
    {
        "api": null,
        "correct": "испытывать",
        "id": 8,
        "key": "4076",
        "task": {
            "answer": "не выносить",
            "question": "get",
            "variants": [
                "не выносить",
                "выражать",
                "будь серьёзным",
                "испытывать"
            ]
        }
    },
    {
        "api": null,
        "correct": "застревать",
        "id": 9,
        "key": "7110",
        "task": {
            "answer": "плавать",
            "question": "stick",
            "variants": [
                "плавать",
                "прыгать через скакалку",
                "приводить",
                "застревать"
            ]
        }
    },
    {
        "api": null,
        "correct": "телефон",
        "id": 10,
        "key": "49",
        "task": {
            "answer": "учитель",
            "question": "phone",
            "variants": [
                "учитель",
                "телефон",
                "растение",
                "дорога"
            ]
        }
    },
    {
        "api": null,
        "correct": "серьезный",
        "id": 11,
        "key": "369",
        "task": {
            "answer": "здоровый",
            "question": "bad",
            "variants": [
                "здоровый",
                "прямой",
                "серьезный",
                "приемлемый"
            ]
        }
    },
    {
        "api": null,
        "correct": "закрытие",
        "id": 12,
        "key": "6008",
        "task": {
            "answer": "неудача",
            "question": "closing",
            "variants": [
                "неудача",
                "закрытие",
                "активность",
                "бюджет"
            ]
        }
    },
    {
        "api": null,
        "correct": "трусы",
        "id": 13,
        "key": "2775",
        "task": {
            "answer": "серебро",
            "question": "pants",
            "variants": [
                "серебро",
                "беспорядок",
                "зонт",
                "трусы"
            ]
        }
    },
    {
        "api": null,
        "correct": "правые",
        "id": 14,
        "key": "5009",
        "task": {
            "answer": "отношения",
            "question": "right",
            "variants": [
                "отношения",
                "правые",
                "советник",
                "дебаты"
            ]
        }
    },
    {
        "api": null,
        "correct": "наряд",
        "id": 15,
        "key": "5381",
        "task": {
            "answer": "скрепка",
            "question": "suit",
            "variants": [
                "скрепка",
                "золото",
                "наряд",
                "каблук"
            ]
        }
    },
    {
        "api": null,
        "correct": "курсировать",
        "id": 16,
        "key": "5064",
        "task": {
            "answer": "обыскивать",
            "question": "run",
            "variants": [
                "обыскивать",
                "курсировать",
                "забрать",
                "перерабатывать"
            ]
        }
    },
    {
        "api": null,
        "correct": "чай",
        "id": 17,
        "key": "151",
        "task": {
            "answer": "кухня",
            "question": "tea",
            "variants": [
                "кухня",
                "чай",
                "ресторан",
                "завтрак"
            ]
        }
    },
    {
        "api": null,
        "correct": "остаток",
        "id": 18,
        "key": "19966",
        "task": {
            "answer": "вот и всё",
            "question": "the rest",
            "variants": [
                "вот и всё",
                "С Рождеством!",
                "я тоже нет",
                "остаток"
            ]
        }
    },
    {
        "api": null,
        "correct": "повесить трубку",
        "id": 19,
        "key": "19941",
        "task": {
            "answer": "уменьшить",
            "question": "hang up",
            "variants": [
                "уменьшить",
                "просить",
                "повесить трубку",
                "провести"
            ]
        }
    },
    {
        "api": null,
        "correct": "верхняя одежда",
        "id": 20,
        "key": "2025",
        "task": {
            "answer": "ткань",
            "question": "top",
            "variants": [
                "ткань",
                "верхняя одежда",
                "униформа",
                "лыжный спорт"
            ]
        }
    },
    {
        "api": null,
        "correct": "прибывать",
        "id": 21,
        "key": "338",
        "task": {
            "answer": "брать",
            "question": "arrive",
            "variants": [
                "брать",
                "прибывать",
                "встречать",
                "чистить"
            ]
        }
    },
    {
        "api": null,
        "correct": "в любом случае",
        "id": 22,
        "key": "3103",
        "task": {
            "answer": "просто",
            "question": "anyway",
            "variants": [
                "просто",
                "серьезно",
                "настойчиво",
                "в любом случае"
            ]
        }
    },
    {
        "api": null,
        "correct": "вовремя",
        "id": 23,
        "key": "19808",
        "task": {
            "answer": "навсегда",
            "question": "in time",
            "variants": [
                "навсегда",
                "позже",
                "одновременно",
                "вовремя"
            ]
        }
    },
    {
        "api": "battle_data_set",
        "correct": "строить",
        "id": 24,
        "key": "515",
        "task": {
            "answer": "мыть",
            "question": "build",
            "variants": [
                "мыть",
                "присоединиться",
                "строить",
                "отправлять"
            ]
        }
    },
    {
        "api": null,
        "correct": "голод",
        "id": 25,
        "key": "2741",
        "task": {
            "answer": "шеф-повар",
            "question": "hunger",
            "variants": [
                "шеф-повар",
                "рецепт",
                "бар",
                "голод"
            ]
        }
    },
    {
        "api": null,
        "correct": "земля",
        "id": 26,
        "key": "527",
        "task": {
            "answer": "погода",
            "question": "land",
            "variants": [
                "погода",
                "озеро",
                "земля",
                "карта"
            ]
        }
    },
    {
        "api": null,
        "correct": "мозг",
        "id": 27,
        "key": "6001",
        "task": {
            "answer": "файл",
            "question": "brain",
            "variants": [
                "файл",
                "злоупотребление",
                "состояние",
                "мозг"
            ]
        }
    },
    {
        "api": "battle_data_get",
        "correct": "вопрос",
        "id": 28,
        "key": "269",
        "task": {
            "answer": "вопрос",
            "question": "question",
            "variants": [
                "вопрос",
                "адрес",
                "ответ",
                "ресторан"
            ]
        }
    },
    {
        "api": null,
        "correct": "карикатура",
        "id": 29,
        "key": "3433",
        "task": {
            "answer": "карикатура",
            "question": "cartoon",
            "variants": [
                "карикатура",
                "станция",
                "блог",
                "культура"
            ]
        }
    },
    {
        "api": null,
        "correct": "относительно",
        "id": 30,
        "key": "2952",
        "task": {
            "answer": "к сожалению",
            "question": "over",
            "variants": [
                "к сожалению",
                "так же",
                "относительно",
                "возможно"
            ]
        }
    },
    {
        "api": null,
        "correct": "доска",
        "id": 31,
        "key": "340",
        "task": {
            "answer": "запад",
            "question": "board",
            "variants": [
                "запад",
                "доска",
                "матч",
                "работа"
            ]
        }
    },
    {
        "api": null,
        "correct": "перебирать",
        "id": 32,
        "key": "19949",
        "task": {
            "answer": "повесить трубку",
            "question": "look through",
            "variants": [
                "повесить трубку",
                "извлекать пользу",
                "завершить",
                "перебирать"
            ]
        }
    }
] -->
