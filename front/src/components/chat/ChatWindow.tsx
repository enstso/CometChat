import { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { cn } from "../../lib/utils";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_MESSAGES, GET_ME, SEND_MESSAGE } from "../../services/requestsGql";

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
  const [me, setMe] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const messageCursor = useRef<string | null>(null);
  const messageContainer = useRef<any>(null);

  const client = useApolloClient();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    const fetchMe = async () => {
      const { data } = await client.query({ query: GET_ME });
      setMe(data.me);
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (selectedConversation !== null && me) {
      setMessages([]);
      messageCursor.current = null;
      setHasMoreMessages(true);
      loadMoreMessages(selectedConversation);
    }
  }, [selectedConversation, me]);

  const loadMoreMessages = async (conversationId: number) => {
    if (!hasMoreMessages || loadingMessages) return;
    setLoadingMessages(true);

    try {
      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: {
          conversationId: String(conversationId),
          limit: 20,
          cursor: messageCursor.current,
        },
        fetchPolicy: "no-cache",
      });

      const newMessages = data.getMessages.edges.map((edge: any) => ({
        id: edge.node.id,
        content: edge.node.content,
        fromMe: edge.node.sender.username === me.username,
      }));

      setMessages((prev) => [...newMessages.reverse(), ...prev]);
      messageCursor.current = data.getMessages.pageInfo.endCursor;
      setHasMoreMessages(data.getMessages.pageInfo.hasNextPage);
    } catch (err) {
      console.error("Erreur lors du chargement des messages :", err);
    }

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

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage({
        variables: {
          sendMessageInput: {
            conversationId: String(selectedConversation),
            content: messageText,
            senderId: me.id,
          },
        },
      });

      const newMessage = {
        id: `temp-${Date.now()}`,
        content: messageText,
        fromMe: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");

      setTimeout(() => {
        const el = messageContainer.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    }
  };

  return (
    <div className="w-3/4 flex flex-col">
      <div className="border-b p-4 font-bold text-lg">
        {selectedConversation !== null
          ? `Conversation #${selectedConversation}`
          : "Sélectionnez une conversation"}
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col"
        onScroll={handleScrollMessages}
        ref={messageContainer}
      >
        {loadingMessages && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      {selectedConversation !== null && (
        <div className="p-4 border-t flex gap-2">
          <Input
            className="flex-1"
            placeholder="Écrivez un message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <Button onClick={handleSendMessage}>Envoyer</Button>
        </div>
      )}
    </div>
  );
}
