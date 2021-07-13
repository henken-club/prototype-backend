import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';

export type ViewerType = {id: string};

export const Viewer = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
