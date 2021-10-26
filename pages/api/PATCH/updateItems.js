import { getToken } from "../apiRequests";

export const updateItems = async (data, url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  return await fetch(url, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: data,
  })
    .then((res) => res.json())
    .catch((err) => {
      error: true, err;
    });
};

export default updateItems;
