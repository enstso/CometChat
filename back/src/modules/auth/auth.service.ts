import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput) {
    try {
      return await this.userService.create(registerInput);
    } catch (error) {
      throw new ConflictException('User already exists');
    }
  }

  async login(loginInput:LoginInput) {
    try{
        const user = await this.userService.findByEmail(loginInput.email);
        const isPasswordValid = await bcrypt.compare(
            loginInput.password,
            user.password,
        );
    
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
    
        return this.generateToken(user);
    }
    catch (error) {
        throw new UnauthorizedException('Invalid credentials');
    }
}

  async getProfile(userId: number) {
    return this.userService.findById(userId);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      message: 'Login successful'
    };
  }
}

