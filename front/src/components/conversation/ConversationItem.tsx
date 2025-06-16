import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import { socket } from "../../services/webSocket";
import { useEffect, useState } from "react";
import type { ConversationItemProps } from "../../types/conversation";
import type { MessageType } from "../../types/message";

export default function ConversationItem({
  conversation,
  selected,
  onSelect,
  onSelectToSetTitle,
  hasUnread = false,
}: ConversationItemProps) {
  // State to store the last message content for this conversation
  const [lastMessage, setLastMessage] = useState<string>(
    conversation.lastMessage
  );
  // State to store the username of the sender of the last message
  const [lastMessageSender, setLastMessageSender] = useState<string>(
    conversation.lastMessageSender
  );

  // Effect to listen for real-time updates of the last message via WebSocket
  useEffect(() => {
    // Handler for incoming new messages related to this conversation
    const handleNewMessage = (message: MessageType) => {
      // Update state only if the message belongs to this conversation
      if (message.conversationId === conversation.id) {
        setLastMessage(message.content);
        setLastMessageSender(message.sender.username);
      }
    };

    // Subscribe to "getLastMessages" event on the socket
    socket.on("getLastMessages", handleNewMessage);

    // Cleanup listener on component unmount or conversation.id change
    return () => {
      socket.off("getLastMessages", handleNewMessage);
    };
  }, [conversation.id]);

  // Function to format ISO date string to a localized French date/time string
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Paris",
    });
  };

  return (
    // Animated container using framer-motion for smooth mount animation
    <motion.div
      initial={{ opacity: 0, y: 5 }} // Start with slight downward offset and transparent
      animate={{ opacity: 1, y: 0 }} // Animate to fully visible and normal position
      transition={{ duration: 0.25 }} // Animation duration 250ms
      onClick={() => {
        // Trigger onSelect callback with conversation id on click
        onSelect(conversation.id);
        // Set the conversation title using the provided callback
        onSelectToSetTitle(conversation.title);
      }}
      // Dynamic class names with conditional styles based on whether this item is selected
      className={cn(
        "p-4 cursor-pointer border-b border-gray-200 hover:bg-indigo-50 transition-colors rounded-md relative",
        selected ? "bg-indigo-100 font-semibold shadow-inner" : "bg-white"
      )}
    >
      {/* Header section containing conversation title and unread indicator */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-indigo-800 font-semibold truncate">
          {conversation.title}
        </p>
        {/* Show a red ping animation dot if the conversation has unread messages */}
        {hasUnread && (
          <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-ping absolute right-4 top-4" />
        )}
      </div>

      {/* Display the username or user related to the conversation */}
      <p className="text-xs text-gray-600 truncate">{conversation.user}</p>

      {/* Show the last message sender and content, or fallback text if none */}
      <p className="text-sm text-gray-500 truncate">
        {lastMessage
          ? `${lastMessageSender ?? "Unknown"}: ${lastMessage}`
          : "No messages yet"}
      </p>

      {/* Display the formatted creation date of the conversation */}
      <p className="text-xs text-gray-400 mt-1">
        {formatDate(conversation.createdAt)}
      </p>
    </motion.div>
  );
}
