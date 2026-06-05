import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Navigation from "../components/nav/Navigation";
import Button from "../components/Button";

export default function RootLayout() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };
  return (
    <div className="min-h-screen flex flex-col gap-1">
      <header className="sticky z-20 w-full p-1.5 mb-1 md:mb-2 lg:mb-3 flex justify-end bg-bg-header shadow-sm">
        <Button onClick={handleToggleMenu} className="relative p-3 md:hidden">
          {openMenu ? <X /> : <Menu />}
        </Button>
      </header>
      <Navigation openMenu={openMenu} handleCloseMenu={handleCloseMenu} />
      <main className="flex-1 p-2">
        <Outlet />
      </main>
    </div>
  );
}
