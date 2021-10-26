import { createContext, useState } from "react";

export const NavContext = createContext();

export const NavContextProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <NavContext.Provider value={[isActive, setIsActive]}>
      {children}
    </NavContext.Provider>
  );
};
