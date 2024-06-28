import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDTO {
  readonly username?: string;
  readonly mail?: string;
  readonly phone?: string;
  readonly password: string;
}
