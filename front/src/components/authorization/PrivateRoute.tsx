import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige vers /login en gardant la page d’origine pour revenir après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
