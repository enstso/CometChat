import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';

@Module({
  // Import UserModule and configure PassportModule with JWT as the default strategy
  imports: [UserModule, PassportModule.register({ defaultStrategy: 'jwt' })],

  // Declare the providers used in this module: AuthService and JwtStrategy
  providers: [AuthService, JwtStrategy, AuthResolver],

  // Export AuthService so it can be used in other modules
  exports: [AuthService],
})
export class AuthModule {}
