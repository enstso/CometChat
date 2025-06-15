import type { Message } from "../gql/graphql";

export type MessageType = Message & {
  fromMe?: boolean;
  conversationId?:string
};

export type MessageListProps = {
  messages: MessageType[];
  loading: boolean;
  onScrollNearTop: () => void;
};

