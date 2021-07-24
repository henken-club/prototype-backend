import {Injectable} from '@nestjs/common';

import {SettingEntity} from './settings.entities';

import {PrismaService} from '~/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSettingByUserId(userId: string): Promise<SettingEntity> {
    return this.prismaService.setting.upsert({
      where: {userId},
      create: {user: {connect: {id: userId}}},
      update: {},
    });
  }
}
