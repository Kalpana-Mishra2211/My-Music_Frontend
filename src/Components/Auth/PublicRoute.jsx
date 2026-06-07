import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const user = localStorage.getItem("user");

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;