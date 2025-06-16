import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// PrismaService extends the PrismaClient to handle DB connections within the NestJS lifecycle
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Called when the module is initialized; establishes a connection to the database
  async onModuleInit() {
    await this.$connect();
  }

  // Called when the module is destroyed; closes the database connection gracefully
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
