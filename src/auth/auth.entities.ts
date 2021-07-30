export {LoginInput, SignupInput, RefreshTokenInput} from '~/graphql';

export class JwtPayload {
  uid!: string;
}
export class TokenEntities {
  accessToken!: string;
  refreshToken!: string;
}
export class LoginPayload {
  tokens!: TokenEntities;
}
export class SignupPayload {
  tokens!: TokenEntities;
}
export class RefreshTokenPayload {
  tokens!: TokenEntities;
}
