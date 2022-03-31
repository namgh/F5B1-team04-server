import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { Stack } from './entities/stack.entity';
import { StackResolver } from './stack.resolver';
import { StackService } from './stack.service';

// import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stack, User])],

  providers: [StackService, StackResolver, jwtAccessStrategy, AuthModule],
})
export class StackModule {}
