import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { createApolloClient } from "../../services/apolloClient";

// React component wrapping children with ApolloProvider configured with an Apollo client
export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extract getIdTokenClaims function from Auth0 hook to retrieve the user's ID token
  const { getIdTokenClaims } = useAuth0();

  // Memoize Apollo client creation to avoid unnecessary re-instantiations
  // createApolloClient receives a function returning a Promise with the token string (__raw contains the raw JWT)
  // The client will be recreated only if getIdTokenClaims changes
  const client = useMemo(
    () =>
      createApolloClient(() =>
        getIdTokenClaims().then((claims) => claims?.__raw || "")
      ),
    [getIdTokenClaims]
  );

  // Render ApolloProvider with the created client wrapping children components
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
