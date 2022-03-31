import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { StackComment } from '../stackcomment/entities/stackcomment.entity';
import { StackCommentService } from '../stackcomment/stackcomment.service';
import { User } from '../user/entities/user.entity';
import { StackCommentLike } from './entities/stackcommentlike.entity';
import { StackCommentLikeResolver } from './stackcommentlike.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, StackComment, StackCommentLike])],
  providers: [
    jwtAccessStrategy,
    AuthModule,
    StackCommentLikeResolver,
    StackCommentService,
  ],
})
export class StackCommentLikeModule {}
