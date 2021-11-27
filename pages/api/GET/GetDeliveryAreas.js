import { getToken } from "../apiRequests";

const getDeliveryAreas = async (url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      method: "POST",
    }).then((res) => {
      return res.json();
    });
  } catch (err) {
    return { error: true, err };
  }
};

export default getDeliveryAreas;
