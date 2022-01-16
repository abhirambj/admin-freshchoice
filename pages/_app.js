import "../styles/globals.css";
import { NavContextProvider } from "../Contexts/NavContext";
import { DropDownProvider } from "../Contexts/DropDownContext";
function MyApp({ Component, pageProps }) {
  return (
    <NavContextProvider>
      <DropDownProvider>
        <Component {...pageProps} />
      </DropDownProvider>
    </NavContextProvider>
  );
}

export default MyApp;
