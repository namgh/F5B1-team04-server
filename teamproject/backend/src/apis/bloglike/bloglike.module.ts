import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogLikeResolver } from './bloglike.resolver';
import { BlogLikeService } from './bloglike.service';
import { BlogLike } from './entities/bloglike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blog, BlogLike])],
  providers: [jwtAccessStrategy, AuthModule, BlogLikeService, BlogLikeResolver],
})
export class BloglikeModule {}
