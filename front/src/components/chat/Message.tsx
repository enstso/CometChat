import { formatDate } from "../../utils/formatDate";
import type { MessageType } from "../../types/message";

// Component to display a single chat message
const Message = ({ message }: { message: MessageType }) => {
  // Destructure properties from the message object
  const { fromMe, content, sender, createdAt } = message;

  return (
    // Container for the message, aligned based on whether it's from the current user
    <div
      className={`flex flex-col my-2 max-w-full ${
        fromMe ? "items-end self-end" : "items-start self-start"
      }`}
      role="listitem"
      aria-label={`${sender.username} said: ${content}`} // Accessibility label describing message content
    >
      {/* Display the sender's username with different colors based on message origin */}
      <div
        className={`text-sm font-semibold mb-1 select-none ${
          fromMe ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {sender.username}
      </div>

      {/* Message bubble styling differs if from current user or others */}
      <div
        className={`px-5 py-3 rounded-2xl max-w-xs sm:max-w-md break-words whitespace-pre-wrap
          shadow-sm transition-colors duration-300
          ${
            fromMe
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
      >
        {content}
      </div>

      {/* Timestamp showing when the message was sent, with accessible date label */}
      <time
        dateTime={createdAt}
        className="text-xs text-gray-400 mt-1 select-none"
        aria-label={`Sent on ${formatDate(createdAt)}`}
      >
        {formatDate(createdAt)}
      </time>
    </div>
  );
};

export default Message;
