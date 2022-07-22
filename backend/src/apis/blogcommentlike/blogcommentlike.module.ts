import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { User } from '../user/entities/user.entity';
import { BlogCommentLikeResolver } from './blogcommentlike.resolver';
import { BlogCommentLikeService } from './blogcommentlike.service';
import { BlogCommentLike } from './entities/blogcommentlike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlogComment, BlogCommentLike])],
  providers: [
    jwtAccessStrategy,
    AuthModule,
    BlogCommentLikeService,
    BlogCommentLikeResolver,
  ],
})
export class BlogCommentLikeModule {}
