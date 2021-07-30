import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import {
  PrejudiceEntity,
  PostPrejudiceInput,
  GetPrejudiceResult,
  PostPrejudicePayload,
} from './prejudices.entities';
import {PrejudicesService} from './prejudices.service';

import {UserEntity} from '~/users/users.entities';
import {AnswerEntity} from '~/answers/answers.entities';
import {BookConnection, BookOrder} from '~/books/books.entities';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {UsersService} from '~/users/users.service';
import {SettingsService} from '~/settings/settings.service';
import {GetPrejudiceInput} from '~/graphql';

@Resolver('Prejudice')
export class PrejudicesResolver {
  constructor(
    private readonly prejudicesService: PrejudicesService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField('title')
  async resolveTitle(@Parent() {id}: PrejudiceEntity): Promise<string> {
    return this.prejudicesService.resolveTitle(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField('createdAt')
  async resolveCreatedAt(@Parent() {id}: PrejudiceEntity): Promise<Date> {
    return this.prejudicesService.resolveCreatedAt(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField('number')
  async resolveNumber(@Parent() {id}: PrejudiceEntity): Promise<Date> {
    return this.prejudicesService.resolveNumber(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField('userFrom')
  async getUserFrom(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .resolveUserPosted(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @ResolveField('userTo')
  async getUserTo(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .resolveUserRecieved(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @ResolveField('answer')
  async getAnswer(
    @Parent() {id}: PrejudiceEntity,
  ): Promise<AnswerEntity | null> {
    return this.prejudicesService.resolveAnswer(id);
  }

  @ResolveField('relatedBooks')
  async getrelatedBooks(
    @Parent() {id}: PrejudiceEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: BookOrder,
  ): Promise<BookConnection> {
    const nodes = await this.prejudicesService.resolveRelatedBooks(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @Query('prejudice')
  async getPrejudiceById(
    @Args('id') id: string,
  ): Promise<PrejudiceEntity | null> {
    return this.prejudicesService.getById(id);
  }

  @Query('getPrejudice')
  async getPrejudice(
    @Args('input') {posted, received, number}: GetPrejudiceInput,
  ): Promise<GetPrejudiceResult> {
    const postedId = await this.usersService.convertUserUniqueUnion(posted);
    const receivedId = await this.usersService.convertUserUniqueUnion(received);

    if (!postedId || !receivedId) return {possibility: false, prejudice: null};
    if (postedId === receivedId) throw new BadRequestException();

    return {
      possibility: true,
      prejudice: await this.prejudicesService.getByUserIdAndNumber(
        postedId,
        receivedId,
        number,
      ),
    };
  }

  @Query('allPrejudices')
  async getAllPrejudices(): Promise<PrejudiceEntity[]> {
    return this.prejudicesService.getAllPrejudices();
  }

  @Mutation('postPrejudice')
  @UseGuards(GraphQLJwtGuard)
  async postPrejudice(
    @Viewer() {id: postedId}: ViewerType,
    @Args('input')
    {receivedUser, title, relatedBooks}: PostPrejudiceInput,
  ): Promise<PostPrejudicePayload> {
    const recievedId = await this.usersService.convertUserUniqueUnion(
      receivedUser,
    );

    if (!recievedId || postedId === recievedId) throw new BadRequestException();
    if (!(await this.settingsService.canPostPrejudiceTo(postedId, recievedId)))
      throw new ForbiddenException();

    return this.prejudicesService
      .createPrejudice(postedId, recievedId, {title, relatedBooks})
      .then((prejudice) => ({prejudice}))
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
