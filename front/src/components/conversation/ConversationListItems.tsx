import { AnimatePresence, motion } from "framer-motion";
import ConversationItem from "./ConversationItem";

interface Conversation {
  id: string;
  user: string;
  lastMessage?: string;
  title: string;
  createdAt: string;
}

interface ConversationListItemsProps {
  conversations: Conversation[];
  selectedConversation: number | null;
  unreadMessages: Record<string, boolean>;
  onSelectConversation: (id: string, title: string) => void;
  loading: boolean;
}

export default function ConversationListItems({
  conversations,
  selectedConversation,
  unreadMessages,
  onSelectConversation,
  loading,
}: ConversationListItemsProps) {
  return (
    <div className="divide-y divide-gray-200">
      <AnimatePresence>
        {conversations.length === 0 && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center text-gray-500"
          >
            No conversations yet
          </motion.p>
        )}

        {conversations.map((conv) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout
          >
            <ConversationItem
              conversation={conv}
              selected={selectedConversation == conv.id}
              onSelect={() => onSelectConversation(conv.id, conv.title)}
              onSelectToSetTitle={}
              hasUnread={conv.id != selectedConversation && !!unreadMessages[conv.id]}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
