import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { StackComment } from '../stackcomment/entities/stackcomment.entity';
import { User } from '../user/entities/user.entity';
import { StackCommentLike } from './entities/stackcommentlike.entity';
import { StackCommentLikeResolver } from './stackcommentlike.resolver';
import { StackCommentLikeService } from './staclcommentlike.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, StackComment, StackCommentLike])],
  providers: [
    jwtAccessStrategy,
    AuthModule,
    StackCommentLikeResolver,
    StackCommentLikeService,
  ],
})
export class StackCommentLikeModule {}
