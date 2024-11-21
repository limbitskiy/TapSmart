import { watch } from "vue";
import { nonEssentialAssets } from "@/config.ts";
import { getAssetURL } from "@/utils";
import { useWebWorker } from "@vueuse/core";

// worker
import Worker from "@/worker?worker";

const loadNonEssentialAssets = () => {
  const { data, post, terminate, worker } = useWebWorker(Worker);

  Object.keys(nonEssentialAssets).forEach((key) => {
    post({ url: nonEssentialAssets[key] });
  });

  watch(data, (val) => {
    console.log(val);
    const image = new Image();
    image.src = val;
  });
};

export default loadNonEssentialAssets;
