import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { Blog } from './entities/blog.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogService } from './blog.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Resolver()
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Query(() => [Blog])
  fetchBlogAll() {
    return this.blogService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Blog])
  fetchmyBlog(@CurrentUser() currentUser: ICurrentUser) {
    return this.blogService.findmyblog({ currentUser });
  }

  @Query(() => [Blog])
  fetchotherBlogorderbylikeAll() {
    return this.blogService.fetchotherBlogorderbylike();
  }

  @Query(() => [Blog])
  fetchotherBlogorderbycreateAt() {
    return this.blogService.fetchotherBlogorderbycreateAt();
  }

  @Query(() => [Blog])
  fetchotherBlogorderbylikecreate() {
    return this.blogService.fetchotherBlogorderbylikecreate();
  }

  @Query(() => [Blog])
  async fetchBlogSearch(@Args('search') search: string) {
    const redistemp = await this.cacheManager.get(`title:${search}`);

    if (redistemp) {
      return JSON.parse(redistemp);
    }

    const result = await this.elasticsearchService.search({
      index: 'blog',
      query: {
        bool: {
          should: [
            { match: { title: search } }, //
            { match: { contents: search } },
          ],
        },
      },
      sort: ['updatedat', 'desc'],
    });

    if (!result.hits.hits.length) return null;

    const resultmap = result.hits.hits.map((ele) => {
      const needresult = {};

      const resultsource = JSON.stringify(ele._source);
      const temp = JSON.parse(resultsource);
      for (let key in temp) {
        if (!key.includes('@')) needresult[key] = temp[key];
      }
      return needresult;
    });

    await this.cacheManager.set(`title:${search}`, JSON.stringify(resultmap), {
      ttl: 30,
    });
    return JSON.parse(JSON.stringify(resultmap));
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Blog)
  async createBlog(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args({ name: 'blogtag', type: () => [String] }) blogtag: string[],
    @Args({ name: 'blogcategorytag', type: () => [String] })
    blogcategorytag: string[],
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogService.create({
      title,
      contents,
      currentUser,
      blogtag,
      blogcategorytag,
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
  async deletemyBlog(
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.blogService.mydelete({
      currentUser,
      blogid,
    });
  }

  @Mutation(() => String)
  async deleteBlog(@Args('blogid') blogid: string) {
    return await this.blogService.delete({
      blogid,
    });
  }

  @Mutation(() => [String])
  async uploadblogFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.blogService.upload({ files });
  }

  @Query(() => Blog)
  async fetchblogone(@Args('blogid') blogid: string) {
    return this.blogService.findone({ blogid });
  }
}
