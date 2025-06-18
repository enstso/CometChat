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
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
    ack: (response: any) => void,
  ): void {
    try {
      console.log(`Received message: ${message}`);
      this.server.emit('message', message);
      ack({ status: 'ok' });
    } catch (error) {
      console.error('Error handling message:', error);
      ack({ status: 'error', error: error.message });
    }
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

  // Listen for 'leave' events, where clients request to leave a specific room
  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Remove the client from the specified room
    await client.leave(room);
    console.log(`🚪 Client ${client.id} left room: ${room}`);

    // Notify other clients in the room that this client has left
    client.to(room).emit('left', `Client ${client.id} left room: ${room}`);
  }
}
