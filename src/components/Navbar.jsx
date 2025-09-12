import { Link, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
const imagePath = import.meta.env.VITE_IMAGE_PATH;

const Navbar = () => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("LoggedOut Sucessfully");
  };

  return (
    <nav className="sticky top-0 w-full bg-emerald-500 shadow-lg z-50 glass-m">
      <div className="max-w-full mx-auto flex md:justify-between justify-around items-center h-14 px-4">
        <h1 className="text-white text-2xl font-bold">
          <Link to="/" className="font-serif font-extralight tracking-wider">
            Article
          </Link>
        </h1>
       <div className="flex gap-2">
       {isAuthenticated && 
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <img
                src={`${imagePath}${user.profileImage}`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="text-gray-800 font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-800 text-sm">{user.email}</p>
              </div>
            </div>
          </div>}
          <button
            className="text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
