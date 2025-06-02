import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      return this.prisma.user.create({
        data: {
          ...createUserInput,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new UnauthorizedException('User already exists');
    }
  }

  async findByEmail(email: string) {
    try {
      return this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }

  async findById(id: number) {
    try {
      return this.prisma.user.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }

  async update(updateUserInput: UpdateUserInput) {
    const { id, ...data } = updateUserInput;
    try {
      return this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }

  async delete(id: number) {
    try {
      return this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }
}
