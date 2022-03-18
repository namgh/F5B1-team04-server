import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';

@Module({
  imports: [
    UserModule,//
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/common/graphql/schema.gql'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'cu2_database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'cu2',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true
    })
  ],
})
export class AppModule {}
