import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { Blog } from '../blog/entities/blog.entity';
import { Stack } from '../stack/entities/stack.entity';
import { User } from '../user/entities/user.entity';
import { StackLike } from './entities/stacklike.entity';
import { StackLikeResolver } from './stacklike.resolver';
import { StackLikeService } from './stacklike.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Stack, StackLike])],
  providers: [
    jwtAccessStrategy,
    AuthModule,
    StackLikeService,
    StackLikeResolver,
  ],
})
export class StacklikeModule {}
