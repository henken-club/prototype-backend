import * as path from 'path';

import {registerAs} from '@nestjs/config';

import {HENKENCLUB_ACCOUNT_PACKAGE_NAME} from '~/protogen/account';

export const AccountConfig = registerAs('grpc-account', () => ({
  options: {
    url: process.env.ACCOUNT_SERVICE_URL!,
    package: HENKENCLUB_ACCOUNT_PACKAGE_NAME,
    protoPath: path.resolve(process.cwd(), 'proto/account.proto'),
  },
}));
