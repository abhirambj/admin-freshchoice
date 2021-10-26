import { createContext, useState } from "react";

export const DropDownContext = createContext();

export const DropDownProvider = ({ children }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);

  return (
    <DropDownContext.Provider value={[dropdownPopoverShow, setDropdownPopoverShow]}>
      {children}
    </DropDownContext.Provider>
  );
};
