import { useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { Menu, X } from "lucide-react";
import Button from "../components/Button";

import MobileNav from "../components/nav/MobileNav";
import DesktopNav from "../components/nav/DesktopNav";

export default function RootLayout() {
  const { userId } = useAuth();
  const links = [
    { name: "Main page", link: "/" },
    { name: "Create post", link: "/create-post" },
    { name: "My profile", link: `/users/${userId}` },
  ];
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  return (
    <div className="min-h-screen flex flex-col gap-1">
      <header className="flex flex-end bg-bg-header text-link shadow-sm font-bold">
        <DesktopNav links={links} />
        <Button onClick={handleToggleMenu} className="md:hidden">
          {openMenu ? <X /> : <Menu />}
        </Button>
        {openMenu && <MobileNav links={links} />}
      </header>
      <main className="flex-1 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
