import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { UserModule } from './apis/user/user.module';
import { BlogModule } from './apis/blog/blog.module';
import { BlogCommentModule } from './apis/blogcomment/blogcomment.module';
import { BloglikeModule } from './apis/bloglike/bloglike.module';
import { StackModule } from './apis/stack/stack.module';
import { StacklikeModule } from './apis/stacklike/stacklike.module';
import { StackCommentModule } from './apis/stackcomment/stackcomment.module';
import { BlogCommentLikeModule } from './apis/blogcommentlike/blogcommentlike.module';
import { CoachModule } from './apis/coach/coach.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { CoachColumnModule } from './apis/column/column.module';
import { ColumnlikeModule } from './apis/columnlike/columnlike.module';
import { ColumnCommentModule } from './apis/columncomment/comment.module';

@Module({
  imports: [
    ColumnCommentModule,
    ColumnlikeModule,
    CoachColumnModule,
    CoachModule,
    PointTransactionModule,
    UserModule,
    AuthModule,
    BlogModule,
    BlogCommentModule,
    BloglikeModule,
    StackModule,
    StacklikeModule,
    StackCommentModule,
    BlogCommentLikeModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'cu2project',
      // password: '1q2w3e4r',
      // database: 'teamproject',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }), //
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my_redis:6379',
      isGlobal: true,
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
