import axios from "axios";
import { RequestParams } from "@/types";
import { waitFor } from "@/utils";
import constants from "@/constants";

const { apiUrl: defaultApiUrl } = constants;

let lastCall = Date.now();

export const makeRequest = async ({ apiUrl, payload }: RequestParams) => {
  const currentTime = Date.now();

  const deltaTime = currentTime - lastCall;

  if (deltaTime > 90000) {
    const pingResult = await axios.post(`${defaultApiUrl}/main`, { key: "ping", data: payload.data, service: payload.service });
    const timeout = pingResult.data.data.requestTimeout;

    if (timeout) {
      await waitFor(timeout);
    }
  }

  lastCall = Date.now();

  return await axios.post(`${apiUrl ?? defaultApiUrl}/main`, payload);
};
