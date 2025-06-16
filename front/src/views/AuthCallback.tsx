// Import necessary hooks and functions from React, React Router, and Auth0
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// Define and export the AuthCallback component
export default function AuthCallback() {
  const { handleRedirectCallback } = useAuth0(); // Get the Auth0 function to handle login redirect
  const navigate = useNavigate(); // React Router hook to programmatically navigate

  // useEffect is used to run the authentication logic once when the component mounts
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Handle the Auth0 redirect callback and extract any return state
        const result = await handleRedirectCallback();

        // Navigate to the originally requested route, or fallback to "/"
        const returnTo = result.appState?.returnTo || "/";
        navigate(returnTo);
      } catch (err) {
        // Log any error that occurs during the callback process
        console.error("Error during Auth0 callback:", err);
      }
    };

    // Call the authentication handler
    handleAuth();
  }, [handleRedirectCallback, navigate]);

  // Display a temporary message while the login is being processed
  return <p>Logging you in...</p>;
}
