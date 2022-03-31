import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Repository } from 'typeorm';
import { BlogTag } from './entities/blogtag.entity';

@Injectable()
export class BlogTagService {
  constructor(
    @InjectRepository(BlogTag)
    private readonly blogtagrepository: Repository<BlogTag>,
  ) {}

  async create({ blogtag }) {
    return await Promise.all(
      blogtag.map((ele, i) => {
        return new Promise(async (resolve, reject) => {
          const findtag = await this.blogtagrepository.findOne({ tag: ele });
          if (!findtag) return await this.blogtagrepository.save({ tag: ele });
        });
      }),
    );
  }

  async createone({ blogtag }) {
    return await this.blogtagrepository.save({ tag: blogtag });
  }

  async updateBlogTag({ blogtag, updateblogtag }) {
    const blogtagId = await this.blogtagrepository.findOne({ tag: blogtag });

    return await this.blogtagrepository.save({
      ...blogtagId,
      tag: updateblogtag,
    });
  }

  async deleteBlogtag({ blogtag }) {
    const result = await this.blogtagrepository.softDelete({
      tag: blogtag,
    });
    return result.affected ? true : false;
  }
}
