import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import neo4j, {Driver, Transaction} from 'neo4j-driver';

import {Neo4jConfig} from './neo4j.config';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly driver: Driver;

  constructor(@Inject(Neo4jConfig.KEY) config: ConfigType<typeof Neo4jConfig>) {
    const driverUrl = config.url;
    const driverAuth =
      config.username && config.password
        ? neo4j.auth.basic(config.username, config.password)
        : undefined;
    this.driver = neo4j.driver(driverUrl, driverAuth);
  }

  async onModuleInit() {
    await this.driver.verifyConnectivity();
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database);
    return session.beginTransaction();
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  async read(cypher: string, params?: Record<string, any>) {
    const session = this.getReadSession();
    const result = await session.run(cypher, params);
    await session.close();
    return result;
  }

  async write(cypher: string, params?: Record<string, any>) {
    const session = this.getWriteSession();
    const result = await session.run(cypher, params);
    await session.close();
    return result;
  }
}
