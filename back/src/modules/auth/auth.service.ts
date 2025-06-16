import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { Auth0UserDto } from './dto/auth0-user.dto';

@Injectable()
export class AuthService {
  // Inject UserService to handle user-related operations
  constructor(private readonly userService: UserService) {}

  async registerUser() {}
  // Validate the user by checking the payload and either finding or creating the user
  async validateUser(payload: Auth0UserDto) {
    return this.userService.findOrCreateUser(payload);
  }
}
