"use client";
import { createContext, useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiMenu } from "react-icons/fi";
import { Collapse, IconButton } from "./mtw-wrappers";

const MobileNavBarContext = createContext<{
  isShowingMobileNavBar: boolean;
  setIsShowingMobileNavBar: React.Dispatch<React.SetStateAction<boolean>>;
}>(null!);

function MobileNavBarProvider({ children }: { children: React.ReactNode }) {
  const [isShowingMobileNavBar, setIsShowingMobileNavBar] = useState(false);

  return (
    <MobileNavBarContext.Provider
      value={{
        isShowingMobileNavBar,
        setIsShowingMobileNavBar,
      }}
    >
      {children}
    </MobileNavBarContext.Provider>
  );
}

function MobileNavbarButton() {
  const { isShowingMobileNavBar, setIsShowingMobileNavBar } =
    useContext(MobileNavBarContext);

  const handleToggleOpen = () => {
    setIsShowingMobileNavBar(!isShowingMobileNavBar);
  };

  return (
    <>
      <IconButton variant="text">
        {isShowingMobileNavBar ? (
          <RxCross2 size="40" color="black" onClick={handleToggleOpen} />
        ) : (
          <FiMenu size="40" color="black" onClick={handleToggleOpen} />
        )}
      </IconButton>
    </>
  );
}

function MobileNavbarCollapse({ children }: { children: React.ReactNode }) {
  const { isShowingMobileNavBar } = useContext(MobileNavBarContext);
  return (
    <Collapse open={isShowingMobileNavBar}>
      <div className="mt-2 flex flex-col gap-3 md:hidden">{children}</div>
    </Collapse>
  );
}

export { MobileNavbarButton, MobileNavBarProvider, MobileNavbarCollapse };
module.exports = {
  MobileNavbarButton,
  MobileNavBarProvider,
  MobileNavbarCollapse,
};
