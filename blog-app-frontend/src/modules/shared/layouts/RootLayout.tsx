import { Outlet } from "react-router-dom";

import Navigation from "../components/nav/Navigation";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col gap-1">
      <header className="sticky p-1.5 mb-1 md:mb-2 lg:mb-3 flex justify-end bg-bg-header text-link shadow-sm font-bold">
        <Navigation />
      </header>
      <main className="flex-1 mx-auto p-2">
        <Outlet />
      </main>
    </div>
  );
}
