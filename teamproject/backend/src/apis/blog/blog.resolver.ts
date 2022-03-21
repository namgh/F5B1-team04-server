import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { Blog } from './entities/blog.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogService } from './blog.service';

@Resolver()
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Blog])
  fetchBlog() {
    return this.blogService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Blog])
  fetchmyBlog(@CurrentUser() currentUser: ICurrentUser) {
    return this.blogService.findmyblog({ currentUser });
  }

  @Query(() => [Blog])
  fetchotherBlog(@Args('email') email: string) {
    return this.blogService.findotherblog({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Blog)
  async createBlog(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogService.create({
      title,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Blog)
  async updateBlog(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.blogService.update({
      title,
      contents,
      currentUser,
      blogid,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteBlog(
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.blogService.delete({
      currentUser,
      blogid,
    });
  }

  @Mutation(() => [String])
  async uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.blogService.upload({ files });
  }
}
