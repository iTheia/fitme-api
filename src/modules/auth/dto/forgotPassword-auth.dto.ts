import { IsEmail, IsOptional } from 'class-validator';

export class ForgotPassword {
  @IsEmail()
  @IsOptional()
  readonly mail: string;
}
