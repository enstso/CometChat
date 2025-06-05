import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import Navbar from "./Navbar";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ChatView() {
    const { isAuthenticated, isLoading } = useAuth0();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  
    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p>Non autorisé. Veuillez vous connecter.</p>
        </div>
      );
    }
  
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
  
