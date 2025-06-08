import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { SEARCH_USERS } from "../../services/requestsGql";
import Input from "../ui/Input";
import SearchUserItem from "../chat/SearchUserItem";
import { AnimatePresence, motion } from "framer-motion";

interface ConversationSearchProps {
  onCreateConversation: (userId: string, title: string | null) => void;
  creating: boolean;
  resetSearchTrigger: any; // Can be a dependency to reset input if needed
}

export default function ConversationSearch({
  onCreateConversation,
  creating,
  resetSearchTrigger,
}: ConversationSearchProps) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const client = useApolloClient();

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

  useEffect(() => {
    setSearch("");
    setSearchResults([]);
  }, [resetSearchTrigger]);

  return (
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
                onCreate={onCreateConversation}
                disabled={creating}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
