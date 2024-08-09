import { IsEmail, Matches, Length, IsOptional } from 'class-validator';
export class RegisterDTO {
  readonly name: string;
  readonly username: string;
  @IsEmail()
  readonly mail: string;
  @Length(10, 15)
  @IsOptional()
  readonly phone?: string;
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,15}$/, {
    message:
      'La contraseña debe tener entre 8 y 15 caracteres, e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
  })
  readonly password: string;
}
