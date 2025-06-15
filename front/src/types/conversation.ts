export type ConversationListProps = {
  selectedConversation: string | null;
  unreadMessages: Record<string, boolean>;
  onSelect: (id: string) => void;
  onSelectToSetTitle: (title: string) => void;
  setUnreadMessages: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

export type ConversationType = {
  id: string;
  title: string;
  user: string;
  lastMessage: string;
  lastMessageSender: string;
  createdAt: string;
};

export type ConversationItemProps = {
  conversation: ConversationType;
  selected: boolean;
  hasUnread: boolean;
  onSelectToSetTitle: (title: string) => void;
  onSelect: (id: string) => void;
};
