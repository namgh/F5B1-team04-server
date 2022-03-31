import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogCommentService } from './blogcomment.service';
import { BlogComment } from './entities/blogcomment.entity';

@Resolver()
export class BlogCommentResolver {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Query(() => [BlogComment])
  async fetchAllBlogcomment(@Args('blogid') blogid: string) {
    return this.blogCommentService.findAll({
      blogid,
    });
  }

  @Query(() => [BlogComment])
  async fetchBlogCommentorderby(@Args('blogid') blogid: string) {
    return this.blogCommentService.fetchBlogCommentorderby({ blogid });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogComment)
  async createBlogComment(
    @Args('blogid') blogid: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogCommentService.create({
      blogid,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => BlogComment)
  async updateBlogComment(
    @Args('blogid') blogid: string,
    @Args('contents') contents: string,
    @Args('blogcommentid') blogcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogCommentService.update({
      blogcommentid,
      blogid,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteBlogComment(
    @Args('blogcommentid') blogcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogCommentService.delete({
      blogcommentid,
      currentUser,
    });
  }
}
