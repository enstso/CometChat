import { formatDate } from "../../utils/formatDate";
import type { MessageType } from "../../types/message";

const Message = ({ message }: { message: MessageType }) => {
  const { fromMe, content, sender, createdAt } = message;

  return (
    <div
      className={`flex flex-col my-2 max-w-full ${
        fromMe ? "items-end self-end" : "items-start self-start"
      }`}
      role="listitem"
      aria-label={`${sender.username} said: ${content}`}
    >
      <div
        className={`text-sm font-semibold mb-1 select-none ${
          fromMe ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {sender.username}
      </div>

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
