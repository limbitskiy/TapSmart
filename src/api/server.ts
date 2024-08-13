import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchData = async (payload) => {
  return await axios.post(`${apiUrl}/main`, payload);
};

export const getFriendsData = async (service) => {
  return await axios.post(`${apiUrl}/main`, {
    key: "friend_table_list",
    service,
  });
};
