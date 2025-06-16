// Import necessary Apollo Client utilities for setup
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
// Import utility to set context (for setting headers on requests)
import { setContext } from "@apollo/client/link/context";

// Create an HTTP link pointing to the GraphQL endpoint URL from environment variables
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_URL,
});

// Factory function to create a new Apollo Client instance with authentication
// Accepts a function to asynchronously get the ID token claims (JWT)
export const createApolloClient = (getIdTokenClaims: () => Promise<string>) => {
  // Create an auth link that sets the Authorization header on each request
  const authLink = setContext(async (_, { headers }) => {
    // Await the token from the provided getIdTokenClaims function
    const token = await getIdTokenClaims();
    // Return new headers including the Authorization bearer token if available
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Create and return a new Apollo Client instance configured with:
  // - The auth link concatenated with the HTTP link for making requests
  // - An in-memory cache for caching query results
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
