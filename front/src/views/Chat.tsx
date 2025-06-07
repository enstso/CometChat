import ConversationList from "../components/conversation/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/ui/Navbar";
import { useState } from "react";

export default function ChatView() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("Chat");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Add padding top */}
        <ConversationList
          selectedConversation={selectedConversation}
          onSelect={setSelectedConversation}
          onSelectToSetTitle={setTitle}
        />
        <ChatWindow selectedConversation={selectedConversation} title={title} />
      </div>
    </div>
  );
}
