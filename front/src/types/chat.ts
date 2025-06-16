// Define and export a TypeScript type named `ChatWindowType`
// This type is used to represent the state or props of a chat window component
export type ChatWindowType = {
  title: string; // The title of the chat window, likely the conversation title
  selectedConversation: string | null; // The ID of the currently selected conversation, or null if none is selected
};
