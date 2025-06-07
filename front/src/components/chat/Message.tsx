import React from "react";

type MessageProps = {
  message: {
    fromMe: boolean;
    content: string;
    sender: any;
    createdAt: string;
  };
};

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
  
    // Si la date est invalide, on retourne un fallback
    if (isNaN(date.getTime())) return "Date invalide";
  
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Paris", // ou laisse vide pour local
    });
  };
  
const Message = ({ message }: MessageProps) => {
  const { fromMe, content, sender, createdAt } = message;

  return (
    <div className={`flex flex-col my-2 ${fromMe ? "items-end" : "items-start"}`}>
      <div className="text-sm font-semibold mb-1">{sender.username}</div>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          fromMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {content}
      </div>
      <div className="text-xs text-gray-500 mt-1">{formatDate(createdAt)}</div>
    </div>
  );
};

export default Message;
