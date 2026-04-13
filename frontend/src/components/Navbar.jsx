import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiHeart,
  FiUser,
  FiX,
} from "react-icons/fi";

function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      queryClient.removeQueries(["me"]);

      navigate("/");
    }
  }

  const iconStyle =
    "text-2xl cursor-pointer p-2 rounded-full flex items-center justify-center transition duration-200 ease-in-out hover:bg-black/5 hover:scale-110 active:scale-95";

  const tooltipStyle =
    "absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-3 py-1 text-xs text-white opacity-0 transition duration-200 pointer-events-none group-hover:opacity-100";

  return (
    <nav className="flex items-center justify-between border-b border-black/10 bg-white px-16 py-5">
      {isSearchActive ? (
        <>
          <div className="w-24" />

          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-md items-center gap-3">
              <input
                type="text"
                placeholder="Search users"
                autoFocus
                className="w-full rounded-full border border-black/20 px-5 py-2 text-sm outline-none transition duration-200 focus:border-black"
              />

              <button
                type="button"
                onClick={() => setIsSearchActive(false)}
                className={iconStyle}
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="w-24" />
        </>
      ) : (
        <>
          <div className="text-xl font-semibold">Picverse</div>

          <ul className="flex items-center gap-8">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `relative ${iconStyle} after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-black after:transition-all after:duration-200 ${
                    isActive ? "after:w-full" : "after:w-0"
                  }`
                }
              >
                <FiHome />
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                className={iconStyle}
                onClick={() => setIsSearchActive(true)}
              >
                <FiSearch />
              </button>
            </li>

            <li className="relative group">
              <button type="button" className={iconStyle}>
                <FiCompass />
              </button>
              <span className={tooltipStyle}>
                This feature is yet to be implemented...
              </span>
            </li>

            <li className="relative group">
              <button type="button" className={iconStyle}>
                <FiHeart />
              </button>
              <span className={tooltipStyle}>
                This feature is yet to be implemented...
              </span>
            </li>
          </ul>

          <div className="relative">
            <button
              type="button"
              className={iconStyle}
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <FiUser />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-black/10 bg-white shadow-md">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-sm transition hover:bg-black/5"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  className="block w-full px-4 py-3 text-left text-sm transition hover:bg-black/5"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
