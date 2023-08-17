import { useEffect, useState } from "react";
import { classNames } from "@/lib/helpers";
import { Link, useLocation } from "react-router-dom";

interface MenuItems {
  name: string;
  url: string;
}

export function MainNav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [menuItems] = useState<MenuItems[]>([
    {
      name: "Página Inicial",
      url: "/",
    },
    {
      name: "Veículos",
      url: "/vehicles",
    },
    {
      name: "Motoristas",
      url: "/drivers",
    },
  ]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function isActived(url: string) {
    return location.pathname === url;
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="relative px-8 py-4 flex justify-between items-center bg-white border-b-[1px] border-slate-200">
        <img src="/images/car-1760.svg" alt="" className="w-8" />
        <div className="lg:hidden">
          <button
            className="navbar-burger flex items-center text-slate-600 p-3"
            onClick={toggleMenu}
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <ul className="hidden lg:flex lg:items-center lg:w-auto lg:space-x-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                className={classNames(
                  "text-md ",
                  isActived(item.url)
                    ? "text-slate-600 font-semibold"
                    : "text-gray-400 hover:text-gray-500"
                )}
                to={item.url}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu hamburguer */}
      <div
        className={classNames(
          "navbar-menu relative z-50",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <div
          className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"
          onClick={toggleMenu}
        ></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
          <div className="flex items-center mb-8">
            <a className="mr-auto text-3xl font-bold leading-none" href="#">
              <img src="/images/car-1760.svg" alt="" className="w-8" />
            </a>
            <button className="navbar-close" onClick={toggleMenu}>
              <svg
                className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    className={classNames(
                      "block p-4 text-sm font-semibold text-gray-400 hover:bg-slate-50 hover:text-slate-500 rounded",
                      isActived(item.url)
                        ? "text-cyan-500 font-bold"
                        : "text-gray-400 hover:text-gray-500"
                    )}
                    to={item.url}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
