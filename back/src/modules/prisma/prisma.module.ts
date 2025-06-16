import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Marks this module as global, so PrismaService is available across the entire app without needing to import PrismaModule everywhere
@Global()
@Module({
  // Registers PrismaService as a provider within this module
  providers: [PrismaService],
  // Makes PrismaService available for injection in other modules
  exports: [PrismaService],
})
export class PrismaModule {}
