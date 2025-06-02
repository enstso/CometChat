import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY, jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector, ModuleRef } from '@nestjs/core';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private userService: UserService;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef, // Permet de récupérer UserService après init
  ) {}

  // Récupération de UserService après l'initialisation du module (pour éviter les problèmes de dépendances circulaires)
  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifier si la route ou le contrôleur est marqué comme public (pas besoin de token)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Extraire la requête HTTP
    const request = context.switchToHttp().getRequest<Request>();

    // Extraire le token JWT depuis l'en-tête Authorization
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      // Vérifier et décoder le token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Récupérer l'utilisateur depuis la base via l'ID dans le payload
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      // Attacher l'utilisateur à la requête pour un usage futur (ex : dans les resolvers ou contrôleurs)
      request['user'] = user;

    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
