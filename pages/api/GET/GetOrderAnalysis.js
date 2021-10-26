import { getToken } from "../apiRequests";

const getOrderAnalytics = async (url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  console.info(url)
  try {
    return await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.json();
    });
  } catch (err) {
    return { error: true, err };
  }
};

export default getOrderAnalytics;
