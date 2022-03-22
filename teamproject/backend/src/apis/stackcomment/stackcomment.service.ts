import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { Stack } from '../stack/entities/stack.entity';
import { User } from '../user/entities/user.entity';
import { StackComment } from './entities/stackcomment.entity';

@Injectable()
export class StackCommentService {
  constructor(
    @InjectRepository(Stack)
    private readonly stackrepository: Repository<Stack>,

    @InjectRepository(StackComment)
    private readonly stackCommentrepository: Repository<StackComment>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async create({ stackid, contents, currentUser }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });
    const stack = await this.stackrepository.findOne({
      id: stackid,
    });
    return await this.stackCommentrepository.save({
      contents,
      user,
      stack,
    });
  }

  async update({ stackcommentid, stackid, contents, currentUser }) {
    const blogcomment = await this.stackCommentrepository.findOne({
      id: stackcommentid,
    });
    return await this.stackCommentrepository.save({
      ...blogcomment,
      contents,
    });
  }

  async delete({ stackcommentid }) {
    const result = await this.stackCommentrepository.softDelete({
      id: stackcommentid,
    });
    return result.affected ? true : false;
  }

  async findAll({ stackid }) {
    return await this.stackCommentrepository.find({
      where: { stack: stackid },
    });
  }
}
