import { cn } from "../../lib/utils";

export default function ConversationItem({
  conversation,
  selected,
  onSelect,
}: {
  conversation: { id: string; user: string; lastMessage?: string };
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "p-4 cursor-pointer border-b hover:bg-gray-100",
        selected ? "bg-blue-100 font-semibold" : ""
      )}
    >
      <p>{conversation.user}</p>
      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
    </div>
  );
}
