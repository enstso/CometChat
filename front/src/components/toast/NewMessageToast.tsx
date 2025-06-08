import { useEffect, useState } from "react";
import { socket } from "../../services/webSocket";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

type ToastMessage = {
  conversationId: string;
  content: string;
  sender: {
    id: string;
    username: string;  // doit correspondre au backend
  };
  createdAt: string;
};

export default function NewMessageToast({
  onClickConversation,
}: {
  onClickConversation?: (conversationId: string) => void;
}) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
  const handleNewMessage = (message: ToastMessage) => {
    if (user && message.sender.id === user.sub) return;

    setMessages((prev) => [...prev, message]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m !== message));
    }, 5000);
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [user]);


  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-sm">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.createdAt}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            layout
            className="bg-white rounded-2xl shadow-lg border border-indigo-200 overflow-hidden cursor-pointer"
            onClick={() => {
              onClickConversation?.(msg.conversationId);
              setMessages((prev) => prev.filter((m) => m !== msg));
            }}
          >
            <div className="p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                {msg.sender.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-semibold">
                  Nouveau message de {msg.sender.username}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{msg.content}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
