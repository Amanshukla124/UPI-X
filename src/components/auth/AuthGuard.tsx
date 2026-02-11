import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/splash" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
