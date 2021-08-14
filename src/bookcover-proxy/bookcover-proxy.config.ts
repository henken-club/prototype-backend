import {registerAs} from '@nestjs/config';

export const BookcoverProxyConfig = registerAs('bookcover-proxy', () => ({
  baseUrl: process.env.BOOKCOVER_PROXY_BASE_URL!,
}));
