import * as path from 'path';

import {registerAs} from '@nestjs/config';

import {HENKENCLUB_AVATAR_PACKAGE_NAME} from '~/protogen/avatar';

export const AvatarConfig = registerAs('grpc-avatar', () => ({
  options: {
    url: process.env.AVATAR_SERVICE_URL!,
    package: HENKENCLUB_AVATAR_PACKAGE_NAME,
    protoPath: path.resolve(process.cwd(), 'proto/avatar.proto'),
  },
}));
