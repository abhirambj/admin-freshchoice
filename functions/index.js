import { decode } from "jsonwebtoken";
import { getToken } from "../pages/api/apiRequests";

export const requiresAuthentication = (serverSideProp) => {
  return async ({ req, res }) => {
    let { user } = getToken(req);
    user = user ? JSON.parse(user) : undefined;
    if (
      !user ||
      !user.access_token ||
      typeof user.access_token == "undefined" ||
      user.access_token == undefined ||
      user.access_token == "undefined"
    ) {
      console.log("yes");
      res.writeHead(302, {
        Location: "/",
      });

      res.end();
      return {
        props: {},
      };
    }
    return await serverSideProp({ req, res });
  };
};

export const processItems = (items) => {
  let str = "";
  const n = items.length;
  items.map(
    (item, index) =>
      (str =
        str + `${item.name} - ${item.quantity} ${index < n - 1 ? `, ` : ""}`)
  );
  return str;
};
export const getCurrentMonth = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
};

export const formatNumber = (num) => {
  const formatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(num);
};
