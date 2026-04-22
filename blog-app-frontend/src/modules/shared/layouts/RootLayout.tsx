import { Outlet } from "react-router-dom";
export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col gap-1">
      <header>
        <nav className="max-w-5xl mx-auto">Navbar</nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
