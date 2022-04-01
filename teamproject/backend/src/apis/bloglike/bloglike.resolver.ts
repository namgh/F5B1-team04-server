import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Blog } from '../blog/entities/blog.entity';
import { BlogLikeService } from './bloglike.service';
import { BlogLike } from './entities/bloglike.entity';

@Resolver()
export class BlogLikeResolver {
  constructor(private readonly bloglikeservice: BlogLikeService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Blog])
  async fetchBloglike(@CurrentUser() currentUser: ICurrentUser) {
    return this.bloglikeservice.findBloglike({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogLike)
  async Blogliketoggle(
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.bloglikeservice.like({ blogid, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogLike)
  async Blogdisliketoggle(
    @Args('blogid') blogid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.bloglikeservice.dislike({ blogid, currentUser });
  }
}
