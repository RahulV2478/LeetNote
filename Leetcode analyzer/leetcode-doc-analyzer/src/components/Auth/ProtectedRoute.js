import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // If token is expired (compare exp with current time), remove it and redirect
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // If token is malformed, remove it and redirect
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
