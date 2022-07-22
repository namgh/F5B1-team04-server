import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { BlogCategoryTagResolver } from './blogcategofytag.resolver';
import { BlogCategoryTagService } from './blogcategofytag.service';
import { BlogCategoryTag } from './entities/blogcategofytag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlogCategoryTag, Blog])],
  providers: [BlogCategoryTagResolver, BlogCategoryTagService],
})
export class BlogCategoryTagModule {}
