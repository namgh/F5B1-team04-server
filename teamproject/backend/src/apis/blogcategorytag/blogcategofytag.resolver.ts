import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BlogCategoryTagService } from './blogcategofytag.service';
import { BlogCategoryTag } from './entities/blogcategofytag.entity';

@Resolver()
export class BlogCategoryTagResolver {
  constructor(
    private readonly blogcategorytagservice: BlogCategoryTagService,
  ) {}

  @Mutation(() => [BlogCategoryTag])
  async createBlogManycategoryTag(
    @Args({ name: 'blogcategorytag', type: () => [String] })
    blogcategorytag: string[],
  ) {
    return await this.blogcategorytagservice.create({ blogcategorytag });
  }

  @Mutation(() => BlogCategoryTag)
  async createBlogcategoryTag(
    @Args('blogcategorytag') blogcategorytag: string,
  ) {
    return await this.blogcategorytagservice.createone({ blogcategorytag });
  }

  @Mutation(() => [BlogCategoryTag])
  async updateBlogcategorytag(
    @Args('blogcategorytag') blogcategorytag: string,
    @Args('updateblogtag') updateblogtag: string,
  ) {
    return await this.blogcategorytagservice.updateBlogTag({
      blogcategorytag,
      updateblogtag,
    });
  }

  @Mutation(() => BlogCategoryTag)
  async deleteBlogcategoryTag(
    @Args('blogcategorytag') blogcategorytag: string,
  ) {
    return await this.blogcategorytagservice.deleteBlogtag({ blogcategorytag });
  }
}
