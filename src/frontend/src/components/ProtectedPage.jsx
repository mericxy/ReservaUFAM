import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedPage = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se for rota admin e usuário não for admin, redireciona para home
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Se for rota normal e usuário for admin, redireciona para admin/page
  if (!isAdminRoute && isAdmin) {
    return <Navigate to="/admin/page" replace />;
  }

  return children;
};

export default ProtectedPage;