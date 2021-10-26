const userSignIn = async (data, url) => {
  try {
    return await fetch(url, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        error: true, err;
      });
  } catch (err) {
    return { error: true, err };
  }
};

export default userSignIn;
