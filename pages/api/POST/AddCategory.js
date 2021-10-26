import { getToken } from "../apiRequests";

const addCategory = async (data, url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: data,
    }).then((res) => res.json());
  } catch (err) {
    return { error: true, err };
  }
};

export default addCategory;
