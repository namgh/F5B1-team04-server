import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  providers: [FollowService, FollowResolver],
})
export class FollowModule {}
