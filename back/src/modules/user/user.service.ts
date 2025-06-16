import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth0UserDto } from '../auth/dto/auth0-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  // Inject PrismaService to interact with the database
  constructor(private prisma: PrismaService) {}

  // Find a user by Auth0 ID or create a new user if not found
  async findOrCreateUser(auth0User: Auth0UserDto) {
    try {
      const { sub, email, username } = auth0User;

      // Attempt to find the user by their Auth0 ID
      let user = await this.prisma.user.findUnique({
        where: { auth0Id: sub },
      });

      // If the user does not exist, create a new user record
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            auth0Id: sub,
            email: email ?? '', // Use empty string if email is null or undefined
            username: username ?? email?.split('@')[0] ?? `user_${Date.now()}`, // Fallback username generation
          },
        });
      }

      // Return the found or newly created user
      return user;
    } catch {
      // Throw an UnauthorizedException if user lookup fails
      throw new UnauthorizedException('User not found');
    }
  }

  // Find a user by their unique ID
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found'); // Throw if user does not exist
    return user;
  }

  // Search users by username, excluding the current user, case-insensitive and limited to 10 results
  async searchUsersByUsername(query: string, currentUser: User) {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id, // Exclude the current user from results
        },
        username: {
          startsWith: query, // Search usernames that start with the query string
          mode: 'insensitive', // Case-insensitive search
        },
      },
      take: 10, // Limit results to 10 users
      select: {
        id: true,
        username: true,
        email: true,
        auth0Id: true,
      },
    });
  }
}
