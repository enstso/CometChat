import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import { cn } from "../../lib/utils";

const fetchConversations = async (skip: number, take: number) => {
  return new Array(take).fill(null).map((_, i) => ({
    id: skip + i,
    user: `User ${skip + i}`,
    lastMessage: `Dernier message de User ${skip + i}`,
  }));
};

const ConversationItem = ({ conversation, onSelect, selected }: any) => (
  <div
    onClick={() => onSelect(conversation.id)}
    className={cn("p-4 cursor-pointer hover:bg-gray-100", selected && "bg-gray-200")}
  >
    <p className="font-semibold">{conversation.user}</p>
    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
  </div>
);

export default function ConversationList({ selectedConversation, onSelect }: any) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const conversationSkip = useRef(0);
  const conversationContainer = useRef<any>(null);

  useEffect(() => {
    loadMoreConversations();
  }, []);

  const loadMoreConversations = async () => {
    if (!hasMoreConversations || conversationLoading) return;
    setConversationLoading(true);
    const newConvs = await fetchConversations(conversationSkip.current, 20);
    setConversations((prev) => [...prev, ...newConvs]);
    conversationSkip.current += 20;
    if (newConvs.length < 20) setHasMoreConversations(false);
    setConversationLoading(false);
  };

  const handleScrollConversation = () => {
    const el = conversationContainer.current;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadMoreConversations();
    }
  };

  return (
    <div className="w-1/4 border-r border-gray-300 overflow-y-auto" onScroll={handleScrollConversation} ref={conversationContainer}>
      <div className="p-4 font-bold text-xl border-b">Conversations</div>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          selected={selectedConversation === conv.id}
          onSelect={onSelect}
        />
      ))}
      {conversationLoading && <div className="p-4 flex justify-center"><Spinner /></div>}
    </div>
  );
}