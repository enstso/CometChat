import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import { useApolloClient } from "@apollo/client";
import {
  SEARCH_USERS,
  CREATE_CONVERSATION,
  GET_USER_CONVERSATIONS,
} from "../../services/requestsGql";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ConversationItem from "./ConversationItem";
import SearchUserItem from "../chat/SearchUserItem";
import { useAuth0 } from "@auth0/auth0-react";

export default function ConversationList({
  selectedConversation,
  onSelect,
}: any) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const conversationContainer = useRef<any>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  const client = useApolloClient();
  const { user } = useAuth0();
  const currentUserId: string | undefined = user?.sub;

  // ✅ Récupération initiale des conversations
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

        const conversations = data.getUserConversations.edges.map((edge: any) => {
          const otherParticipant = edge.node.participants.find(
            (p: any) => p.user.id !== currentUserId
          );
          return {
            id: edge.node.id,
            user: otherParticipant?.user.username || "Inconnu",
            lastMessage: "", // Peut être mis à jour avec le dernier message
          };
        });

        setConversations(conversations);
      } catch (err) {
        console.error("Erreur lors du chargement des conversations:", err);
      } finally {
        setConversationLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, client]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    const { data } = await client.query({
      query: SEARCH_USERS,
      variables: { query: search },
      fetchPolicy: "no-cache",
    });
    setSearchResults(data.searchUsers);
  };

  const handleScrollConversation = () => {
    const el = conversationContainer.current;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      // Pagination future
    }
  };

  const handleCreateConversation = async (userId: string) => {
    if (!currentUserId) return;

    setCreating(true);
    try {
      const { data } = await client.mutate({
        mutation: CREATE_CONVERSATION,
        variables: {
          input: {
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
          lastMessage: "Nouvelle conversation",
        },
        ...prev,
      ]);
      onSelect(newConversation.id);
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.error("Erreur création conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="w-1/4 border-r border-gray-300 overflow-y-auto"
      onScroll={handleScrollConversation}
      ref={conversationContainer}
    >
      <div className="p-4 border-b">
        <p className="font-bold text-xl">Conversations</p>
        <div className="mt-2 flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
          />
          <Button onClick={handleSearch} disabled={creating}>
            OK
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 space-y-2">
            {searchResults.map((user) => (
              <SearchUserItem
                key={user.id}
                user={user}
                onCreate={handleCreateConversation}
                disabled={creating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Liste des conversations */}
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          selected={selectedConversation === conv.id}
          onSelect={onSelect}
        />
      ))}

      {conversationLoading && (
        <div className="p-4 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
