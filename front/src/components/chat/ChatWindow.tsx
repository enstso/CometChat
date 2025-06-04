import { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { cn } from "../../lib/utils";

const fetchMessages = async (conversationId: number, skip: number, take: number) => {
  return new Array(take).fill(null).map((_, i) => ({
    id: skip + i,
    fromMe: (skip + i) % 2 === 0,
    content: `Message ${(skip + i)} dans conversation ${conversationId}`,
  }));
};

const Message = ({ message }: any) => (
  <div
    className={cn(
      "px-4 py-2 rounded-lg my-2 max-w-xs",
      message.fromMe ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
    )}
  >
    {message.content}
  </div>
);

export default function ChatWindow({ selectedConversation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messageSkip = useRef(0);
  const messageContainer = useRef<any>(null);

  useEffect(() => {
    if (selectedConversation !== null) {
      setMessages([]);
      messageSkip.current = 0;
      setHasMoreMessages(true);
      loadMoreMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadMoreMessages = async (conversationId: number) => {
    if (!hasMoreMessages || loadingMessages) return;
    setLoadingMessages(true);
    const newMsgs = await fetchMessages(conversationId, messageSkip.current, 20);
    setMessages((prev) => [...newMsgs.reverse(), ...prev]);
    messageSkip.current += 20;
    if (newMsgs.length < 20) setHasMoreMessages(false);
    setLoadingMessages(false);
  };

  const handleScrollMessages = () => {
    const el = messageContainer.current;
    if (el.scrollTop <= 10) {
      const previousScrollHeight = el.scrollHeight;
      loadMoreMessages(selectedConversation);
      setTimeout(() => {
        el.scrollTop = el.scrollHeight - previousScrollHeight;
      }, 100);
    }
  };

  return (
    <div className="w-3/4 flex flex-col">
      <div className="border-b p-4 font-bold text-lg">{selectedConversation !== null ? `Conversation #${selectedConversation}` : "Sélectionnez une conversation"}</div>
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col"
        onScroll={handleScrollMessages}
        ref={messageContainer}
      >
        {loadingMessages && <div className="flex justify-center"><Spinner /></div>}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      {selectedConversation !== null && (
        <div className="p-4 border-t flex gap-2">
          <Input className="flex-1" placeholder="Écrivez un message..." />
          <Button>Envoyer</Button>
        </div>
      )}
    </div>
  );
}