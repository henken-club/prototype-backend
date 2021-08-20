import * as path from 'path';

import {registerAs} from '@nestjs/config';

import {HENKENCLUB_BOOKCOVER_PACKAGE_NAME} from '~/protogen/bookcover';

export const BookcoverConfig = registerAs('grpc-bookcover', () => ({
  options: {
    url: process.env.BOOKCOVER_SERVICE_URL!,
    package: HENKENCLUB_BOOKCOVER_PACKAGE_NAME,
    protoPath: path.resolve(process.cwd(), 'proto/bookcover.proto'),
  },
}));
