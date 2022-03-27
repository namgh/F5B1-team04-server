import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoachColumn } from '../column/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { ColumnComment } from './entities/columncomment.entity';

@Injectable()
export class ColumnCommentService {
  constructor(
    @InjectRepository(CoachColumn)
    private readonly columnRespository: Repository<CoachColumn>,

    @InjectRepository(ColumnComment)
    private readonly columnCommentRepository: Repository<ColumnComment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({ columnId }) {
    return await this.columnCommentRepository.find({
      where: { coachColumn: { id: columnId } },
      relations: ['coachColumn', 'user'],
    });
  }

  async create({ columnId, currentUser, contents }) {
    const user = await this.userRepository.findOne({ id: currentUser.id });
    const column = await this.columnRespository.findOne({ id: columnId });
    return await this.columnCommentRepository.save({
      contents,
      user,
      coachColumn: column,
    });
  }

  async update({ commentId, contents }) {
    const columnComment = await this.columnCommentRepository.findOne({
      where: { id: commentId },
      relations: ['coachColumn', 'user'],
    });
    return await this.columnCommentRepository.save({
      ...columnComment,
      contents,
    });
  }

  async delete({ commentId, columnId, currentUser }) {
    const delRes = await this.columnCommentRepository.softDelete({
      id: commentId,
      coachColumn: { id: columnId },
      user: { id: currentUser.id },
    });

    return delRes.affected ? true : false;
  }
}
