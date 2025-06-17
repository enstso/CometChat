import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import { useApolloClient } from "@apollo/client";
import {
  SEARCH_USERS,
  CREATE_CONVERSATION,
  GET_USER_CONVERSATIONS,
} from "../../services/requestsGql";
import Input from "../ui/Input";
import ConversationItem from "./ConversationItem";
import SearchUserItem from "../ui/SearchBar";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../services/webSocket";
import type {
  ConversationListProps,
  ConversationType,
} from "../../types/conversation";
import type { ConversationEdge, User } from "../../gql/graphql";

export default function ConversationList({
  selectedConversation,
  onSelectToSetTitle,
  onSelect,
  unreadMessages,
  setUnreadMessages,
}: ConversationListProps) {
  // State for storing conversations list
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  // Loading state for conversations fetch
  const [conversationLoading, setConversationLoading] = useState(false);
  // Ref for the scroll container of conversations
  const conversationContainer = useRef<HTMLDivElement>(null);
  // State for the search input value
  const [search, setSearch] = useState("");
  // State for search results of users
  const [searchResults, setSearchResults] = useState<User[]>([]);
  // State indicating if a new conversation is being created
  const [creating, setCreating] = useState(false);

  // Ref to track currently selected conversation ID for comparison
  const selectedConversationRef = useRef<string | null>(null);

  // Apollo client instance for GraphQL queries and mutations
  const client = useApolloClient();
  // Auth0 user info
  const { user } = useAuth0();
  // Current logged-in user's ID
  const currentUserId: string | undefined = user?.sub;

  // Effect to fetch the user's conversations on mount or user ID change
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;

      setConversationLoading(true);
      try {
        // Query user conversations from the backend
        const { data } = await client.query({
          query: GET_USER_CONVERSATIONS,
          variables: { cursor: null, limit: 20 },
          fetchPolicy: "no-cache",
        });

        // Map GraphQL response edges to ConversationType objects
        const fetchedConversations: ConversationType[] =
          data.getUserConversations.edges.map((edge: ConversationEdge) => {
            const participants = edge.node.participants || [];
            // Find the other participant (not the current user)
            const otherParticipant = participants.find(
              (p: { user: User }) => p.user.auth0Id !== currentUserId
            );
            return {
              id: edge.node.id,
              title: edge.node.title || "Untitled Conversation",
              user: otherParticipant?.user.username || "Unknown",
              lastMessage:
                edge.node.messages && edge.node.messages.length > 0
                  ? edge.node.messages[0].content
                  : "New conversation",
              lastMessageSender:
                edge.node.messages && edge.node.messages.length > 0
                  ? edge.node.messages[0].sender.username
                  : "",
              createdAt:
                edge.node.messages && edge.node.messages.length > 0
                  ? edge.node.messages[0].createdAt
                  : "",
            };
          });

        setConversations(fetchedConversations);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setConversationLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, client]);

  // Effect to debounce and execute user search queries based on input
  useEffect(() => {
    if (search.length === 0) {
      setSearchResults([]);
      return;
    }

    // Debounce search input by 300ms
    const handler = setTimeout(async () => {
      try {
        // Query backend for users matching search term
        const { data } = await client.query({
          query: SEARCH_USERS,
          variables: { query: search },
          fetchPolicy: "no-cache",
        });
        setSearchResults(data.searchUsers);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }, 300);

    // Cleanup timeout on input change or unmount
    return () => clearTimeout(handler);
  }, [search, client]);

  // Scroll handler for conversation list (placeholder for future pagination)
  const handleScrollConversation = () => {
    const el = conversationContainer.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      // Future pagination can be implemented here
    }
  };

  // Function to create a new conversation between current user and selected user
  const handleCreateConversation = async (
    userId: string,
    title: string | null
  ) => {
    if (!currentUserId) return;

    setCreating(true);
    try {
      // Perform GraphQL mutation to create conversation
      const { data } = await client.mutate({
        mutation: CREATE_CONVERSATION,
        variables: {
          input: {
            title: title || "New Conversation",
            userId1: currentUserId,
            userId2: userId,
          },
        },
      });

      const newConversation = data.createConversation;
      // Add the newly created conversation at the top of the list
      setConversations((prev) => [
        {
          id: newConversation.id,
          user: newConversation.participants.find(
            (p: { user: User }) => p.user.id === userId
          )?.user.username,
          lastMessage: "New conversation",
          lastMessageSender: "",
          title: newConversation.title,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      // Select the newly created conversation and set its title
      onSelect(newConversation.id);
      onSelectToSetTitle(newConversation.title);
      // Clear search input and results
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error creating conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  // Effect to setup WebSocket connection and listen for new messages
  useEffect(() => {
    socket.connect();

    // Handler for incoming new messages
    const handleNewMessage = (data: {
      conversationId: string;
      content: string;
      sender: User;
    }) => {
      // Mark as unread if the new message belongs to a conversation not currently selected
      if (data.conversationId !== selectedConversationRef.current) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.conversationId]: true,
        }));
      }

      // Update last message content and sender in the conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.content,
                lastMessageSender: data.sender.username,
              }
            : conv
        )
      );
    };

    // Subscribe to newMessage event on socket
    socket.on("newMessage", handleNewMessage);
    return () => {
      // Cleanup listener on unmount
      socket.off("newMessage", handleNewMessage);
    };
  }, [setUnreadMessages, setConversations]);

  // Handler when a conversation is selected from the list
  const handleSelectConversation = (id: string, title: string) => {
    onSelect(id);
    onSelectToSetTitle(title);
    selectedConversationRef.current = id; // Update selected conversation ref
    // Remove the conversation from unread messages map
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    // Main container div with scroll handling
    <div
      ref={conversationContainer}
      onScroll={handleScrollConversation}
      className="w-full sm:w-1/3 md:w-1/4 border-r border-gray-300 overflow-y-auto h-full"
    >
      {/* Search input and header */}
      <div className="p-4 border-b sticky top-0 bg-white z-20">
        <p className="font-bold text-xl text-indigo-700">Conversations</p>
        <div className="mt-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full"
          />
        </div>

        {/* Animated display of user search results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2 max-h-60 overflow-auto"
            >
              {searchResults.map((user) => (
                <SearchUserItem
                  key={user.id}
                  user={user}
                  onCreate={handleCreateConversation}
                  disabled={creating}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* List of conversations with animation */}
      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {/* Show placeholder text if no conversations */}
          {conversations.length === 0 && !conversationLoading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center text-gray-500"
            >
              No conversations yet
            </motion.p>
          )}

          {/* Render each conversation item */}
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <ConversationItem
                key={conv.id}
                conversation={conv}
                selected={selectedConversation == conv.id}
                onSelect={() => handleSelectConversation(conv.id, conv.title)}
                onSelectToSetTitle={onSelectToSetTitle}
                hasUnread={
                  conv.id != selectedConversation && !!unreadMessages[conv.id]
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show loading spinner while conversations are loading */}
      {conversationLoading && (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
