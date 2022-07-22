import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { Stack } from '../stack/entities/stack.entity';
import { User } from '../user/entities/user.entity';
import { StackTag } from './entities/stacktag.entity';
import { StackTagResolver } from './stacktag.resolver';
import { StackTagService } from './stacktag.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, StackTag, Stack])],
  providers: [StackTagResolver, StackTagService],
})
export class StackTagModule {}
