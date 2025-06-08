import { useState } from "react";
import ConversationList from "../components/conversation/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "../components/ui/Navbar";
import NewMessageToast from "../components/toast/NewMessageToast";

export default function ChatView() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Chat");

  const handleOpenConversation = (conversationId: string) => {
    console.log("Opening conversation:", conversationId);
    setSelectedConversation(conversationId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        <ConversationList
          selectedConversation={selectedConversation}
          onSelect={setSelectedConversation}
          onSelectToSetTitle={setTitle}
        />
        <ChatWindow selectedConversation={selectedConversation} title={title} />
      </div>

  
      {/* Toast Notifications */}
      <NewMessageToast onClickConversation={handleOpenConversation} />
    </div>
  );
}
