import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { ColumnLike } from '../columnlike/entities/columnlike.entity';
import { User } from '../user/entities/user.entity';
import { CoachColumn } from './entities/column.entity';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { query } from 'express';

@Injectable()
export class CoachColumnService {
  constructor(
    @InjectRepository(CoachColumn)
    private readonly coachColumnRepository: Repository<CoachColumn>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ColumnLike)
    private readonly columnlikeRepository: Repository<ColumnLike>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
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
      .leftJoinAndSelect('user.coachProfile', 'coach')
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
    return await this.coachColumnRepository.findOne({
      where: { id: columnId },
      relations: ['user', 'user.coachProfile'],
    });
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

  async findColumnListILike({ currentUser }) {
    return await this.columnlikeRepository.find({
      where: { user: { id: currentUser.id } },
      relations: [
        'user',
        'coachColumn',
        'coachColumn.user',
        'coachColumn.user.coachProfile',
      ],
    });
  }

  //elastic
  //
  //
  async findAllSearchArgsColumn({ search }) {
    const redisRes = await this.cacheManager.get(`column:${search}`);
    if (redisRes) return redisRes;

    const elsRes = await this.elasticsearchService.search({
      index: 'column',
      query: { match: { title: search } },
    });
    console.log('💛column', elsRes);

    const columns = elsRes.hits.hits.map((col: any) => ({
      title: col._source.title,
      contents: col._source.contents,
      likecount: col._source.likecount,
      dislikecount: col._source.dislikecount,
    }));

    await this.cacheManager.set(`column:${search}`, columns, { ttl: 0 });

    return columns;
  }

  //
  //
  //

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
    const column = await this.coachColumnRepository.findOne({
      where: { id: columnId },
      relations: ['user'],
    });
    return await this.coachColumnRepository.save({
      ...column,
      ...updateColumnInput,
    });
  }

  async delete({ columnId, currentUser }) {
    const c = await this.coachColumnRepository.findOne({
      where: { id: columnId },
      relations: ['user'],
    });
    if (c.user.id !== currentUser.id) {
      return new UnprocessableEntityException('회원님의 글이 아닙니다.');
    }
    const result = await this.coachColumnRepository.softDelete({
      id: columnId,
    });
    return result.affected ? true : false;
  }
}
