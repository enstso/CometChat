// Import the `User` type from the generated GraphQL types.
// This represents the structure of a User object as defined in your GraphQL schema.
import type { User } from "../../gql/graphql";

// Define and export the `SearchBarType` type.
// This type is used to strongly type the props passed to a SearchBar component.
export type SearchBarType = {
  user: User; // The currently authenticated user using the search bar.
  onCreate: (userId: string, title: string | null) => void; // Function to call when creating a new item, takes the user's ID and an optional title.
  disabled?: boolean; // Optional boolean to disable the create button or entire search bar.
};
