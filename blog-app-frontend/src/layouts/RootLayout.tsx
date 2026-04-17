import { Outlet } from "react-router-dom";
export default function RootLayout() {
  return (
    <>
      <header>
        <nav></nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
