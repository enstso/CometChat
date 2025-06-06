import ConversationList from "../components/conversation/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/ui/Navbar";
import { useState } from "react";

export default function ChatView() {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <ConversationList
            selectedConversation={selectedConversation}
            onSelect={setSelectedConversation}
          />
          <ChatWindow selectedConversation={selectedConversation} />
        </div>
      </div>
    );
  }
  
