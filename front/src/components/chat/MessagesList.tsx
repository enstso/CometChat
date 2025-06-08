import React, { useEffect, useRef } from "react";
import Spinner from "../ui/Spinner";
import Message from "./Message";

type MessageType = {
  id: string;
  content: string;
  fromMe: boolean;
  createdAt: string;
  sender: any;
};

type Props = {
  messages: MessageType[];
  loading: boolean;
  onScrollNearTop: () => void;
};

const MessagesList = ({ messages, loading, onScrollNearTop }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < 50) onScrollNearTop();
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      style={{ scrollbarWidth: "thin" }}
      role="list"
      aria-label="Messages"
    >
      {loading && (
        <div className="flex justify-center mb-2">
          <Spinner />
        </div>
      )}
      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No messages yet. Start the conversation!</p>
      )}
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessagesList;
