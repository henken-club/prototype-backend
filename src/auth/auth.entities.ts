export {LoginInput, SignupInput, RefleshTokenInput} from '~/graphql';

export class TokenEntities {
  accessToken!: string;
  refleshToken!: string;
}

export class LoginPayload {
  tokens!: TokenEntities;
}
export class SignupPayload {
  tokens!: TokenEntities;
}
export class RefleshTokenPayload {
  tokens!: TokenEntities;
}
