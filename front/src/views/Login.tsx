import { gql, useApolloClient } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import type { LogoutOptions } from "@auth0/auth0-react";

export default function Login() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
  } = useAuth0();

  const client = useApolloClient(); // 👈 utilise le client global

  const callApi = async () => {
    const GET_ME = gql`
      query Me {
        me {
          id
          email
          name
        }
      }
    `;

    try {
      const result = await client.query({
        query: GET_ME,
        fetchPolicy: "no-cache",
      });
      console.log("GraphQL Result:", result);
    } catch (error) {
      console.error("Erreur GraphQL :", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Se connecter</button>
      ) : (
        <>
          <p>Bienvenue {user?.nickname}</p>
          <button onClick={callApi}>Appeler l'API</button>
          <button
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              } as LogoutOptions)
            }
          >
            Déconnexion
          </button>
        </>
      )}
    </div>
  );
}
