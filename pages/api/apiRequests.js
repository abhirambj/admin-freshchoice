import cookie from 'cookie'

export const saveToken = (setCookie, token) => {
  setCookie("user", token, {
    path: "/",
    maxAge: new Date(Date.now() + 90000),
    sameSite: true,
  });
};

export const getToken = (req) =>
  cookie.parse(req ? req.headers.cookie || "" : document.cookie);

export const deleteToken = (removeCookie) => removeCookie("user");
