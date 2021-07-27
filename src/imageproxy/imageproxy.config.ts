import {registerAs} from '@nestjs/config';

export const ImageproxyConfig = registerAs('imageproxy', () => ({
  url: process.env.IMAGEPROXY_URL!,
}));
