import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth0UserDto } from '../auth/dto/auth0-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(auth0User: Auth0UserDto) {
    try {
      const { sub, email, username } = auth0User;

      let user = await this.prisma.user.findUnique({
        where: { auth0Id: sub },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            auth0Id: sub,
            email: email ?? '',
            username: username ?? email?.split('@')[0] ?? `user_${Date.now()}`,
          },
        });
      }

      return user;
    } catch {
      throw new UnauthorizedException('User not found');
    }
  }
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async searchUsersByUsername(query: string, currentUser: User) {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id, // Exclure l'utilisateur actuel
        },
        username: {
          startsWith: query,
          mode: 'insensitive', // ignore la casse
        },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        email: true,
        auth0Id: true,
      },
    });
  }
}
