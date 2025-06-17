import React, { useRef } from "react";
import Spinner from "../ui/Spinner";
import Message from "./Message";
import type { MessageListProps } from "../../types/message";

const MessagesList = ({
  messages,
  loading,
  onScrollNearTop,
}: MessageListProps) => {
  // Reference to the container div to handle scrolling
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll event handler to detect when user scrolls near the top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // If scrolled within 50px of the top, trigger onScrollNearTop callback
    if (e.currentTarget.scrollTop < 50) onScrollNearTop();
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      style={{ scrollbarWidth: "thin" }} // Use thin scrollbar style on Firefox
      role="list" // Accessibility role to indicate this is a list
      aria-label="Messages" // Accessibility label for screen readers
    >
      {/* Show spinner loader when loading messages */}
      {loading && (
        <div className="flex justify-center mb-2">
          <Spinner />
        </div>
      )}

      {/* Show placeholder text if no messages and not loading */}
      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          No messages yet. Start the conversation!
        </p>
      )}

      {/* Render list of Message components */}
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessagesList;
