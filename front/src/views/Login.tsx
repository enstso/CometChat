import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: "/chat", // Redirection après le callback
      },
      redirectUri: `${window.location.origin}/auth/callback`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Se connecter
      </button>
    </div>
  );
}
