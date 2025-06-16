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
  // State for storing messages in the current conversation
  const [messages, setMessages] = useState<MessageType[]>([]);
  // Loading state for fetching messages
  const [loadingMessages, setLoadingMessages] = useState(false);
  // Controlled input for the message text
  const [messageText, setMessageText] = useState("");
  // Whether there are more messages to load from the server
  const [hasMore, setHasMore] = useState(true);
  // Cursor for pagination to fetch older messages
  const [cursor, setCursor] = useState<string | null>(null);
  // Flag to show indicator for new incoming messages when scrolled up
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);

  // Get current authenticated user info from Auth0
  const { user: currentUser } = useAuth0();
  // Apollo client instance to query data
  const client = useApolloClient();
  // Apollo mutation hook to send messages
  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Ref to the div that contains the message list (for scrolling)
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Ref to prevent multiple concurrent loads of older messages
  const loadingMoreRef = useRef(false);

  // Check if the user is scrolled near the bottom of the messages container
  const isScrolledToBottom = () => {
    if (!messagesContainerRef.current) return false;
    const el = messagesContainerRef.current;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  // Scroll the messages container to the bottom
  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  };

  // Load initial batch of messages when a conversation is selected or user changes
  const loadInitialMessages = useCallback(async () => {
    if (!selectedConversation || !currentUser) return;

    setLoadingMessages(true);
    setHasMore(true);
    setCursor(null);

    try {
      // Query the server for messages of the selected conversation, no-cache to avoid stale data
      const { data } = await client.query({
        query: GET_MESSAGES,
        variables: {
          conversationId: String(selectedConversation),
          limit: 20,
          cursor: null,
        },
        fetchPolicy: "no-cache",
      });

      // Map the fetched messages to the shape used by the UI
      const fetchedMessages = data.getMessages.edges.map(
        (edge: MessageEdge) => ({
          id: edge.node.id,
          content: edge.node.content,
          fromMe: edge.node.sender.username === currentUser.nickname,
          createdAt: edge.node.createdAt,
          sender: edge.node.sender,
        })
      );

      // Reverse to display messages in chronological order
      const reversedMessages = fetchedMessages.reverse();
      setMessages(reversedMessages);

      // Update pagination info
      if (data.getMessages.pageInfo.hasPreviousPage) {
        setHasMore(true);
        setCursor(data.getMessages.pageInfo.endCursor);
      } else {
        setHasMore(false);
        setCursor(null);
      }

      // Scroll to bottom shortly after messages load
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

  // Reload initial messages whenever selected conversation or user changes
  useEffect(() => {
    loadInitialMessages();
  }, [loadInitialMessages]);

  // Function to load older messages when user scrolls near the top
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMoreRef.current || !selectedConversation || !cursor)
      return;

    loadingMoreRef.current = true;
    setLoadingMessages(true);

    try {
      const scrollContainer = messagesContainerRef.current;
      if (!scrollContainer) return;

      const oldScrollHeight = scrollContainer.scrollHeight;

      // Query the server for older messages before the current cursor
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

      // Reverse messages and prepend them to current messages
      const reversedMessages = fetchedMessages.reverse();
      setMessages((prev) => [...reversedMessages, ...prev]);

      // Update pagination cursor and hasMore flag
      if (data.getMessages.pageInfo.hasPreviousPage) {
        setCursor(data.getMessages.pageInfo.endCursor);
      } else {
        setHasMore(false);
        setCursor(null);
      }

      // Maintain scroll position after prepending messages to avoid jump
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

  // Handle scroll event to detect if user scrolled near the top to load more messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < 50) {
      loadMoreMessages();
    }
  };

  // Optimistic UI: handle sending a message, add it immediately to UI, then send to server
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !currentUser) return;

    // Create a temporary message object for immediate UI update
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

    // Add the temp message to the messages list
    setMessages((prev) => [...prev, tempMessage]);
    // Clear the input field
    setMessageText("");

    // Scroll to bottom shortly after sending
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      // Send message to backend through mutation and include current socket ID
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

  // Effect to listen for incoming messages via websocket
  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    // Handler for new messages received from socket server
    const handleIncomingMessage = (msg: MessageType) => {
      // Ignore messages from other conversations
      if (msg.conversationId !== selectedConversation) return;

      // Ignore messages sent by the current user
      if (msg.sender.username === currentUser.nickname) return;

      // Ignore duplicate messages already in state
      const alreadyExists = messages.some((m) => m.id === msg.id);
      if (alreadyExists) return;

      // Mark message as not sent by current user
      const fromMe = false;
      setMessages((prev) => [...prev, { ...msg, fromMe }]);

      // If user is scrolled near bottom, scroll to show new message
      if (isScrolledToBottom()) {
        setTimeout(() => {
          scrollToBottom();
          setNewMessageIndicator(false);
        }, 50);
      } else {
        // Otherwise show new message indicator button
        setNewMessageIndicator(true);
      }
    };

    // Join the socket room for the selected conversation
    socket.emit("join", selectedConversation);
    // Remove previous listener to avoid duplicates
    socket.off("newMessage", handleIncomingMessage);
    // Listen for new messages on socket
    socket.on("newMessage", handleIncomingMessage);

    // Cleanup listener on unmount or dependencies change
    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [selectedConversation, messages, currentUser]);

  // Scroll to bottom and hide new message indicator when indicator clicked
  const handleNewMessageClick = () => {
    scrollToBottom();
    setNewMessageIndicator(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {/* Messages container with scroll and max height */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-1 p-4 space-y-2 bg-gray-100 rounded"
      >
        {loadingMessages && <Spinner />}
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* New message indicator button */}
      {newMessageIndicator && (
        <button
          onClick={handleNewMessageClick}
          className="bg-purple-600 text-white py-1 px-4 rounded-full mt-2 self-center"
        >
          New messages
        </button>
      )}

      {/* Input and send button */}
      <div className="flex mt-4 space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-grow"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}
