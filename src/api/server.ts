import axios from "axios";

const defaultApiUrl = import.meta.env.VITE_API_URL;

export const makeRequest = async ({ key, data, service, apiUrl }) => {
  const result = await axios.post(`${apiUrl ?? defaultApiUrl}/main`, {
    key,
    data,
    service,
  });
  return result;
};
