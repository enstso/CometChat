import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Auth0UserDto } from './dto/auth0-user.dto';
import { RegisterAuth0User } from './dto/register-auth0-user.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  // Inject UserService to handle user-related operations
  constructor(private readonly userService: UserService) {}

  async registerUser(input: RegisterAuth0User) {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_M_TO_M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M_TO_M_CLIENT_SECRET;
    const audience = `https://${domain}/api/v2/`;

    try {
      // 1. Get a management API token
      const { data: tokenData } = await axios.post(
        `https://${domain}/oauth/token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          audience,
          grant_type: 'client_credentials',
        },
      );

      const accessToken = tokenData.access_token;

      // 2. Create the user in Auth0
      const { data: user } = await axios.post(
        `https://${domain}/api/v2/users`,
        {
          email: input.email,
          password: input.password,
          connection: 'Username-Password-Authentication',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        success: true,
        message: 'User created successfully',
        user_id: user.user_id,
        email: user.email,
      };
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  // Validate the user by checking the payload and either finding or creating the user
  async validateUser(payload: Auth0UserDto) {
    return this.userService.findOrCreateUser(payload);
  }
}
