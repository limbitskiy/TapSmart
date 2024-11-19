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
};

export default loadNonEssentialAssets;
