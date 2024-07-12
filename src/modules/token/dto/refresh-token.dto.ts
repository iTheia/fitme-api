export class RefreshToken {
  readonly sub: string;
  readonly username: string;
  readonly roles: string[];
  readonly iat: number;
  readonly exp: number;
}
