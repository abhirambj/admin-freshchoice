import "../styles/globals.css";
import { NavContextProvider } from "../Contexts/NavContext";
import IdleTimer from "react-idle-timer";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { DropDownProvider } from "../Contexts/DropDownContext";
function MyApp({ Component, pageProps }) {
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const router = useRouter();
  const handleIdle = () => {
    console.info("%cIdle", "color:red;background:black;padding:5px");
    removeCookies("user", { path: "/" });
    router.push("/");
  };
  console.info("%ccss in console", "color:white;background:blue;padding:5px");
  return (
    <NavContextProvider>
      <DropDownProvider>
      <IdleTimer onIdle={handleIdle} timeout={1000 * 500} />
      <Component {...pageProps} />
      </DropDownProvider>
    </NavContextProvider>
  );
}

export default MyApp;
