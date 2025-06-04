import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { createApolloClient } from "../../services/apolloClient";

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently } = useAuth0();

  const client = useMemo(
    () => createApolloClient(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
