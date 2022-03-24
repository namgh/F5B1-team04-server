import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { ColumnLike } from '../columnlike/entities/columnlike.entity';
import { User } from '../user/entities/user.entity';
import { CoachColumn } from './entities/column.entity';

@Injectable()
export class CoachColumnService {
  constructor(
    @InjectRepository(CoachColumn)
    private readonly coachColumnRepository: Repository<CoachColumn>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.coachColumnRepository.find({
      relations: ['user'],
    });
  }

  async findRecommendColumnList({ pageNum, itemcount }) {
    return await getRepository(CoachColumn)
      .createQueryBuilder('column')
      .leftJoinAndSelect('column.user', 'user')
      .orderBy('column.likecount', 'DESC')
      .skip((pageNum - 1) * itemcount)
      .take(itemcount)
      .getMany();
  }

  async findHighHitColumnList({ pageNum, itemcount }) {
    const columns = await getRepository(CoachColumn)
      .createQueryBuilder('column')
      .orderBy('column.hits', 'DESC')
      .leftJoinAndSelect('column.user', 'user')
      .leftJoinAndSelect('user.coachProfile', 'profile')
      .skip((pageNum - 1) * itemcount)
      .take(itemcount)
      .getMany();

    // console.log(columns);
    // console.log(columns[2].user.coachProfile);
    return columns;
  }

  async findColumn({ columnId }) {
    return await this.coachColumnRepository.findOne({ id: columnId });
  }

  async findMyColumn({ currentUser }) {
    const columns = await this.coachColumnRepository.find({
      where: {
        user: { id: currentUser.id },
      },
      relations: ['user'],
    });
    // console.log(columns);
    return columns;
  }

  async create({ currentUser, createColumnInput }) {
    const user = await this.userRepository.findOne({ id: currentUser.id });
    return await this.coachColumnRepository.save({
      ...createColumnInput,
      user,
    });
  }

  async increaseHit({ columnId }) {
    const column = await this.coachColumnRepository.findOne({ id: columnId });
    return await this.coachColumnRepository.save({
      ...column,
      hits: ++column.hits,
    });
  }

  async update({ columnId, updateColumnInput }) {
    return await this.coachColumnRepository.save({
      ...(await this.coachColumnRepository.findOne({ id: columnId })),
      ...updateColumnInput,
    });
  }

  async delete({ columnId }) {
    const result = await this.coachColumnRepository.softDelete({
      id: columnId,
    });
    return result.affected ? true : false;
  }
}
