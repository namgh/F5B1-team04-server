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
  fetchBlog() {
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

    // 2. 레디스에 검색 목록이 있다면 [product] 형식으로 반환
    if (redistemp) {
      console.log('레디스성공');
      return JSON.parse(redistemp);
    }
    // 3. 레디스에서 조회가 안된경우 elasticsearch에 있는 정보를 가져옴
    // bool 옵션에 should를 사용하면 하나라도 match되어있으면 가져옴
    // must를 사용하면 전부 match된 값만 가져옴
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
    });

    console.log(result.hits.hits);
    // 4.검색한 항목이 elasticsearch에 없을경우 null값 반환
    if (!result.hits.hits.length) return null;
    // 5. 검색한 항목이 있는경우 [Product]형식으로 값을 변경
    // 배열내에 객체로 설정하는작업
    // result.hits.hits[0]._source에 우리가 원하는 정보가 있음
    // 원하는 정보만 가져오기 위한 작업
    const resultmap = result.hits.hits.map((ele) => {
      const needresult = {};
      // 얕은복사가 되어있어서 키값을 읽어줄 수가 없음
      // 키값을 확인하기 위해서 깊은복사 사용
      const resultsource = JSON.stringify(ele._source);
      const temp = JSON.parse(resultsource);
      // '@version' 과 같은 필요없는 정보를 제거하고, 필요한 정보를 객체에 넣어주는 작업
      for (let key in temp) {
        if (!key.includes('@')) needresult[key] = temp[key];
      }
      return needresult;
    });

    // 6. 레디스에 정보 저장하기
    // 테스트를 위해 ttl:0 으로 영구저장
    await this.cacheManager.set(`title:${search}`, JSON.stringify(resultmap), {
      ttl: 30,
    });
    console.log('!!!!!성공');
    // 7. [Product] 형식으로 반환
    return JSON.parse(JSON.stringify(resultmap));
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
