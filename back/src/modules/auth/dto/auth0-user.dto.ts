import { IsEmail, IsString } from 'class-validator';

export class Auth0UserDto {
  @IsString()
  sub: string;

  @IsEmail()
  email?: string;

  @IsString()
  username?: string;
}
