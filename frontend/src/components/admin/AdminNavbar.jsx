import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar({ login, setLogin }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("admin-login");
    setLogin(false);
    navigate("/admin-login");
  };

  return (
    <nav className="bg-indigo-900 fixed top-0 left-0 w-full shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <div className="text-white font-bold text-lg sm:text-2xl tracking-wide">
          Admin Dashboard
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-yellow-300 focus:outline-none text-2xl"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Mobile Menu */}
        <ul
          className={`absolute top-20 left-0 w-full bg-indigo-900 md:hidden flex flex-col gap-3 p-4 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          {login && (
            <>
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-yellow-300 px-4 py-2 rounded text-lg"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/create-event"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-yellow-300 px-4 py-2 rounded text-lg"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-yellow-300 px-4 py-2 rounded text-lg"
                >
                  Manage Events
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-lg mt-2"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          {login && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="text-white hover:text-yellow-300 text-lg"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/create-event"
                  className="text-white hover:text-yellow-300 text-lg"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-white hover:text-yellow-300 text-lg"
                >
                  Manage Events
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-lg"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
