import { getToken } from "../apiRequests";

const addItems = async (data, url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-Type":"application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  } catch (err) {
    return { error: true, err };
  }
};

export default addItems;

export const addCatalogueItems = (data, url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return fetch(url, {
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