// AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthCallback() {
  const { handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const result = await handleRedirectCallback();
        const returnTo = result.appState?.returnTo || "/";
        navigate(returnTo);
      } catch (err) {
        console.error("Erreur pendant le callback Auth0 :", err);
        navigate("/error"); // ou une autre page d'erreur
      }
    };

    handleAuth();
  }, []);

  return <p>Connexion en cours...</p>;
}
