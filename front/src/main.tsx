import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import { setContext } from "@apollo/client/link/context";
import { Auth0Provider } from "@auth0/auth0-react";

const client = new ApolloClient({
  uri:import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

const authLink = setContext(async (_, { headers }) => {
  // On ne peut pas utiliser useAuth0 ici car c'est hors React
  // Donc on utilisera un petit hack : on stocke le token dans un contexte React ou on passe le token à Apollo autrement
  // Sinon on fait un client sans token et on récupère le token dans le composant

  // Ici on retourne juste les headers vides pour l'instant
  return {
    headers: {
      ...headers,
    },
  };
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={import.meta.env.VITE_AUTH0_AUDIENCE}
      scope={import.meta.env.VITE_AUTH0_SCOPE}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </Auth0Provider>
  </React.StrictMode>
);