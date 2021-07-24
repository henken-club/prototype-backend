import {Injectable} from '@nestjs/common';

import {SettingEntity, PrejudicePostRule} from './settings.entities';
import {
  CYPHER_CAN_POST_PREJUDICE_ALL_FOLLOWERS,
  CYPHER_CAN_POST_PREJUDICE_MUTUAL_ONLY,
} from './settings.cypher';

import {PrismaService} from '~/prisma/prisma.service';
import {Neo4jService} from '~/neo4j/neo4j.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly prismaService: PrismaService,
  ) {}

  async getSettingByUserId(userId: string): Promise<SettingEntity> {
    return this.prismaService.setting.upsert({
      where: {userId},
      create: {user: {connect: {id: userId}}},
      update: {},
    });
  }

  canPostPrejudiceToQuery(mode: PrejudicePostRule) {
    if (mode === PrejudicePostRule.ALL_FOLLOWERS)
      return CYPHER_CAN_POST_PREJUDICE_ALL_FOLLOWERS;
    else return CYPHER_CAN_POST_PREJUDICE_MUTUAL_ONLY;
  }

  async canPostPrejudiceTo(fromId: string, toId: string): Promise<boolean> {
    return this.getSettingByUserId(fromId)
      .then(({rulePostPrejudice}) => rulePostPrejudice)
      .then((mode) =>
        this.neo4jService.read(this.canPostPrejudiceToQuery(mode), {
          from: fromId,
          to: toId,
        }),
      )
      .then(({records}) => records[0].get('can'));
  }
}
