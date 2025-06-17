// Import React's useState hook and necessary components for the chat interface
import { useState } from "react";
import ConversationList from "../components/conversation/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/ui/Navbar";
import NewMessageToast from "../components/toast/NewMessageToast";

// Define the main ChatView component
export default function ChatView() {
  // State to track the currently selected conversation ID; null if none selected
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  // State to hold the chat window's title, initialized as "Chat"
  const [title, setTitle] = useState<string>("Chat");
  // State object to keep track of conversations with unread messages
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>(
    {}
  );

  // Handler to open a conversation when selected
  // Also removes the conversation ID from unread messages to mark as read
  const handleOpenConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[conversationId]; // Remove the conversation from unread tracking
      return updated;
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Render the top navigation bar */}
      <Navbar />
      {/* Main content area containing the conversation list and chat window */}
      <div className="flex flex-1 overflow-hidden pt-16">
        <ConversationList
          selectedConversation={selectedConversation} // Currently selected conversation ID
          onSelect={setSelectedConversation} // Function to update selected conversation
          onSelectToSetTitle={setTitle} // Function to update chat window title
          unreadMessages={unreadMessages} // Object tracking unread messages per conversation
          setUnreadMessages={setUnreadMessages} // Setter function to update unread messages state
        />
        {/* Chat window for displaying messages of the selected conversation */}
        <ChatWindow selectedConversation={selectedConversation} title={title} />
      </div>

      {/* Toast notification component for new messages; opens conversation on click */}
      <NewMessageToast onClickConversation={handleOpenConversation} />
    </div>
  );
}