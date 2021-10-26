import { getToken } from "../apiRequests";

const getOrders = async (url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url).then((res) => res.json());
  } catch (err) {
    return { error: true, err };
  }
};

export default getOrders;
