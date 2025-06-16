import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwksRsa from 'jwks-rsa';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
// JWT authentication strategy using Passport and Auth0 JWKS for token verification
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Use JWKS (JSON Web Key Set) from Auth0 to provide the secret dynamically
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true, // cache keys to improve performance
        rateLimit: true, // rate limit JWKS requests
        jwksRequestsPerMinute: 5, // max JWKS requests per minute
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // Auth0 JWKS URI
      }),
      audience: process.env.AUTH0_AUDIENCE, // expected audience in the JWT
      issuer: `https://${process.env.AUTH0_DOMAIN}/`, // expected issuer of the JWT
      algorithms: ['RS256'], // allowed JWT signing algorithms
    });
  }

  // Validate function called after verifying the JWT
  async validate(payload: ValidateUserDto) {
    // Validate user using AuthService with data extracted from the JWT payload
    return this.authService.validateUser({
      sub: payload.sub,
      email: payload.email,
      username: payload.nickname,
    });
  }
}
