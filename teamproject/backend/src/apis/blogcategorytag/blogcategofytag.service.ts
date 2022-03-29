import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Repository } from 'typeorm';
import { BlogCategoryTag } from './entities/blogcategofytag.entity';

@Injectable()
export class BlogCategoryTagService {
  constructor(
    @InjectRepository(BlogCategoryTag)
    private readonly blogtagrepository: Repository<BlogCategoryTag>,
  ) {}

  async create({ blogcategorytag }) {
    return await Promise.all(
      blogcategorytag.map((ele, i) => {
        return new Promise(async (resolve, reject) => {
          const findtag = await this.blogtagrepository.findOne({ tag: ele });
          if (!findtag) return await this.blogtagrepository.save({ tag: ele });
        });
      }),
    );
  }

  async createone({ blogcategorytag }) {
    return await this.blogtagrepository.save({ tag: blogcategorytag });
  }

  async updateBlogTag({ blogcategorytag, updateblogtag }) {
    const blogtagId = await this.blogtagrepository.findOne({
      tag: blogcategorytag,
    });

    return await this.blogtagrepository.save({
      ...blogtagId,
      tag: updateblogtag,
    });
  }

  async deleteBlogtag({ blogcategorytag }) {
    const result = await this.blogtagrepository.softDelete({
      tag: blogcategorytag,
    });
    return result.affected ? true : false;
  }
}
