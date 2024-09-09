import axios from "axios";
import { RequestParams } from "@/types";

const defaultApiUrl = import.meta.env.VITE_API_URL;

let lastCall = Date.now();
let pendingRequest = false;

const requestQueue = [];

export const makeRequest = async ({ apiUrl, payload }: RequestParams) => {
  if (pendingRequest) {
    return await queueRequest({ apiUrl, payload });
  }

  return startCurrentRequest({ apiUrl, payload });
};

const startCurrentRequest = async ({ apiUrl, payload }: RequestParams) => {
  pendingRequest = true;

  const currentTime = Date.now();

  const deltaTime = currentTime - lastCall;

  // console.log(`time past last request: `, deltaTime);

  if (deltaTime > 5000) {
    await axios.post(`${defaultApiUrl}/main`, { key: "ping", data: payload.data, service: payload.service });
  }

  const result = await axios.post(`${apiUrl ?? defaultApiUrl}/main`, payload);

  pendingRequest = false;

  return result;
};

const queueProcessor = async () => {
  if (!requestQueue.length) return;

  const currentRequest = requestQueue[requestQueue.length - 1];

  await startCurrentRequest(currentRequest);
};
