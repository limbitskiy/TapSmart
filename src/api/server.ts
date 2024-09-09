import axios from "axios";
import { RequestParams } from "@/types";
import { waitFor } from "@/utils";

const defaultApiUrl = import.meta.env.VITE_API_URL;

let lastCall = Date.now();

export const makeRequest = async ({ apiUrl, payload }: RequestParams) => {
  const currentTime = Date.now();

  const deltaTime = currentTime - lastCall;

  // console.log(`time past last request: `, deltaTime);

  if (deltaTime > 90000) {
    const pingResult = await axios.post(`${defaultApiUrl}/main`, { key: "ping", data: payload.data, service: payload.service });
    const timeout = pingResult.data.data.requestTimeout;

    // console.log(`timeout: `, timeout);

    // console.time(`timeout`);

    if (timeout) {
      await waitFor(timeout);
    }

    // console.timeEnd(`timeout`);
  }

  return await axios.post(`${apiUrl ?? defaultApiUrl}/main`, payload);
};
