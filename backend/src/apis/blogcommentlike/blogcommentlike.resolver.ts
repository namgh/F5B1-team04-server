import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { BlogCommentLikeService } from './blogcommentlike.service';
import { BlogCommentLike } from './entities/blogcommentlike.entity';

@Resolver()
export class BlogCommentLikeResolver {
  constructor(
    private readonly blogcommentlikeservice: BlogCommentLikeService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BlogComment])
  async fetchBlogcommentlike(@CurrentUser() currentUser: ICurrentUser) {
    return this.blogcommentlikeservice.findBlogcommentlike({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogCommentLike)
  async Blogcommentliketoggle(
    @Args('blogcommentid') blogcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogcommentlikeservice.like({ blogcommentid, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogCommentLike)
  async Blogcommentdisliketoggle(
    @Args('blogcommentid') blogcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogcommentlikeservice.dislike({ blogcommentid, currentUser });
  }
}
