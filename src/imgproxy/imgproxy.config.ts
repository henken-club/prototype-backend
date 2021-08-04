import {registerAs} from '@nestjs/config';

export const ImgproxyConfig = registerAs('imageproxy', () => ({
  baseUrl: process.env.IMGPROXY_BASE_URL!,

  key: process.env.IMGPROXY_KEY!,
  salt: process.env.IMGPROXY_SALT!,
}));
