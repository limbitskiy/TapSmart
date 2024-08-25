import axios from "axios";

const defaultApiUrl = import.meta.env.VITE_API_URL;

export const makeRequest = async ({ apiUrl, payload }) => {
  const result = await axios.post(`${apiUrl ?? defaultApiUrl}/main`, payload);
  return result;
};
