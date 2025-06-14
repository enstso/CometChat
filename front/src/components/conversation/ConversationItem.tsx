import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { socket } from "../../services/webSocket";
import { useEffect, useState } from "react";

export default function ConversationItem({
  conversation,
  selected,
  onSelect,
  onSelectToSetTitle,
  hasUnread = false,
}: {
  onSelectToSetTitle: (title: string) => void;
  conversation: {
    id: string;
    user: string;
    lastMessage?: string;
    lastMessageSender?: string;
    title: string;
    createdAt: string;
  };
  selected: boolean;
  onSelect: (id: string) => void;
  hasUnread?: boolean;
}) {
  const [lastMessage, setLastMessage] = useState(conversation.lastMessage);
  const [lastMessageSender, setLastMessageSender] = useState(
    conversation.lastMessageSender
  );

  useEffect(() => {
    const handleNewMessage = (message: {
      conversationId: string;
      content: string;
      sender: { username: string };
      createdAt: string;
    }) => {

      if (message.conversationId === conversation.id) {
        setLastMessage(message.content);
        setLastMessageSender(message.sender.username);
      }
    };

    socket.on("getLastMessages", handleNewMessage);

    return () => {
      socket.off("getLastMessages", handleNewMessage);
    };
  }, [conversation.id]);

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
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => {
        onSelect(conversation.id);
        onSelectToSetTitle(conversation.title);
      }}
      className={cn(
        "p-4 cursor-pointer border-b border-gray-200 hover:bg-indigo-50 transition-colors rounded-md relative",
        selected ? "bg-indigo-100 font-semibold shadow-inner" : "bg-white"
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-indigo-800 font-semibold truncate">
          {conversation.title}
        </p>
        {hasUnread && (
          <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-ping absolute right-4 top-4" />
        )}
      </div>
      <p className="text-xs text-gray-600 truncate">{conversation.user}</p>
      <p className="text-sm text-gray-500 truncate">
        {lastMessage
          ? `${lastMessageSender ?? "Inconnu"}: ${lastMessage}`
          : "No messages yet"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {formatDate(conversation.createdAt)}
      </p>
    </motion.div>
  );
}
