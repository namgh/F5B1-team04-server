import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { Blog } from '../blog/entities/blog.entity';
import { Stack } from '../stack/entities/stack.entity';
import { User } from '../user/entities/user.entity';
import { StackComment } from './entities/stackcomment.entity';
import { StackCommentResolver } from './stackcomment.resolver';
import { StackCommentService } from './stackcomment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stack, User, StackComment])],

  providers: [
    StackCommentResolver,
    StackCommentService,
    jwtAccessStrategy,
    AuthModule,
  ],
})
export class StackCommentModule {}
