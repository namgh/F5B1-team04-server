import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { StackTag } from '../stacktag/entities/stacktag.entity';
import { User } from '../user/entities/user.entity';
import { Stack } from './entities/stack.entity';
import { StackResolver } from './stack.resolver';
import { StackService } from './stack.service';

// import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stack, User, StackTag])],

  providers: [StackService, StackResolver, jwtAccessStrategy, AuthModule],
})
export class StackModule {}
