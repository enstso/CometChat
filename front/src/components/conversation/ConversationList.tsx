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
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const conversationContainer = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [creating, setCreating] = useState(false);

  const selectedConversationRef = useRef<string | null>(null);

  const client = useApolloClient();
  const { user } = useAuth0();
  const currentUserId: string | undefined = user?.sub;

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      setConversationLoading(true);
      try {
        const { data } = await client.query({
          query: GET_USER_CONVERSATIONS,
          variables: { cursor: null, limit: 20 },
          fetchPolicy: "no-cache",
        });

        const fetchedConversations: ConversationType[] =
          data.getUserConversations.edges.map((edge: ConversationEdge) => {
            const participants = edge.node.participants || [];
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

  // Debounced search
  useEffect(() => {
    if (search.length === 0) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
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

    return () => clearTimeout(handler);
  }, [search, client]);

  const handleScrollConversation = () => {
    const el = conversationContainer.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      // Future pagination
    }
  };

  const handleCreateConversation = async (
    userId: string,
    title: string | null
  ) => {
    if (!currentUserId) return;

    setCreating(true);
    try {
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
      onSelect(newConversation.id);
      onSelectToSetTitle(newConversation.title);
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error creating conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    socket.connect();

    const handleNewMessage = (data: {
      conversationId: string;
      content: string;
      sender: User;
    }) => {
      if (data.conversationId !== selectedConversationRef.current) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.conversationId]: true,
        }));
      }

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

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [setUnreadMessages, setConversations]);

  const handleSelectConversation = (id: string, title: string) => {
    onSelect(id);
    onSelectToSetTitle(title);
    selectedConversationRef.current = id; // Met à jour la ref
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <div
      ref={conversationContainer}
      onScroll={handleScrollConversation}
      className="w-full sm:w-1/3 md:w-1/4 border-r border-gray-300 overflow-y-auto h-full"
    >
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

      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {conversations.length === 0 && !conversationLoading && (
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

      {conversationLoading && (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
