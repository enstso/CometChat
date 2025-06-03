import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import type { LogoutOptions } from "@auth0/auth0-react"; // 👈 ici

export default function Login() {
  const {
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
  } = useAuth0();

  const callApi = async () => {
    const token = await getAccessTokenSilently();
    console.log("Token:", token);

    const client = new ApolloClient({
      uri: import.meta.env.VITE_API_URL,
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const GET_ME = gql`
      query Me {
        me {
          id
          email
          name
        }
      }
    `;

    const result = await client.query({
      query: GET_ME,
      fetchPolicy: "no-cache",
    });
    console.log("GraphQL Result:", result);
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
