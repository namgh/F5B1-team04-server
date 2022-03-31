import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { StackService } from './stack.service';
import { Stack } from './entities/stack.entity';

@Resolver()
export class StackResolver {
  constructor(
    private readonly stackService: StackService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Stack])
  fetchStack() {
    return this.stackService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stack])
  fetchmyStack(@CurrentUser() currentUser: ICurrentUser) {
    return this.stackService.findmystack({ currentUser });
  }

  @Query(() => [Stack])
  fetchotherStackorderbylike() {
    return this.stackService.fetchotherStackorderbylike();
  }

  @Query(() => [Stack])
  fetchotherStackorderbycreateAt() {
    return this.stackService.fetchotherStackorderbycreateAt();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Stack)
  async createStack(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args({ name: 'stacktag', type: () => [String] }) stacktag: string[],

    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackService.create({
      title,
      contents,
      currentUser,
      stacktag,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Stack)
  async updateStack(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.stackService.update({
      title,
      contents,
      currentUser,
      blogid,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteStack(
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.stackService.delete({
      currentUser,
      blogid,
    });
  }

  @Mutation(() => [String])
  async uploadStackFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.stackService.upload({ files });
  }
}
