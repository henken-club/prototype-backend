import {Injectable} from '@nestjs/common';
import {ReceivePrejudicePolicy} from '@prisma/client';

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

  async getFromUserId(userId: string) {
    return this.prismaService.setting.upsert({
      where: {userId},
      create: {user: {connect: {id: userId}}},
      update: {},
    });
  }

  canPostPrejudiceToQuery(policy: ReceivePrejudicePolicy) {
    if (policy === ReceivePrejudicePolicy.ALL_FOLLOWERS)
      return CYPHER_CAN_POST_PREJUDICE_ALL_FOLLOWERS;
    else return CYPHER_CAN_POST_PREJUDICE_MUTUAL_ONLY;
  }

  async canPostPrejudice(
    post: string,
    received: string,
    policy: ReceivePrejudicePolicy,
  ) {
    const query = this.canPostPrejudiceToQuery(policy);
    const result = await this.neo4jService.read(query, {
      from: post,
      to: received,
    });

    if (!result.records[0]) throw new Error('something broken with neo4j');
    return result.records[0].get('can');
  }
}
