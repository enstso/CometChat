import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  children: ReactNode;
}

// Component that protects routes and only allows access to authenticated users
export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Get authentication status and loading state from Auth0 hook
  const { isAuthenticated, isLoading } = useAuth0();
  // Get current location to keep track of where the user wanted to go
  const location = useLocation();

  // While checking authentication status, show loading indicator
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  // Pass the original location in state to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected child components
  return <>{children}</>;
}
