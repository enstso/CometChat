import { useEffect, useState } from "react";
import { socket } from "../../services/webSocket";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import type { MessageType } from "../../types/message";

export default function NewMessageToast({
  onClickConversation,
}: {
  onClickConversation?: (conversationId: string) => void;
}) {
  // State to keep track of incoming new messages for toast display
  const [messages, setMessages] = useState<MessageType[]>([]);
  // Get current user info from Auth0
  const { user } = useAuth0();

  useEffect(() => {
    // Handler for new messages received via websocket
    const handleNewMessage = (message: MessageType) => {
      // Ignore messages sent by the current user
      if (user && message.sender.id === user.sub) return;

      // Add the new message to the toast queue
      setMessages((prev) => [...prev, message]);

      // Remove the message from the toast queue after 5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m !== message));
      }, 5000);
    };

    // Listen for 'newMessage' events on the socket connection
    socket.on("newMessage", handleNewMessage);

    // Cleanup listener when component unmounts or user changes
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [user]);

  return (
    // Container fixed at bottom-right corner to display message toasts
    <div className="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-sm">
      {/* AnimatePresence for smooth mounting/unmounting animations */}
      <AnimatePresence>
        {messages.map((msg) => (
          // Animated motion div for each toast notification
          <motion.div
            key={msg.createdAt} // Use createdAt as key (assuming uniqueness)
            initial={{ opacity: 0, y: 30 }} // Initial state: transparent and shifted down
            animate={{ opacity: 1, y: 0 }} // Animate to fully visible and positioned
            exit={{ opacity: 0, y: 30 }} // Exit animation: fade out and shift down
            layout
            className="bg-white rounded-2xl shadow-lg border border-indigo-200 overflow-hidden cursor-pointer"
            onClick={() => {
              // When toast clicked, invoke optional handler with conversation ID
              onClickConversation?.(msg.conversationId ?? "");
              // Remove the clicked message from the toast list
              setMessages((prev) => prev.filter((m) => m !== msg));
            }}
          >
            <div className="p-4 flex items-start gap-3">
              {/* Circle avatar with first letter of sender's username */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                {msg.sender.username.charAt(0).toUpperCase()}
              </div>
              {/* Message content area */}
              <div className="flex-1">
                {/* Bold sender info text */}
                <p className="text-sm text-gray-800 font-semibold">
                  New message from {msg.sender.username}
                </p>
                {/* Message preview, limited to 2 lines */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {msg.content}
                </p>
              </div>
              {/* Button to manually close/dismiss the toast */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onClick on parent
                  setMessages((prev) => prev.filter((m) => m !== msg));
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
