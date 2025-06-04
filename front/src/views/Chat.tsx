import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { useState } from "react";

export default function ChatView() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      <ConversationList selectedConversation={selectedConversation} onSelect={setSelectedConversation} />
      <ChatWindow selectedConversation={selectedConversation} />
    </div>
  );
}
