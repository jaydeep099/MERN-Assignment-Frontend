import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router";

const ProtectedPages = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/");
    }
  }, [isAuthenticated, logout, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedPages;
