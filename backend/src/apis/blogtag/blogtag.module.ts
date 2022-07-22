import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogTagResolver } from './blogtag.resolver';
import { BlogTagService } from './blogtag.service';
import { BlogTag } from './entities/blogtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlogTag, Blog])],
  providers: [BlogTagResolver, BlogTagService],
})
export class BlogTagModule {}
