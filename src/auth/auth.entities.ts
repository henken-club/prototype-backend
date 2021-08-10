import {Field, ObjectType} from '@nestjs/graphql';

export class JwtPayload {
  uid!: string;
}

@ObjectType()
export class TokenEntities {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
