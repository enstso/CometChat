import { useEffect, useState, useRef, useCallback } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useApolloClient, useMutation } from "@apollo/client";
import { GET_MESSAGES, SEND_MESSAGE } from "../../services/requestsGql";
import Message from "./Message";
import { useAuth0 } from "@auth0/auth0-react";
import { socket } from "../../services/webSocket";
import type { MessageType } from "../../types/message";
import type { ChatWindowType } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import type { MessageEdge } from "../../gql/graphql";

export default function ChatWindow({
  selectedConversation,
  title,
}: ChatWindowType) {
  const [messages, setMessages] = useState<MessageType[]>([]);
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
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  };

  const loadInitialMessages = useCallback(async () => {
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

      const fetchedMessages = data.getMessages.edges.map(
        (edge: MessageEdge) => ({
          id: edge.node.id,
          content: edge.node.content,
          fromMe: edge.node.sender.username === currentUser.nickname,
          createdAt: edge.node.createdAt,
          sender: edge.node.sender,
        })
      );

      const reversedMessages = fetchedMessages.reverse();
      setMessages(reversedMessages);

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setHasMore(true);
        setCursor(data.getMessages.pageInfo.endCursor);
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
      console.error("Error loading initial messages:", err);
    }

    setLoadingMessages(false);
  }, [selectedConversation, currentUser, client]);

  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages]);

  // Load more messages when user scrolls near top
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
          cursor,
        },
        fetchPolicy: "no-cache",
      });

      const fetchedMessages = data.getMessages.edges.map(
        (edge: MessageEdge) => ({
          id: edge.node.id,
          content: edge.node.content,
          fromMe: edge.node.sender.username === currentUser?.nickname,
          createdAt: edge.node.createdAt,
          sender: edge.node.sender,
        })
      );

      const reversedMessages = fetchedMessages.reverse();
      setMessages((prev) => [...reversedMessages, ...prev]);

      if (data.getMessages.pageInfo.hasPreviousPage) {
        setCursor(data.getMessages.pageInfo.endCursor);
      } else {
        setHasMore(false);
        setCursor(null);
      }

      // Maintain scroll position after loading
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < 50) {
      loadMoreMessages();
    }
  };

  // Optimistic UI for sending messages
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    const tempMessage: MessageType = {
      id: "temp-" + Date.now(),
      content: messageText,
      fromMe: true,
      createdAt: new Date().toISOString(),
      sender: {
        id: "",
        auth0Id: currentUser.sub ?? "",
        username: currentUser.nickname ?? "",
      },
      conversationId: selectedConversation,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    // Scroll to bottom after sending
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      const socketId = socket.id;
      await sendMessage({
        variables: {
          sendMessageInput: {
            conversationId: String(selectedConversation),
            content: messageText,
            senderId: currentUser.sub,
            socketId: socketId,
          },
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const handleIncomingMessage = (msg: MessageType) => {
      if (msg.conversationId !== selectedConversation) return;

      // Ne traite pas les messages que j'ai envoyés moi-même
      if (msg.sender.username === currentUser.nickname) return;

      const alreadyExists = messages.some((m) => m.id === msg.id);
      if (alreadyExists) return;

      const fromMe = false;
      setMessages((prev) => [...prev, { ...msg, fromMe }]);

      if (isScrolledToBottom()) {
        setTimeout(() => {
          scrollToBottom();
          setNewMessageIndicator(false);
        }, 50);
      } else {
        setNewMessageIndicator(true);
      }
    };

    socket.emit("join", selectedConversation);
    socket.off("newMessage", handleIncomingMessage);

    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [selectedConversation, messages, currentUser]);

  const handleNewMessageClick = () => {
    scrollToBottom();
    setNewMessageIndicator(false);
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
      <div className="border-b p-4 font-bold text-lg bg-gray-50">
        {selectedConversation !== null ? title : "Select a conversation"}
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ scrollbarWidth: "thin" }}
        role="list"
        aria-label="Messages"
      >
        {loadingMessages && (
          <div className="flex justify-center mb-2">
            <Spinner />
          </div>
        )}

        {messages.length === 0 && !loadingMessages && (
          <p className="text-center text-gray-400 mt-4">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg) => (
          <Message key={uuidv4()} message={msg} />
        ))}
      </div>

      {newMessageIndicator && (
        <button
          onClick={handleNewMessageClick}
          className="absolute bottom-20 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          aria-label="Scroll to new message"
        >
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          New message
        </button>
      )}

      {selectedConversation !== null && (
        <div className="p-4 border-t flex gap-2 bg-gray-50">
          <Input
            className="flex-1"
            placeholder="Write a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loadingMessages}
            aria-label="Message input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loadingMessages || !messageText.trim()}
            aria-label="Send message"
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
