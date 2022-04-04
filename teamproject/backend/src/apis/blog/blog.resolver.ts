import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { Blog } from './entities/blog.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogService } from './blog.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BlogReturn } from './dto/blog.return';

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

  @Query(() => [BlogReturn])
  async fetchBlogSearch(@Args('search') search: string) {
    const result = await this.elasticsearchService.search({
      index: 'blog',
      query: {
        bool: {
          should: [
            { match: { title: search } }, //
            { match: { searchcontents: search } },
          ],
        },
      },
    });

    if (!result.hits.hits.length) return [];
    //console.log(result.hits.hits)
    const resultmap = result.hits.hits.map((ele): any => {
      const temp = JSON.stringify(ele);
      const el = JSON.parse(temp);
      return {
        id: el._source.id,
        contents: el._source.contents,
        like: el._source.like,
        searchcontents: el._source.searchcontents,
        user: {
          email: el._source.email,
          nickname: el._source.nickname,
        },
        blogcategorytag: [
          {
            tag: el._source.tag,
          },
        ],
        updatedat: String(el._source.updatedat),
      };
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
    @Args('url') url: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogService.create({
      title,
      contents,
      currentUser,
      blogtag,
      blogcategorytag,
      url,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Blog)
  async updateBlog(
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('blogid') blogid: string,
    @Args('url') url: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.blogService.update({
      title,
      contents,
      currentUser,
      blogid,
      url,
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
