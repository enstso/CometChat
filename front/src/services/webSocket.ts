import { io } from "socket.io-client";
import { useEffect } from "react";

export const socket = io(import.meta.env.VITE_API_URL);

export function SocketRoomJoin({ conversationId }: { conversationId: string | null }) {
  useEffect(() => {
    if (conversationId) {
      socket.emit("join", conversationId);
      console.log("Joined room:", conversationId);
    }
  }, [conversationId]);

  return null;
}
