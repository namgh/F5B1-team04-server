import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { BlogCategoryTag } from '../blogcategorytag/entities/blogcategofytag.entity';
import { BlogTag } from '../blogtag/entities/blogtag.entity';
import { MainStack } from '../mainstack/entities/mainstack.entity';
import { User } from '../user/entities/user.entity';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
// import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, MainStack, BlogCategoryTag, BlogTag]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],

  providers: [BlogService, BlogResolver, jwtAccessStrategy, AuthModule],
})
export class BlogModule {}
