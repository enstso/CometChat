import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { RegisterResponse } from './dto/register-response.dto';

@Resolver(()=> LoginResponse)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}
    @Mutation(() => LoginResponse)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse> {
        return  await this.authService.login(loginInput);       
    }

    @Mutation(()=> RegisterResponse)
    async register(@Args('registerInput') registerInput: RegisterInput): Promise<RegisterResponse> {
        const res = await this.authService.register(registerInput);
        if (res) {
            return { message: 'User registered successfully' };
        }
        throw new Error('User registration failed');
    }
}