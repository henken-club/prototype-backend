import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Metadata} from 'grpc';

export type AuthContext = {
  metadata?: Metadata;
};

export const AuthContext = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<AuthContext> => {
    const gqlContext = GqlExecutionContext.create(context);
    const req: Request = gqlContext.getContext().req;

    const metadata = new Metadata();

    return {metadata};
  },
);
