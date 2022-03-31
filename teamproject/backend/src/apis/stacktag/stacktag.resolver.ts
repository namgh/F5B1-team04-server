import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StackTag } from './entities/stacktag.entity';
import { StackTagService } from './stacktag.service';

@Resolver()
export class StackTagResolver {
  constructor(private readonly stacktagservice: StackTagService) {}

  @Mutation(() => [StackTag])
  async createBlogManyTag(
    @Args({ name: 'stacktag', type: () => [String] }) stacktag: string[],
  ) {
    return await this.stacktagservice.create({ stacktag });
  }

  @Mutation(() => StackTag)
  async createBlogTag(@Args('stacktag') stacktag: string) {
    return await this.stacktagservice.createone({ stacktag });
  }

  @Mutation(() => [StackTag])
  async updateBlogtag(
    @Args('stacktag') stacktag: string,
    @Args('updateblogtag') updatestacktag: string,
  ) {
    return await this.stacktagservice.updateBlogTag({
      stacktag,
      updatestacktag,
    });
  }

  @Mutation(() => StackTag)
  async deleteBlogTag(@Args('stacktag') stacktag: string) {
    return await this.stacktagservice.deleteBlogtag({ stacktag });
  }
}
