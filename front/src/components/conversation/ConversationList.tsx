import { useEffect, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client";
import {
  GET_USER_CONVERSATIONS,
  CREATE_CONVERSATION,
} from "../../services/requestsGql";
import { useAuth0 } from "@auth0/auth0-react";
import { socket } from "../../services/webSocket";

import ConversationSearch from "./ConversationSearch";
import ConversationListItems from "./ConversationListItems";
import ConversationLoader from "./ConversationLoader";

interface Conversation {
  id: string;
  user: string;
  lastMessage?: string;
  title: string;
  createdAt: string;
}

interface ConversationListProps {
  selectedConversation: number | null;
  onSelectToSetTitle: (title: string) => void;
  onSelect: (id: string) => any;
}

export default function ConversationList({
  selectedConversation,
  onSelectToSetTitle,
  onSelect,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, boolean>>({});
  const conversationContainer = useRef<HTMLDivElement>(null);
  const [creating, setCreating] = useState(false);
  const [resetSearchTrigger, setResetSearchTrigger] = useState(0);

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

        const fetchedConversations = data.getUserConversations.edges.map(
          (edge: any) => {
            const participants = edge.node.participants || [];
            const otherParticipant = participants.find(
              (p: any) => p.user.auth0Id !== currentUserId
            );

            return {
              id: edge.node.id,
              title: edge.node.title || "Untitled Conversation",
              user: otherParticipant?.user.username || "Unknown",
              lastMessage:
                edge.node.messages && edge.node.messages.length > 0
                  ? edge.node.messages[0].content
                  : "New conversation",
              createdAt:
                edge.node.messages && edge.node.messages.length > 0
                  ? edge.node.messages[0].createdAt
                  : "",
            };
          }
        );

        setConversations(fetchedConversations);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setConversationLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, client]);

  const handleScrollConversation = () => {
    const el = conversationContainer.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      // Pagination futur
    }
  };

  const handleCreateConversation = async (userId: string, title: string | null) => {
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
            (p: any) => p.user.id === userId
          )?.user.username,
          lastMessage: "New conversation",
          title: newConversation.title,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      onSelect(newConversation.id);
      onSelectToSetTitle(newConversation.title);
      setResetSearchTrigger((v) => v + 1); // Reset search input & results
    } catch (err) {
      console.error("Error creating conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  // Setup socket listeners
  useEffect(() => {
    socket.connect();

    const handleNewMessage = (data: { conversationId: string; content: string }) => {
      if (data.conversationId !== selectedConversation) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.conversationId]: true,
        }));
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId ? { ...conv, lastMessage: data.content } : conv
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      // Ne pas disconnecter le socket ici
    };
  }, [selectedConversation]);

  const handleSelectConversation = (id: string, title: string) => {
    onSelect(id);
    onSelectToSetTitle(title);
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
      <ConversationSearch
        onCreateConversation={handleCreateConversation}
        creating={creating}
        resetSearchTrigger={resetSearchTrigger}
      />

      <ConversationListItems
        conversations={conversations}
        selectedConversation={selectedConversation}
        unreadMessages={unreadMessages}
        onSelectConversation={handleSelectConversation}
        loading={conversationLoading}
      />

      {conversationLoading && <ConversationLoader />}
    </div>
  );
}
