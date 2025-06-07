import { useEffect, useState, useRef } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_MESSAGES, SEND_MESSAGE } from "../../services/requestsGql";
import Message from "./Message";
import { useAuth0 } from "@auth0/auth0-react";

export default function ChatWindow({ selectedConversation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const { user: currentUser } = useAuth0();
  const client = useApolloClient();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  // Chargement initial
  const loadInitialMessages = async () => {
    if (!selectedConversation || !currentUser) return;

    setLoadingMessages(true);
    setHasMore(true);
    setCursor(null);

    try {
      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: {
          conversationId: String(selectedConversation),
          limit: 20,
          cursor: null,
        },
        fetchPolicy: "no-cache",
      });

      const fetchedMessages = data.getMessages.edges.map((edge: any) => ({
        id: edge.node.id,
        content: edge.node.content,
        fromMe: edge.node.sender.username === currentUser.nickname,
        createdAt: edge.node.createdAt,
        sender: edge.node.sender,
      }));

      const reversedMessages = fetchedMessages.reverse();
      setMessages(reversedMessages);

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setHasMore(true);
        setCursor(data.getMessages.pageInfo.endCursor); // 🔧 correct ici
      } else {
        setHasMore(false);
        setCursor(null);
      }

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    } catch (err) {
      console.error("Erreur lors du chargement initial des messages :", err);
    }

    setLoadingMessages(false);
  };

  useEffect(() => {
    loadInitialMessages();
  }, [selectedConversation, currentUser, client]);

  // Scroll vers le haut = chargement plus de messages
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMoreRef.current || !selectedConversation || !cursor)
      return;

    loadingMoreRef.current = true;
    setLoadingMessages(true);

    try {
      const scrollContainer = messagesContainerRef.current;
      if (!scrollContainer) return;

      const oldScrollHeight = scrollContainer.scrollHeight;

      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: {
          conversationId: String(selectedConversation),
          limit: 20,
          cursor: cursor,
        },
        fetchPolicy: "no-cache",
      });

      const fetchedMessages = data.getMessages.edges.map((edge: any) => ({
        id: edge.node.id,
        content: edge.node.content,
        fromMe: edge.node.sender.username === currentUser.nickname,
        createdAt: edge.node.createdAt,
        sender: edge.node.sender,
      }));

      const reversedMessages = fetchedMessages.reverse();
      setMessages((prev) => [...reversedMessages, ...prev]);

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setCursor(data.getMessages.pageInfo.endCursor); // 🔧 correct ici
      } else {
        setHasMore(false);
        setCursor(null);
      }

      setTimeout(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - oldScrollHeight;
        }
      }, 50);
    } catch (err) {
      console.error("Erreur lors du chargement des anciens messages :", err);
    }

    setLoadingMessages(false);
    loadingMoreRef.current = false;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 50) {
      loadMoreMessages();
    }
  };

  // Envoi du message avec ajout optimiste
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      content: messageText,
      fromMe: true,
      createdAt: new Date().toISOString(),
      sender: { username: currentUser.nickname },
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      await sendMessage({
        variables: {
          sendMessageInput: {
            conversationId: String(selectedConversation),
            content: messageText,
            senderId: currentUser.sub,
          },
        },
      });

      // Optionnel : rechargement pour synchro
      // await loadInitialMessages();
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
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ scrollbarWidth: "thin" }}
      >
        {loadingMessages && (
          <div className="flex justify-center mb-2">
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
            disabled={loadingMessages}
          />
          <Button onClick={handleSendMessage} disabled={loadingMessages}>
            Envoyer
          </Button>
        </div>
      )}
    </div>
  );
}
