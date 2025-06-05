// apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

export const createApolloClient = (getAccessTokenSilently: () => Promise<string>) => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessTokenSilently();
    console.log("Token:", token);
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
