import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Repository } from 'typeorm';
import { StackTag } from './entities/stacktag.entity';

@Injectable()
export class StackTagService {
  constructor(
    @InjectRepository(StackTag)
    private readonly stacktagrepository: Repository<StackTag>,
  ) {}

  async createone({ stacktag }) {
    return await this.stacktagrepository.save({ tag: stacktag });
  }

  async updateBlogTag({ stacktag, updatestacktag }) {
    const stacktagId = await this.stacktagrepository.findOne({ tag: stacktag });

    return await this.stacktagrepository.save({
      ...stacktagId,
      tag: updatestacktag,
    });
  }

  async deleteBlogtag({ stacktag }) {
    const result = await this.stacktagrepository.softDelete({
      tag: stacktag,
    });
    return result.affected ? true : false;
  }
}
