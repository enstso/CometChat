// Import necessary hooks from Auth0 and React
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

// Define the Login component responsible for handling user login
export default function Login() {
  // Extract the loginWithRedirect function from Auth0 hook
  const { loginWithRedirect } = useAuth0();
  // Local state to track loading status during login process
  const [loading, setLoading] = useState(false);

  // Function to handle login button click
  const handleLogin = async () => {
    setLoading(true); // Set loading state to true to disable button and show loading text
    try {
      // Initiate the login process with redirect to /chat after successful login
      await loginWithRedirect({
        appState: { returnTo: "/chat" },
        // Specify the redirect URI after login callback
        // @ts-expect-error not implemented in the doc
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch (error) {
      // Log any errors during login and reset loading state
      console.error("Error during login:", error);
      setLoading(false);
    }
  };

  return (
    // Container centering the login button vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Login button which triggers handleLogin on click */}
      <button
        onClick={handleLogin}
        className={`px-6 py-3 rounded text-white font-semibold transition-colors duration-300 ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {/* Display loading text when login is in progress */}
        {loading ? "Logging in..." : "Log In"}
      </button>
    </div>
  );
}