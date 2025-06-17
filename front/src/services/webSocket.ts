// Import the `io` function from socket.io-client to establish a WebSocket connection
import { io } from "socket.io-client";
// Import React's useEffect hook for handling side effects
import { useEffect } from "react";

// Create and export a socket connection using the API URL from environment variables
export const socket = io(import.meta.env.VITE_API_URL);

// Component to join a socket.io room for a specific conversation
export function SocketRoomJoin({ conversationId }: { conversationId: string | null }) {
  useEffect(() => {
    // When a valid conversationId is provided, emit a "join" event to the server
    if (conversationId) {
      socket.emit("join", conversationId); // Join the room on the server
      console.log("Joined room:", conversationId); // Log the joined room for debugging
    }
  }, [conversationId]); // Run this effect when conversationId changes

  // This component does not render anything in the DOM
  return null;
}
