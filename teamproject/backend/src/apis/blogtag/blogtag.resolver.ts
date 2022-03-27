import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BlogTagService } from './blogtag.service';
import { BlogTag } from './entities/blogtag.entity';

@Resolver()
export class BlogTagResolver {
  constructor(private readonly blogtagservice: BlogTagService) {}

  @Mutation(() => [BlogTag])
  async createBlogTag(@Args('blogtag') blogtag: string[]) {
    return await this.blogtagservice.create({ blogtag });
  }
}
