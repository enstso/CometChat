function ChatHeader({ title, hasConversation }: { title: string; hasConversation: boolean }) {
  return (
    <div className="border-b p-4 font-bold text-lg bg-gray-50">
      {hasConversation ? title : "Select a conversation"}
    </div>
  );
}
export default ChatHeader;