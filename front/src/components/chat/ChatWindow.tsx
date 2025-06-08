import { useEffect, useState, useRef } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { socket } from "../../services/webSocket";

import { GET_MESSAGES, SEND_MESSAGE } from "../../services/requestsGql";

import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import NewMessageIndicator from "./NewMessageIndicator";
import MessageInputArea from "./MessageInputArea";

export default function ChatWindow({ selectedConversation, title }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);

  const { user: currentUser } = useAuth0();
  const client = useApolloClient();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  const isScrolledToBottom = () => {
    if (!messagesContainerRef.current) return false;
    const el = messagesContainerRef.current;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  };

  // Charge initial messages
  const loadInitialMessages = async () => {
    if (!selectedConversation || !currentUser) return;
    setLoadingMessages(true);
    setHasMore(true);
    setCursor(null);

    try {
      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: { conversationId: String(selectedConversation), limit: 20, cursor: null },
        fetchPolicy: "no-cache",
      });

      const fetchedMessages = data.getMessages.edges.map((edge: any) => ({
        id: edge.node.id,
        content: edge.node.content,
        fromMe: edge.node.sender.username === currentUser.nickname,
        createdAt: edge.node.createdAt,
        sender: edge.node.sender,
      }));

      setMessages(fetchedMessages.reverse());

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setHasMore(true);
        setCursor(data.getMessages.pageInfo.endCursor);
      } else {
        setHasMore(false);
        setCursor(null);
      }
    } catch (err) {
      console.error("Error loading initial messages:", err);
    }

    setLoadingMessages(false);
  };

  // Charge messages plus anciennes
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMoreRef.current || !selectedConversation || !cursor) return;

    loadingMoreRef.current = true;
    setLoadingMessages(true);

    try {
      const scrollContainer = messagesContainerRef.current;
      if (!scrollContainer) return;

      const oldScrollHeight = scrollContainer.scrollHeight;

      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: { conversationId: String(selectedConversation), limit: 20, cursor },
        fetchPolicy: "no-cache",
      });

      const fetchedMessages = data.getMessages.edges.map((edge: any) => ({
        id: edge.node.id,
        content: edge.node.content,
        fromMe: edge.node.sender.username === currentUser.nickname,
        createdAt: edge.node.createdAt,
        sender: edge.node.sender,
      }));

      setMessages((prev) => [...fetchedMessages.reverse(), ...prev]);

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setCursor(data.getMessages.pageInfo.endCursor);
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
      console.error("Error loading older messages:", err);
    }

    setLoadingMessages(false);
    loadingMoreRef.current = false;
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      content: messageText,
      fromMe: true,
      createdAt: new Date().toISOString(),
      sender: { username: currentUser.nickname },
      conversationId: selectedConversation,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    // scrollToBottom sera déclenché automatiquement via le useEffect messages (voir plus bas)

    try {
      const socketId = socket.id;
      await sendMessage({
        variables: {
          sendMessageInput: {
            conversationId: String(selectedConversation),
            content: messageText,
            senderId: currentUser.sub,
            socketId,
          },
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    loadInitialMessages();
  }, [selectedConversation, currentUser, client]);

  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const handleIncomingMessage = (msg: any) => {
      if (msg.conversationId !== selectedConversation) return;
      if (msg.sender.username === currentUser.nickname) return;

      const alreadyExists = messages.some((m) => m.id === msg.id);
      if (alreadyExists) return;

      setMessages((prev) => [...prev, { ...msg, fromMe: false }]);

      if (isScrolledToBottom()) {
        setNewMessageIndicator(false);
      } else {
        setNewMessageIndicator(true);
      }
    };

    socket.emit("join", selectedConversation);
    socket.off("newMessage", handleIncomingMessage);
    socket.on("newMessage", handleIncomingMessage);

    return () => socket.off("newMessage", handleIncomingMessage);
  }, [selectedConversation, currentUser, messages]);

  // ** Ajout du useEffect pour scroll automatique à chaque update des messages **
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessageClick = () => {
    socket.emit("join", selectedConversation);
    scrollToBottom();
    setNewMessageIndicator(false);
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col bg-white shadow-md rounded-lg overflow-hidden relative">
      <ChatHeader title={title} hasConversation={selectedConversation !== null} />
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <MessagesList messages={messages} loading={loadingMessages} onScrollNearTop={loadMoreMessages} />
      </div>
      {newMessageIndicator && <NewMessageIndicator onClick={handleNewMessageClick} />}
      {selectedConversation !== null && (
        <MessageInputArea
          messageText={messageText}
          setMessageText={setMessageText}
          onSendMessage={handleSendMessage}
          disabled={loadingMessages} 
        />
      )}
    </div>
  );
}
