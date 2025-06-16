// Define and export a type for the props of a conversation list component
export type ConversationListProps = {
  selectedConversation: string | null; // ID of the currently selected conversation, or null if none is selected
  unreadMessages: Record<string, boolean>; // A record indicating which conversations have unread messages (by ID)
  onSelect: (id: string) => void; // Function called when a conversation is selected, passing its ID
  onSelectToSetTitle: (title: string) => void; // Function to update the UI with the selected conversation's title
  setUnreadMessages: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >; // Setter function to update the unread messages state
};

// Define and export a type representing a single conversation object
export type ConversationType = {
  id: string; // Unique identifier for the conversation
  title: string; // Title or name of the conversation
  user: string; // Name or identifier of the user who owns or is involved in the conversation
  lastMessage: string; // Content of the last message sent in the conversation
  lastMessageSender: string; // Username of the sender of the last message
  createdAt: string; // ISO date string representing when the conversation was created
};

// Define and export a type for the props passed to an individual conversation item component
export type ConversationItemProps = {
  conversation: ConversationType; // The conversation data being represented by the component
  selected: boolean; // Whether this conversation is currently selected
  hasUnread: boolean; // Whether this conversation has unread messages
  onSelectToSetTitle: (title: string) => void; // Function to update the title in the parent component
  onSelect: (id: string) => void; // Function to handle selecting this conversation
};
