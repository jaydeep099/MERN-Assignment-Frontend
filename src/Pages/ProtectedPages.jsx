import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router";
import { Loader } from "lucide-react";

const ProtectedPages = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedPages;
