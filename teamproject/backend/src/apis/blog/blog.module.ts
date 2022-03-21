import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
// import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User])],

  providers: [BlogService, BlogResolver, jwtAccessStrategy, AuthModule],
})
export class BlogModule {}
