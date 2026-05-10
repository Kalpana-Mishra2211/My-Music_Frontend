import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
console.log("token",token)
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;