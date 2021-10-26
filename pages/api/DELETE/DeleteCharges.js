import { getToken } from "../apiRequests";

const deleteChargesById = async (url) => {
  let { user } = getToken();
  let { access_token } = JSON.parse(user);
  try {
    return await fetch(url, {
      method: "DELETE",
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

export default deleteChargesById;
