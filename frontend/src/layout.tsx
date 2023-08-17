import { Outlet } from "react-router-dom";
import { MainNav } from "./components/main-nav";
import { Toaster } from "./components/ui/toaster";

export function Layout() {
  return (
    <div>
      <MainNav />

      <main className="container">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}
