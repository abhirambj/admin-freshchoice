import { NextResponse } from "next/server";
import jwt from "@tsndr/cloudflare-worker-jwt";

export function middleware(req, ev) {
  let user = req.cookies["user"];
  user = user ? JSON.parse(user) : undefined;
  console.log("USER COOKIE", user);
  if (
    !user ||
    !user.access_token ||
    typeof user.access_token == "undefined" ||
    user.access_token == undefined ||
    user.access_token == "undefined" ||
    Date.now() >= parseInt(jwt.decode(user.access_token).exp) * 1000
  ) {
    return NextResponse.rewrite("/admin");
  } else if (req.url === "/" || req.url === "/admin" || req.url === "/admin/") {
    if (
      !user ||
      !user.access_token ||
      typeof user.access_token == "undefined" ||
      user.access_token == undefined ||
      user.access_token == "undefined" ||
      Date.now() >= parseInt(jwt.decode(user.access_token).exp) * 1000
    ) {
      return NextResponse.rewrite("/admin");
    }
    return NextResponse.rewrite("/admin/dashboard");
  }
}
