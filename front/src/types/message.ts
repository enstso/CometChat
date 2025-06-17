// Import the `Message` type from the GraphQL schema types
import type { Message } from "../gql/graphql";

// Extend the base `Message` type to define a custom `MessageType`
// This allows adding extra properties used in the frontend
export type MessageType = Message & {
  fromMe?: boolean; // Indicates whether the message was sent by the current user (optional)
  conversationId?: string; // The ID of the conversation this message belongs to (optional)
};

// Define and export the `MessageListProps` type
// This represents the props expected by a message list component
export type MessageListProps = {
  messages: MessageType[]; // Array of messages to be displayed
  loading: boolean; // Indicates whether messages are still loading (e.g., during fetch)
  onScrollNearTop: () => void; // Function to call when user scrolls near the top (for infinite scroll or loading older messages)
};
