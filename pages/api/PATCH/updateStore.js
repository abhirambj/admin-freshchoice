import { getToken } from "../apiRequests";

const updateStore = async (data, url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  } catch (err) {
    return { error: true, err };
  }
};

export default updateStore;
