// Import necessary hooks from Auth0 and React
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Spinner from "../components/ui/Spinner";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 px-4">
      <div className="bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
        <p className="text-gray-600 mb-8">Log in to join the conversation.</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-lg flex items-center justify-center transition duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ml-2">Logging in...</span>
            </>
          ) : (
            "Log In with Auth0"
          )}
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Secure authentication powered by{" "}
          <a
            href="https://auth0.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Auth0
          </a>
        </p>
      </div>
    </div>
  );
}
