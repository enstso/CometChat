import { IsEmail, IsString } from 'class-validator';

export class ValidateUserDto {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;

  @IsString()
  nickname: string;
}
