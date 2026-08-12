import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import useAuth from "../../../auth/hooks/useAuth";

import Button from "../Button";

export default function Navigation() {
  const { userId, handleLogout } = useAuth();
  const links = [
    { name: "Main page", link: "/" },
    { name: "Create post", link: "/posts/create" },
    { name: "My profile", link: `/users/${userId}` },
  ];

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <>
      <Button
        onClick={handleToggleMenu}
        className="relative z-20 p-3 md:hidden"
      >
        {openMenu ? <X /> : <Menu />}
      </Button>
      <nav
        className={`fixed inset-0 z-10 ${openMenu ? "" : "translate-x-full"} bg-bg-header text-link font-bold transition-transform md:static md:translate-x-0 md:w-full md:max-w-5xl md:mx-auto md:p-4`}
      >
        <ul className="h-full w-full flex flex-col justify-center items-center gap-2 md:flex-row md:justify-end md:gap-4">
          {links.map((link) => (
            <li key={link.link}>
              <NavLink
                onClick={handleCloseMenu}
                className={({ isActive }) =>
                  `border-b-2 ${isActive ? "text-link-active border-link-active" : "border-transparent"} text-2xl sm:text-3xl font-bold md:text-lg lg:text-xl hover:text-link-hover transition-colors`
                }
                to={link.link}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/notifications"
              onClick={handleCloseMenu}
              className={({ isActive }) =>
                `border-b-2 ${isActive ? "text-link-active border-link-active" : "border-transparent"} text-2xl sm:text-3xl font-bold md:text-lg lg:text-xl hover:text-link-hover transition-colors`
              }
            >
              <Bell />
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-2xl sm:text-3xl font-bold md:text-lg lg:text-xl hover:text-link-hover transition-colors cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
