import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Module({
  // Register WebsocketService as a provider in this module
  providers: [WebsocketService],
  // Export WebsocketService so it can be used by other modules
  exports: [WebsocketService],
})
export class WebsocketModule {}
