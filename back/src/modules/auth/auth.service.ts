import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { Auth0UserDto } from './dto/auth0-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(payload: Auth0UserDto) {
    console.log('Validating user:', payload);
    return this.userService.findOrCreateUser(payload);
  }
}
