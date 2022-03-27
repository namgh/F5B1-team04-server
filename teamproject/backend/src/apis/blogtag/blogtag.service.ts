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
    const isblogtag = await this.blogtagrepository.findOne({ tag: blogtag });

    if (isblogtag) throw new error();

    return await this.blogtagrepository.save({ tag: blogtag });
  }
}
