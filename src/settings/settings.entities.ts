import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {ReceivePrejudicePolicy} from '@prisma/client';

registerEnumType(ReceivePrejudicePolicy, {name: 'ReceivePrejudicePolicy'});

@ObjectType()
export class SettingEntity {
  id!: string;

  @Field(() => ReceivePrejudicePolicy)
  policyReceivePrejudice!: ReceivePrejudicePolicy;
}
