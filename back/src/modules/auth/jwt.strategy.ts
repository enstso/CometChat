import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwksRsa from 'jwks-rsa';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: ValidateUserDto) {
    console.log('Validating JWT payload:', payload);
    return this.authService.validateUser({
      sub: payload.sub,
      email: payload.email,
      username: payload.nickname,
    });
  }
}
