import { IsEmail, IsOptional, Length } from 'class-validator';
export class LoginDTO {
  @IsOptional()
  readonly username?: string;
  @IsEmail()
  @IsOptional()
  readonly mail?: string;
  @Length(10, 15)
  @IsOptional()
  readonly phone?: string;
  readonly password: string;
}
