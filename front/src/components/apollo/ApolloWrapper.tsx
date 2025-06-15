import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { createApolloClient } from "../../services/apolloClient";

export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getIdTokenClaims } = useAuth0();
  const client = useMemo(
    () =>
      createApolloClient(() =>
        getIdTokenClaims().then((claims) => claims?.__raw || "")
      ),
    [getIdTokenClaims]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
