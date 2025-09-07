import { Link } from "react-router";
import HeaderButton from "./HeaderButton";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 w-full bg-emerald-500 shadow-lg z-50">
      <div className="max-w-full mx-auto flex justify-between items-center h-14 px-4">
        <h1 className="text-white text-2xl font-bold">
          <Link to="/" className="font-serif font-extralight tracking-wider">
            Article
          </Link>
        </h1>
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <>
              <HeaderButton name="Login" urls="login" color="blue" />
              <HeaderButton name="Register" urls="register" color="violet" />
            </>
          ) : (
            <button
              className="text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;