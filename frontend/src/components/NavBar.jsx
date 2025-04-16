import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="backdrop-blur-md bg-gradient-to-tr from-pink-500 to-yellow-500 bg-white/30 shadow-md border-b border-white/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-white drop-shadow-sm tracking-wide"
          >
            PeerConnect
          </Link>

          {user && (
            <div className="relative flex items-center space-x-3">
              <span className="text-white hidden sm:inline text-sm font-light">
                Hi, {user.firstName}
              </span>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus:outline-none"
              >
                <img
                  src={user.photoUrl}
                  alt="user"
                  className="w-10 h-10 rounded-full border-2 border-white hover:scale-105 transition-transform duration-200"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-14 bg-white text-gray-800 rounded-xl shadow-lg w-44 p-3 animate-fade-in">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-sm rounded hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/connections"
                    className="block px-3 py-2 text-sm rounded hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Connections
                  </Link>
                  <Link
                    to="/requests"
                    className="block px-3 py-2 text-sm rounded hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Requests
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
