// Import React and ReactDOM for rendering the app
import React from "react";
import ReactDOM from "react-dom/client";

// Import the main App component
import App from "./App";

// Import Auth0 provider for authentication context
import { Auth0Provider } from "@auth0/auth0-react";

// Import ApolloWrapper to provide Apollo Client context
import ApolloWrapper from "./components/apollo/ApolloWrapper";

// Create root and render the application wrapped with Auth0 and Apollo providers
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Auth0Provider manages authentication state and config */}
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN} // Auth0 domain from environment variables
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID} // Auth0 client ID from environment variables
      authorizationParams={{
        redirect_uri: `${window.location.origin}/auth/callback`, // Redirect URI after login
        audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Auth0 audience for API access
        scope: import.meta.env.VITE_AUTH0_SCOPE, // Requested scopes for authentication
      }}
    >
      {/* ApolloWrapper provides Apollo Client context for GraphQL */}
      <ApolloWrapper>
        {/* Render the main application component */}
        <App />
      </ApolloWrapper>
    </Auth0Provider>
  </React.StrictMode>
);
