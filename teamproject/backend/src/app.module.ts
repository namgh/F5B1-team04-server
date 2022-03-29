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
//import { CoachModule } from './apis/coach/coach.module';
import { StackModule } from './apis/stack/stack.module';
import { StacklikeModule } from './apis/stacklike/stacklike.module';
import { StackCommentModule } from './apis/stackcomment/stackcomment.module';
import { BlogCommentLikeModule } from './apis/blogcommentlike/blogcommentlike.module';
import { CoachModule } from './apis/coach/coach.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ColumnlikeModule } from './apis/columnlike/columnlike.module';
import { ColumnCommentModule } from './apis/columncomment/comment.module';
import { CoachColumnModule } from './apis/column/column.module';
import { BlogTagModule } from './apis/blogtag/blogtag.module';
import { BlogCategoryTagModule } from './apis/blogcategorytag/blogcategorytag.module';
import { QuestionModule } from './apis/question/question.module';
import { AnswerModule } from './apis/answer/answer.module';
import { AnswercommentModule } from './apis/answercomment/answercomment.module';
import { AnswerlikeModule } from './apis/answerlike/answerlike.module';
import { OrderModule } from './apis/order/order.module';
import { DepositModule } from './apis/deposit/deposit.module';
import { StackTagModule } from './apis/stacktag/stacktag.module';

@Module({
  imports: [
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
    ColumnlikeModule,
    ColumnCommentModule,
    CoachColumnModule,
    BlogCategoryTagModule,
    BlogTagModule,
    QuestionModule,
    AnswerModule,
    AnswercommentModule,
    AnswerlikeModule,
    OrderModule,
    DepositModule,
    StackTagModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://localhost:3000',
          'http://cucutoo.shop',
          'https://cucutoo.shop',
          'http://cucutoo.com',
          'http://cucutoo.com',
        ],
        Credential: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_database',
      port: 3306,
      username: 'root',
      // password: 'root',
      // database: 'cu2project',
      password: '1q2w3e4r',
      database: 'teamproject',
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
