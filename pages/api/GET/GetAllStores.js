import { getToken } from "../apiRequests";

const getAllStores = async (url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      return res.json();
    });
  } catch (err) {
    return { error: true, err };
  }
};

export default getAllStores;
