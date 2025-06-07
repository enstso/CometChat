import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithRedirect({
        appState: { returnTo: "/chat" },
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch (error) {
      console.error("Error during login:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-6 py-3 rounded text-white font-semibold transition-colors duration-300 ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </div>
  );
}
