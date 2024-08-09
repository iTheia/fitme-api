import { Matches } from 'class-validator';
export class ChangePassword {
  readonly currentPassword: string;
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$')
  readonly newPassword: string;
}
