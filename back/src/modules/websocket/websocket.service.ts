import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

// Define a WebSocket gateway with CORS enabled
@WebSocketGateway({ cors: true })
@Injectable()
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // Reference to the Socket.IO server instance
  @WebSocketServer()
  server: Server;

  // Handle a new client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Listen for 'message' events sent from clients
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(`Received message: ${message}`);
    // Broadcast the received message to all connected clients
    this.server.emit('message', message);
  }

  // Listen for 'join' events, where clients request to join a specific room
  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Add the client to the specified room
    await client.join(room);
    console.log(`✅ Client ${client.id} joined room: ${room}`);

    // Notify other clients in the room that a new client has joined
    client.to(room).emit('joined', `Client ${client.id} joined room: ${room}`);
  }
}
