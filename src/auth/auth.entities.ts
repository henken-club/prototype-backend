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

export type LoginInput = {
  alias: string;
  password: string;
};

export type SignupInput = {
  alias: string;
  displayName: string;
  password: string;
};

export type RefreshTokenInput = {
  token: string;
};
