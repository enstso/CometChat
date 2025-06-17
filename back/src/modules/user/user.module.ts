import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '../prisma/prisma.module';

// UserModule is responsible for user-related functionality
@Module({
  // Import PrismaModule to enable database access within this module
  imports: [PrismaModule],
  // Provide UserService and UserResolver for dependency injection
  providers: [UserService, UserResolver],
  // Export UserService so it can be used by other modules
  exports: [UserService],
})
export class UserModule {}
