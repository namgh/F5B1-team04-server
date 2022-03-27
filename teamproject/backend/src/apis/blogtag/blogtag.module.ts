import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogTag } from './entities/blogtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlogTag, Blog])],
  providers: [],
})
export class BlogTagModule {}
